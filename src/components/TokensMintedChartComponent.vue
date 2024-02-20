<template>
  <div ref="chartContainer" class="echart-container" />
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { storeToRefs } from "pinia"
import { userStore } from "src/stores/usersStore"
import { fetchGetLogPwrClaimData } from "src/lib/trpc/data"
import { PwrClaimData } from "src/lib/trpc/api4DeltasTypes"
import * as echarts from "echarts"
import { customTheme } from "src/lib/echarts-theme"

defineExpose({ manualMintDataFetch })

const chartContainer = ref<HTMLElement | null>(null)
const props = defineProps({
  boidId: String,
  fromDate: String,
  toDate: String
})
const store = userStore()
const { selectedBoidId } = storeToRefs(store)

const labels = {
  mint_account_earned: "Account Earned",
  mint_overstake_mint: "Overstake Mint",
  mint_power_mint: "Power Mint",
  mint_powered_stake_mint: "Powered Stake Mint",
  mint_team_cut: "Team Cut",
  mint_team_owner_earned: "Team Owner Earned"
}

// Chart setup function
const setupChart = async(logpowerclaimdata:PwrClaimData[]) => {
  await nextTick()
  if (chartContainer.value) {
    console.log(chartContainer.value?.clientWidth, chartContainer.value?.clientHeight)
    echarts.registerTheme("shine", customTheme.theme)
    const chartInstance = echarts.init(chartContainer.value, "shine")

    // Prepare the series data based on logpowerclaimdata
    const series = [
      { name: labels.mint_account_earned, type: "line", data: logpowerclaimdata.map(item => [item.timeStamp, item.mint_account_earned]) },
      { name: labels.mint_overstake_mint, type: "line", data: logpowerclaimdata.map(item => [item.timeStamp, item.mint_overstake_mint]) },
      { name: labels.mint_power_mint, type: "line", data: logpowerclaimdata.map(item => [item.timeStamp, item.mint_power_mint]) },
      { name: labels.mint_powered_stake_mint, type: "line", data: logpowerclaimdata.map(item => [item.timeStamp, item.mint_powered_stake_mint]) },
      {
        type: "pie",
        id: "pie",
        radius: "25%",
        center: ["50%", "20%"],
        data: computeInitialPieData(logpowerclaimdata), // Use the computed initial pie data here
        emphasis: { focus: "self" },
        label: { formatter: "{b}: {c} ({d}%)" }
      }
    ]

    const options = {
      legend: {},
      tooltip: { trigger: "axis", showContent: true },
      grid: {
        // Leave space at the top for the pie chart
        top: "36%", // Adjust this value as needed to accommodate the pie chart
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: { type: "time" },
      yAxis: { type: "value" },
      series
    }

    chartInstance.setOption(options)
    chartInstance.resize()
    chartInstance.on("updateAxisPointer", function(event:any) {
      const xAxisInfo = event.axesInfo[0]
      if (xAxisInfo) {
        // Assume your xAxis is a time axis and you get the timestamp directly
        const timestamp = new Date(xAxisInfo.value)

        // Find the data entry for this timestamp
        const entryForTimestamp = logpowerclaimdata.find((entry) =>
          new Date(entry.timeStamp).getTime() === timestamp.getTime()
        )

        if (entryForTimestamp) {
          // Map the relevant properties to pie chart data format
          const pieData = [
            { name: labels.mint_overstake_mint, value: entryForTimestamp.mint_overstake_mint },
            { name: labels.mint_power_mint, value: entryForTimestamp.mint_power_mint },
            { name: labels.mint_powered_stake_mint, value: entryForTimestamp.mint_powered_stake_mint }
          ]

          // Update the pie chart series
          chartInstance.setOption({
            series: [
              {
                id: "pie",
                data: pieData
              }
            ]
          })
        } else {
          console.log("No entry found for timestamp", timestamp)
        }
      }
    })
  }
  function computeInitialPieData(logpowerclaimdata:PwrClaimData[]):any[] {
  // Provide a fallback object to ensure initialEntry is never undefined.
    const initialEntry = logpowerclaimdata[0] || {
    // Provide default values for all properties of PwrClaimData.
      timeStamp: new Date(),
      boid_id: "",
      power_before: 0,
      power_after: 0,
      power_from_boosters: 0,
      mint_total: 0,
      mint_account_earned: 0,
      mint_overstake_mint: 0,
      mint_power_mint: 0,
      mint_powered_stake_mint: 0,
      mint_team_cut: 0,
      mint_team_owner_earned: 0
    }

    const pieData = [
      { name: labels.mint_overstake_mint, value: initialEntry.mint_overstake_mint },
      { name: labels.mint_power_mint, value: initialEntry.mint_power_mint },
      { name: labels.mint_powered_stake_mint, value: initialEntry.mint_powered_stake_mint },
      { name: labels.mint_team_cut, value: initialEntry.mint_team_cut },
      { name: labels.mint_team_owner_earned, value: initialEntry.mint_team_owner_earned }
    ]

    return pieData
  }
}

const fetchlogpowerclaimData = async() => {
  if (selectedBoidId.value && props.fromDate && props.toDate) {
    const fetchedData = await fetchGetLogPwrClaimData(
      selectedBoidId.value,
      props.fromDate,
      props.toDate
    )
    const logpowerclaimdata:PwrClaimData[] = fetchedData.map((item:any) => ({
      ...item,
      timeStamp: new Date(item.timeStamp)
    }))
    console.log("Fetched data Echarts: ", fetchedData)
    console.log("Log Power Claim Data: ", logpowerclaimdata)
    await setupChart(logpowerclaimdata)
  }
}

async function manualMintDataFetch() {
  console.log("Manual Fetch initiated")
  console.log("Boid ID:", selectedBoidId.value)
  console.log("From Date:", props.fromDate)
  console.log("To Date:", props.toDate)

  if (selectedBoidId.value && props.fromDate && props.toDate) {
    try {
      // await fetchDataDeltasBoidID()
      // await fetchDataGetCombinedData()
      await fetchlogpowerclaimData()
    } catch (error) {
      console.error("Error in manual fetch:", error)
    }
  } else {
    console.log("Not all conditions are met for manual fetch")
  }
}

</script>

<style>
.echart-container {
  min-height: 400px;
  min-width: 400px;
  height: 800px;
  width: 800px;
}
</style>
