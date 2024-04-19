<template>
  <div ref="chartContainer" class="echart-container" />
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { storeToRefs } from "pinia"
import { userStore } from "src/stores/usersStore"
import { fetchGetLogPwrClaimData, fetchGetCombinedData, fetchPowerReports, fetchGetDeltasBoidIDData } from "src/lib/trpc/data"
import { CombinedDataItem, PwrClaimData, SeriesOptions } from "src/types/types"
import { SentReportsResponse, AccountsDeltaData } from "src/lib/trpc/api4DeltasTypes"
import * as echarts from "echarts"
import { customTheme } from "src/lib/echarts-theme"
import { format } from "path"


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
  deltasBoidIDdata:AccountsDeltaData[];
}

interface DailyAveragePower {
  timeStamp:Date;
  averagePower:number;
}
// Protocol ID to Name Mapping
const protocolNames:Record<number, string> = {
  0: "F@Home",
  1: "Rosetta",
  2: "Denis",
  3: "SiDock",
  4: "RNAworld",
  5: "WCG",
  6: "Boosters"
}

async function fetchData():Promise<ChartData | undefined> {
  if (selectedBoidId.value && props.fromDate && props.toDate) {
    const [logData, protocolData, protocolsPowerData, deltasData] = await Promise.all([
      fetchGetLogPwrClaimData(selectedBoidId.value, props.fromDate, props.toDate),
      fetchGetCombinedData(selectedBoidId.value, props.fromDate, props.toDate),
      fetchPowerReports(props.fromDate, props.toDate, undefined, undefined, selectedBoidId.value),
      fetchGetDeltasBoidIDData(selectedBoidId.value, props.fromDate, props.toDate)
    ])
    return {
      logpowerclaimdata: logData.map(item => ({ ...item, timeStamp: new Date(item.timeStamp) })),
      protocolsdata: protocolData.map(item => ({ ...item, timeStamp: new Date(item.date) })),
      protocolsPowerData: protocolsPowerData.map(item => ({ ...item, timeStamp: new Date(item.timeStamp) })),
      deltasBoidIDdata: deltasData.map(item => ({ ...item, timeStamp: new Date(item.timeStamp) }))
    }
  }
}

function aggregateDataByDayAndProtocol(data:SentReportsResponse[], boostersData:PwrClaimData[]):Record<string, Record<number, number>> {
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

  // Aggregate boosters
  boostersData.forEach(item => {
    const dateKey = item.timeStamp.toISOString().split("T")[0]
    // Proceed only if dateKey is defined
    if (!dateKey) {
      console.warn("Invalid or missing timeStamp, skipping item:", item)
      return // Skip this item
    }
    if (!aggregated[dateKey]) aggregated[dateKey] = {}
    aggregated[dateKey][6] = (aggregated[dateKey][6] || 0) + item.power_from_boosters // Use '6' as the ID for boosters
  })

  return aggregated
}
function aggregateData(data:Array<{ timeStamp?:Date; power_before:number; power_after:number }>):Record<string, number> {
  const results:Record<string, number> = {}

  data.forEach(item => {
    if (!item.timeStamp) {
      console.warn("Item has undefined timestamp, skipping...")
      return // Skip this item or handle it as you see fit
    }

    const dateKey = item.timeStamp.toISOString().split("T")[0]
    const powerDifference = item.power_after - item.power_before

    if (dateKey) {
      if (!results[dateKey]) {
        results[dateKey] = 0
      }
      results[dateKey] += powerDifference
    }
  })

  return results
}


function calculateDailyAveragePower(data:AccountsDeltaData[]):DailyAveragePower[] {
  const powerSumByDay:Record<string, { totalPower:number, count:number }> = {}

  data.forEach(item => {
    // Safely extract dateKey from timeStamp if present and valid
    const dateKey = item.timeStamp ? item.timeStamp.toISOString().split("T")[0] : undefined

    // Proceed only if dateKey is defined
    if (!dateKey) {
      console.warn("Invalid or missing timeStamp, skipping item:", item)
      return // Skip this item
    }

    // Initialize or update the totals for the given dateKey
    if (!powerSumByDay[dateKey]) {
      powerSumByDay[dateKey] = { totalPower: 0, count: 0 }
    }
    powerSumByDay[dateKey].totalPower += item.power
    powerSumByDay[dateKey].count++
  })

  // Convert the aggregated data into an array of daily averages
  return Object.keys(powerSumByDay).map(dateKey => {
    const { totalPower, count } = powerSumByDay[dateKey] ?? { totalPower: 0, count: 0 }
    const averagePower = totalPower / count
    const midDayTimeStamp = new Date(`${dateKey}T12:00:00Z`) // Represents noon of the day

    return {
      timeStamp: midDayTimeStamp,
      averagePower: Number(averagePower.toFixed(0))
    }
  })
}

// Chart setup function
const setupChart = async(data:ChartData | undefined) => {
  await nextTick()
  if (chartContainer.value && data) {
    echarts.registerTheme("shine", customTheme.theme)
    const chartInstance = echarts.init(chartContainer.value, "shine")
    const aggregatedData = aggregateDataByDayAndProtocol(data.protocolsPowerData, data.logpowerclaimdata) || {}
    const powerChangeData = aggregateData(data.logpowerclaimdata)
    const averageBoidIDpowerData = calculateDailyAveragePower(data.deltasBoidIDdata)
    const dates = Object.keys({ ...aggregatedData, ...powerChangeData }).sort() // Combine and sort dates from both datasets
    const protocolSeries = Object.keys(protocolNames).map(protocolIdStr => {
      const protocolId = Number(protocolIdStr)
      const protocolData = dates.map(date => aggregatedData[date] ? aggregatedData[date][protocolId] || 0 : 0)
      let seriesOptions:SeriesOptions = {
        name: protocolNames[protocolId],
        type: "bar",
        data: protocolData,
        stack: "total"
      }

      // Apply specific color to the Boosters series
      if (protocolId === 6) { // Assuming 6 is the ID for Boosters
        // ts-ignore
        seriesOptions = { ...seriesOptions, color: "#FF5733" }
      }

      return seriesOptions
    })

    const powerAfterSeries = {
      name: "Power Change",
      type: "line",
      yAxisIndex: 1,
      data: dates.map(date => [date, powerChangeData[date]] || 0)
    }

    const averagePowerSeries = {
      name: "BoidID actual power",
      type: "line",
      yAxisIndex: 1,
      data: dates.map(date => {
        // Find the matching entry in averageBoidIDpowerData by date
        const entry = averageBoidIDpowerData.find(d => d.timeStamp.toISOString().split("T")[0] === date)
        return [date, entry ? entry.averagePower : 0] // Use entry's averagePower if found, otherwise default to 0
      })
    }


    const series = [...protocolSeries, powerAfterSeries, averagePowerSeries]

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
          name: "Protocols Power"
        },
        {
          type: "value",
          name: "BoidID's Power",
          alignTicks: true,
          position: "right",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#5470C6"
            }
          }
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
