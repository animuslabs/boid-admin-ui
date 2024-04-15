<template>
  <q-page class="fit column wrap content-around">
    <q-card class="q-ma-md form-card col-auto">
      <div>
        <div class="date-selection q-pa-md">
          <label for="from-date">From: </label>
          <input type="date" id="from-date" v-model="fromDate">
          <label for="to-date">To: </label>
          <input type="date" id="to-date" v-model="toDate">
          <!-- Dropdown for selecting an Oracle -->
          <q-select
            filled
            v-model="oracle"
            :options="oracles"
            label="Select Oracle"
            emit-value
            map-options
            style="min-width: 250px;"
          />
          <q-btn @click="manualFetchData" color="primary">
            Charts
          </q-btn>
        </div>
      </div>
    </q-card>
    <q-card v-show="showCharts" class="q-ma-md col-auto">
      <OraclesComponent
        class="q-ma-sm"
        ref="oraclesComponentRef"
        :from-date="fromDate"
        :to-date="toDate"
        :oracle="oracle"
      />
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { userStore } from "src/stores/usersStore"
import OraclesComponent from "src/components/OraclesComponent.vue"

const store = userStore()

// Use store's default values for dates
const fromDate = ref(store.fromDate)
const toDate = ref(store.toDate)
const oracle = ref("work1.animus") // Default selected oracle
const oracles = ref([
  { label: "Seth's Worker", value: "work1.animus" },
  { label: "John's Worker", value: "progrediallc" },
  { label: "Gary's Worker", value: "telosmetrics" }
]) // Available oracles

// for the button to manually fetch data
const oraclesComponentRef = ref()
const showCharts = ref(false)
const manualFetchData = async() => {
  if (oraclesComponentRef.value) {
    await oraclesComponentRef.value.manualOracleDataFetch()
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

</script>
<style scoped lang="scss">
.date-selection {
  display: flex;
  align-items: center;
  gap: 10px;
}
.form-card {
  width: 100%;
  max-width: 800px;  // Sets a fixed width to the card
  max-height: 90px;
}
</style>
