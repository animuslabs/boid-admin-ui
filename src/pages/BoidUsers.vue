<template>
  <q-page class="row height:100%">
    <q-card class="q-ma-md">
      <div v-if="isLoading">
        Loading...
      </div>
      <div v-else>
        <div class="date-selection q-pa-md">
          <q-input
            filled
            v-model="search"
            placeholder="Search by BOID ID"
            debounce="300"
          />
          <label for="from-date">From: </label>
          <input type="date" id="from-date" v-model="fromDate">
          <label for="to-date">To: </label>
          <input type="date" id="to-date" v-model="toDate">

          <q-btn @click="manualFetchData" color="primary">
            Charts
          </q-btn>
        </div>
        <q-bar :style="{ backgroundColor: 'var(--ltbeige)' }">
          <span v-if="!selectedBoidId">Choose your boid_id in the table and set the date range.</span>
          <span v-if="selectedBoidId">{{ selectedInfo }}</span>
        </q-bar>
        <q-table
          :rows="filteredData"
          :columns="columns"
          :pagination="pagination"
          dense
          row-key="boid_id"
        >
          <template #body="props">
            <q-tr :props="props" :class="{ 'selected-row': props.row.boid_id === selectedBoidId }" @click="selectRow(props.row.boid_id)">
              <q-td
                key="boid_id"
                :props="props"
              >
                {{ props.row.boid_id }}
              </q-td>
              <q-td
                key="owners"
                :props="props"
              >
                {{ props.row.owners }}
              </q-td>
              <q-td
                key="powered_stake"
                :props="props"
              >
                {{ props.row.powered_stake }}
              </q-td>
              <q-td
                key="max_powered_stake"
                :props="props"
              >
                {{ props.row.max_powered_stake }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-card>
    <q-card v-show="showCharts" class="q-ma-md">
      <div class="q-ma-sm">
        Staking
      </div>
      <StakingChartComponent
        class="q-ma-sm"
        ref="stakingChartsComponentRef"
        :boid-id="selectedBoidId"
        :from-date="fromDate"
        :to-date="toDate"
      />
    </q-card>
    <q-separator />
    <q-card v-show="showCharts" class="q-ma-md">
      <div class="q-ma-sm">
        Tokens Minted
      </div>
      <TokensMintedChartComponent
        class="q-ma-sm"
        ref="mintChartsComponentRef"
        :boid-id="selectedBoidId"
        :from-date="fromDate"
        :to-date="toDate"
      />
    </q-card>
    <q-card v-show="showCharts" class="q-ma-md">
      <div class="q-ma-sm">
        Boid Power
      </div>
      <PowerChartComponent
        class="q-ma-sm"
        ref="powerChartsComponentRef"
        :boid-id="selectedBoidId"
        :from-date="fromDate"
        :to-date="toDate"
      />
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, Ref, watch } from "vue"
import { userStore } from "src/stores/usersStore"
import { AccountRowData } from "src/types/types-stores"
import { storeToRefs } from "pinia"
import StakingChartComponent from "src/components/StakingChartComponent.vue"
import TokensMintedChartComponent from "src/components/TokensMintedChartComponent.vue"
import PowerChartComponent from "src/components/PowerChartComponent.vue"

const store = userStore()
const { isLoading, organizedData: organizedDataRaw } = storeToRefs(store)
const organizedData = organizedDataRaw as Ref<AccountRowData[]>
const search = ref("")
const pagination = ref({
  sortBy: "powered_stake",
  descending: true,
  page: 1,
  rowsPerPage: 5
})
const selectedBoidId = ref("") // Reactive property to store the selected boid_id
// Use store's default values for dates
const fromDate = ref(store.fromDate)
const toDate = ref(store.toDate)

// for the button to manually fetch data
const mintChartsComponentRef = ref()
const powerChartsComponentRef = ref()
const stakingChartsComponentRef = ref()
const showCharts = ref(false)
const manualFetchData = async() => {
  if (powerChartsComponentRef.value && mintChartsComponentRef.value && stakingChartsComponentRef.value) {
    await mintChartsComponentRef.value.manualMintDataFetch()
    await powerChartsComponentRef.value.manualPowerDataFetch()
    await stakingChartsComponentRef.value.manualStakingDataFetch()
    showCharts.value = true
    console.log("Show Charts:", showCharts.value)
  }
}


watch(fromDate, (newDate) => {
  console.log("From date changed to:", newDate)
  store.setFromDate(newDate)
  console.log("New from date in the store is:", store.fromDate)
})

watch(toDate, (newDate) => {
  console.log("To date changed to:", newDate)
  store.setToDate(newDate)
  console.log("New to date in the store is:", store.toDate)
})
const selectRow = (boidId:string) => {
  console.log("Selected row with boid_id:", boidId)
  selectedBoidId.value = boidId // Update local reactive variable
  store.setSelectedBoidId(boidId) // Update store's selectedBoidId
  console.log("boid_id in the store is now:", store.selectedBoidId)
}


const selectedInfo = computed(() => {
  if (selectedBoidId.value) {
    return `| boid_id chosen: ${selectedBoidId.value} with a date from ${fromDate.value} to ${toDate.value} |`
  }
  return "Choose your boid_id in the table and set the date range."
})


const filteredData = computed(() => {
  // Ensure organizedData is always treated as an array
  const data = Array.isArray(organizedData.value) ? organizedData.value : []
  console.log("Computing filteredData with search:", search.value)
  console.log("Current organizedData:", data)

  if (!search.value) {
    return data
  } else {
    const searchLower = search.value.toLowerCase()
    return data.filter(row =>
      row.boid_id.toLowerCase().includes(searchLower) ||
      row.owners.toLowerCase().includes(searchLower)
    )
  }
})

const columns = ref([
  {
    name: "boid_id",
    label: "BOID ID",
    field: "boid_id",
    sortable: true
  },
  {
    name: "owners",
    label: "Owners",
    field: (row:AccountRowData) => row.owners,
    sortable: true
  },
  {
    name: "powered_stake",
    label: "Powered Stake",
    field: (row:AccountRowData) => row.powered_stake,
    sortable: true
  },
  {
    name: "max_powered_stake",
    label: "Max Powered Stake",
    field: (row:AccountRowData) => row.max_powered_stake,
    sortable: true
  }
])

onMounted(async() => {
  await store.fetchAccTableData()
  // console.log("Store State:", store.$state.organizedDataRaw)
  console.log("Data fetched:", store.organizedData)
})


</script>
<style scoped lang="scss">
.date-selection {
  display: flex;
  align-items: center;
  gap: 10px;
}
.selected-row {
  background-color: $ltpurple;
}

</style>
