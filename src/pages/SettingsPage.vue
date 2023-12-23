<template>
  <q-page class="flex flex-center">
    <q-card class="my-card" flat bordered>
      <q-card-section class="flex flex-center">
        <q-chip color="primary" outline square text-color="white">
          <q-icon size="20px" name="south" /> Choose your settings <q-icon size="20px" name="south" />
        </q-chip>
      </q-card-section>

      <q-tabs v-model="tab" active-bg-color="primary" active-color="white" class="full-width-tabs">
        <q-tab label="Chains" name="chains-tab" />
        <q-tab label="Multi-Sign" name="msign-tab" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="chains-tab">
          <q-splitter v-model="splitterModel" style="height: 375px">
            <!-- Pane for tabs -->
            <template #before>
              <q-tabs
                v-model="selectedChainName"
                vertical
                class="text-primary"
                style="height: 100%;"
                active-bg-color="primary"
                active-color="white"
              >
                <q-tab
                  v-for="chain in chains"
                  :key="chain.name"
                  :name="chain.name"
                  :label="chain.name"
                  :color="selectedChain && chain.name === selectedChain.name ? 'primary' : 'secondary'"
                  @click="selectChain(chain.name)"
                />
              </q-tabs>
            </template>

            <!-- Pane for chain data -->
            <template #after>
              <q-card-section class="text-center">
                <div v-if="selectedChain">
                  <q-btn icon="refresh" label="auto refresh every 10s" flat />
                  <q-separator />
                  <div v-if="selectedChain.data && Object.keys(selectedChain.data).length > 0">
                    <table dense class="q-table">
                      <thead>
                        <tr>
                          <th>Node Name</th>
                          <th>Reply (ms)</th>
                          <th>Success</th>
                          <th>Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(response, nodeName) in selectedChain.data"
                          :key="nodeName"
                          :class="{ 'selected-row': response.url === (selectedUrl ?? ''), 'row-failure': !response.success, 'row-success': response.success, }"
                        >
                          <td>{{ response.node_name }}</td>
                          <td>{{ response.duration }}</td>
                          <td>{{ response.success ? 'YES' : 'FAULT' }}</td>
                          <td>
                            <q-btn :label="response.url === (selectedUrl ?? '') ? 'Selected' : 'Select'" @click="setActiveEndpoint(response.url)" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </q-card-section>
            </template>
          </q-splitter>
        </q-tab-panel>

        <q-tab-panel name="msign-tab">
          <div>
            <q-toggle
              v-model="toggleState"
              color="green"
              label="Multi-Signature Mode"
              @input="toggleState"
              class="q-mb-md q-mr-lg"
            />
          </div>
          <div>
            <EditSignersComponent />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref, ComputedRef, watch, onUnmounted, onMounted, onBeforeUnmount } from "vue"
import { useSessionStore } from "src/stores/sessionStore"
import { useApiStore } from "src/stores/apiStore"
import { EOSendpoints, TelosEndpoints, TelosTestnetEndpoints } from "src/lib/config"
import { fetchDataFromEndpoints } from "src/lib/apiFetchData"
import EditSignersComponent from "src/components/EditSignersComponent.vue"

type ApiResponse = {
  node_name:string;
  server_version_string:string;
  duration:number;
  success:boolean;
  url:string;
};

type Chain = {
  name:string;
  fetchData:() =>Promise<void>;
  data:ComputedRef<ApiResponse[]>;
};


const store = useSessionStore()
const apiStore = useApiStore()
const selectedChain = ref<Chain | null>(null)
const selectedUrl = ref<string>("")

const tab = ref("chains-tab")
const splitterModel = ref(30) // Adjust for initial splitter size
const selectedChainName = ref("") // Model for selected chain tab

const refreshInterval = ref<number | null>(null)

const toggleState = computed({
  get: () => store.multiSignToggleState,
  set: (value) => store.setToggleState(value)
})

const initialDataFromEndpoints = (endpoints:string[][]):ApiResponse[] => {
  return endpoints.map(endpoint => ({
    node_name: endpoint[0] || "Unknown", // Provide a default value if undefined
    server_version_string: "",
    duration: 0,
    success: false,
    url: endpoint[1] || "" // Provide a default value if undefined
  }))
}
const mergeDataWithInitial = (initialNodes:ApiResponse[], liveResponses:Record<string, ApiResponse>):ApiResponse[] => {
  // Create a map from the initial nodes for easy lookup
  const nodeMap = new Map(initialNodes.map(node => [node.node_name, node]))

  // Update the map with live data
  Object.values(liveResponses).forEach(response => {
    if (response.node_name) {
      nodeMap.set(response.node_name, response)
    }
  })

  // Convert the map back into an array
  return Array.from(nodeMap.values())
}

const chains = ref<Chain[]>([
  {
    name: "Telos",
    fetchData: () => fetchDataFromEndpoints(TelosEndpoints, "Telos"),
    data: computed(() => {
      const liveResponses = apiStore.getResponsesByChain("Telos")
      const initialNodes = initialDataFromEndpoints(TelosEndpoints)
      return mergeDataWithInitial(initialNodes, liveResponses as unknown as Record<string, ApiResponse>)
    })

  },
  {
    name: "EOS",
    fetchData: () => fetchDataFromEndpoints(EOSendpoints, "EOS"),
    data: computed(() => {
      const liveResponses = apiStore.getResponsesByChain("EOS")
      const initialNodes = initialDataFromEndpoints(EOSendpoints)
      return mergeDataWithInitial(initialNodes, liveResponses as unknown as Record<string, ApiResponse>)
    })

  },
  {
    name: "Telos Testnet",
    fetchData: () => fetchDataFromEndpoints(TelosTestnetEndpoints, "Telos Testnet"),
    data: computed(() => {
      const liveResponses = apiStore.getResponsesByChain("Telos Testnet")
      const initialNodes = initialDataFromEndpoints(TelosTestnetEndpoints)
      return mergeDataWithInitial(initialNodes, liveResponses as unknown as Record<string, ApiResponse>)
    })

  }
])

const handleVisibilityChange = () => {
  if (document.visibilityState === "visible") {
    startAutoRefresh()
  } else {
    if (refreshInterval.value !== null) {
      clearInterval(refreshInterval.value)
      refreshInterval.value = null
    }
  }
}

const startAutoRefresh = () => {
  if (selectedChain.value && !refreshInterval.value && document.visibilityState === "visible") {
    refreshInterval.value = setInterval(async() => {
      if (selectedChain.value && selectedChain.value.fetchData) {
        await selectedChain.value.fetchData()
      }
    }, 10000) as unknown as number // Explicitly cast to number
  }
}

const selectChain = async(chainName:string) => {
  const chain = chains.value.find(c => c.name === chainName)
  if (chain) {
    selectedChain.value = chain
    await selectedChain.value.fetchData()
    startAutoRefresh()
  }
}

const setActiveEndpoint = async(url:string) => {
  if (!selectedChain.value) {
    console.error("No chain selected")
    return
  }

  selectedUrl.value = url // Track the selected URL
  const chainName = selectedChain.value.name

  console.log("setActiveEndpoint", chainName, url)
  apiStore.updateChainUrl(chainName, url)
  console.log("Active endpoint set to", url)
}


watch(selectedChain, () => {
  // Start auto refresh when the selected chain changes
  startAutoRefresh()
})
onMounted(() => {
  document.addEventListener("visibilitychange", handleVisibilityChange)
})
onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", handleVisibilityChange)
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
onUnmounted(() => {
  // Clear interval when component is unmounted
  if (refreshInterval.value !== null) {
    clearInterval(refreshInterval.value)
  }
})

const username = computed(() => store.username)
console.log("username", username)

</script>

<style scoped lang="scss">
.q-card {
  min-width: 600px;
  max-width: 90%;
  max-height: fit-content;
}
.selected-row {
  background-color: $primary;
  color: white !important;
}
.full-width-tabs .q-tab {
  flex: 1; /* Distributes width equally */
}
.row-failure {
    color: rgb(255, 0, 0);
  }
.row-success {
    color: green;
  }
</style>
