<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else>
      <div class="q-pa-md">
        <q-input
          filled
          v-model="search"
          placeholder="Search by BOID ID"
          debounce="300"
        />
      </div>
      <q-table
        :rows="filteredData"
        :columns="columns"
        row-key="boid_id"
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td
              key="boid_id"
              :props="props"
            >
              {{ props.row.boid_id }}
            </q-td>
            <q-td
              key="eosAccount"
              :props="props"
            >
              {{ props.row.meta.text.eosAccount }}
            </q-td>
            <q-td
              key="telosAccount"
              :props="props"
            >
              {{ props.row.meta.text.telosAccount }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, Ref } from "vue"
import { userStore } from "../stores/usersStore"
import { AccountRowData } from "../lib/types"
import { storeToRefs } from "pinia"

export default defineComponent({
  name: "IndexPage",
  setup() {
    const store = userStore()
    const { isLoading, organizedData: organizedDataRaw } = storeToRefs(store)
    const organizedData = organizedDataRaw as Ref<AccountRowData[]>
    const search = ref("")
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
      row.meta.text.eosAccount.toLowerCase().includes(searchLower) ||
      row.meta.text.telosAccount.toLowerCase().includes(searchLower)
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
        name: "eosAccount",
        label: "EOS Account",
        field: (row:AccountRowData) => row.meta.text.eosAccount,
        sortable: true
      },
      {
        name: "telosAccount",
        label: "Telos Account",
        field: (row:AccountRowData) => row.meta.text.telosAccount,
        sortable: true
      }
    ])

    onMounted(async() => {
      console.log("Fetching table data...")
      await store.fetchAccTableData()
      console.log("Store State:", store.$state.organizedDataRaw)
      console.log("Data fetched:", store.organizedData)
      console.log("Type of organizedData:", typeof store.organizedData)
      console.log("Is organizedData an array?:", Array.isArray(store.organizedData))
    })

    return {
      isLoading,
      organizedData,
      columns,
      filteredData,
      search
    }
  }
})
</script>
