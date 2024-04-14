<template>
  <div ref="chartContainer" class="echart-container" />
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { storeToRefs } from "pinia"
import { userStore } from "src/stores/usersStore"
import { fetchGetLogPwrClaimData, fetchGetCombinedData, fetchPowerReports } from "src/lib/trpc/data"
import { CombinedDataItem, PwrClaimData } from "src/types/types"
import { SentReportsResponse } from "src/lib/trpc/api4DeltasTypes"
import * as echarts from "echarts"
import { customTheme } from "src/lib/echarts-theme"

defineExpose({ manualPowerDataFetch })

const chartContainer = ref<HTMLElement | null>(null)

const props = defineProps({
  boidId: String,
  fromDate: String,
  toDate: String
})
const store = userStore()
const { selectedBoidId } = storeToRefs(store)

interface ChartData {
  logpowerclaimdata:PwrClaimData[];
  protocolsdata:CombinedDataItem[];
  protocolsPowerData:SentReportsResponse[];
}
// Protocol ID to Name Mapping
const protocolNames:Record<number, string> = {
  0: "F@Home Power",
  1: "Rosetta Power",
  2: "Denis Power",
  3: "SiDock Power",
  4: "RNAworld Power",
  5: "WCG Power"
}

async function fetchData():Promise<ChartData | undefined> {
  if (selectedBoidId.value && props.fromDate && props.toDate) {
    const [logData, protocolData, protocolsPowerData] = await Promise.all([
      fetchGetLogPwrClaimData(selectedBoidId.value, props.fromDate, props.toDate),
      fetchGetCombinedData(selectedBoidId.value, props.fromDate, props.toDate),
      fetchPowerReports(props.fromDate, props.toDate, undefined, undefined, selectedBoidId.value)
    ])
    return {
      logpowerclaimdata: logData.map(item => ({ ...item, timeStamp: new Date(item.timeStamp) })),
      protocolsdata: protocolData.map(item => ({ ...item, timeStamp: new Date(item.date) })),
      protocolsPowerData: protocolsPowerData.map(item => ({ ...item, timeStamp: new Date(item.timeStamp) }))
    }
  }
}

function aggregateDataByDayAndProtocol(data:SentReportsResponse[]):Record<string, Record<number, number>> {
  const aggregated = data.reduce((acc, item) => {
    // Check if timeStamp exists and is a valid Date object
    if (item.timeStamp) {
      const dateKey = item.timeStamp.toISOString().split("T")[0] // Convert the Date to YYYY-MM-DD

      const protocolKey = item.protocol_id

      // Ensure that both dateKey and protocolKey are properly defined
      if (dateKey && typeof protocolKey === "number") {
        if (!acc[dateKey]) {
          acc[dateKey] = {}
        }
        if (!acc[dateKey][protocolKey]) {
          acc[dateKey][protocolKey] = 0
        }

        // Aggregate added_power by date and protocol
        acc[dateKey][protocolKey] += item.added_power
      }
    }
    return acc
  }, {} as Record<string, Record<number, number>>)

  return aggregated
}
function aggregateData(data:Array<{ timeStamp?:Date; power_after:number }>):Record<string, number> {
  const results:Record<string, number> = {}

  data.forEach(item => {
    if (!item.timeStamp) {
      console.warn("Item has undefined timestamp, skipping...")
      return // Skip this item or handle it as you see fit
    }

    const dateKey = item.timeStamp.toISOString().split("T")[0]

    if (dateKey) {
      if (!results[dateKey]) {
        results[dateKey] = 0
      }
      results[dateKey] += item.power_after
    }
  })

  return results
}



// Chart setup function
const setupChart = async(data:ChartData | undefined) => {
  await nextTick()
  if (chartContainer.value && data) {
    echarts.registerTheme("shine", customTheme.theme)
    const chartInstance = echarts.init(chartContainer.value, "shine")

    const aggregatedData = aggregateDataByDayAndProtocol(data.protocolsPowerData) || {}
    const averagePowerData = aggregateData(data.logpowerclaimdata)
    const dates = Object.keys({ ...aggregatedData, ...averagePowerData }).sort() // Combine and sort dates from both datasets

    const protocolSeries = Object.keys(protocolNames).map(protocolIdStr => {
      const protocolId = Number(protocolIdStr)
      const protocolData = dates.map(date => aggregatedData[date] ? aggregatedData[date][protocolId] || 0 : 0)
      return {
        name: protocolNames[protocolId],
        type: "bar",
        data: protocolData,
        stack: "total"
      }
    })

    const powerAfterSeries = {
      name: "Boid Power",
      type: "line",
      yAxisIndex: 1,
      data: dates.map(date => [date, averagePowerData[date] || 0])
    }

    const series = [...protocolSeries, powerAfterSeries]

    const options = {
      legend: {
        itemWidth: 20, // Legend symbol width
        itemHeight: 10, // Legend symbol height
        textStyle: {
          fontSize: 10 // Font size of legend text
        }
      },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: dates
      },
      yAxis: [
        {
          type: "value",
          name: "Added Power"
        },
        {
          type: "value",
          name: "Boid Power",
          position: "right"
        }
      ],
      series
    }
    chartInstance.setOption(options)
    chartInstance.resize()
  } else {
    console.log("Chart container not ready or visible, or data is undefined.")
  }
}


async function manualPowerDataFetch() {
  console.log("Manual Fetch initiated for Boid ID:", selectedBoidId.value)
  const data = await fetchData()
  if (data) {
    console.log("ChartContainer PowerComponent", chartContainer.value)
    await setupChart(data)
    console.log("Power Data:", data.protocolsPowerData)
  } else {
    console.log("Failed to fetch data or conditions not met for fetching.")
  }
}

</script>

<style>
.echart-container {
  min-height: 400px;
  min-width: 400px;
  height: 800px;
  width: 800px;
  display: block;
}
</style>
