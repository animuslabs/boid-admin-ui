<template>
  <div ref="chartContainer" class="echart-container" />
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { storeToRefs } from "pinia"
import { userStore } from "src/stores/usersStore"
import { fetchGetLogPwrClaimData, fetchGetCombinedData } from "src/lib/trpc/data"
import { CombinedDataItem, PwrClaimData } from "src/types/types"
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
}

const labels = {
  power_after: "Power Rating",
  power_from_boosters: "Power from Boosters",
  fah_score: "Folding@Home Score"
}

async function fetchData():Promise<ChartData | undefined> {
  if (selectedBoidId.value && props.fromDate && props.toDate) {
    const [logData, protocolData] = await Promise.all([
      fetchGetLogPwrClaimData(selectedBoidId.value, props.fromDate, props.toDate),
      fetchGetCombinedData(selectedBoidId.value, props.fromDate, props.toDate)
    ])
    return {
      logpowerclaimdata: logData.map(item => ({ ...item, timeStamp: new Date(item.timeStamp) })),
      protocolsdata: protocolData.map(item => ({ ...item, timeStamp: new Date(item.date) }))
    }
  }
}

// Chart setup function
const setupChart = async(data:ChartData) => {
  await nextTick()
  if (chartContainer.value) {
    console.log(chartContainer.value?.clientWidth, chartContainer.value?.clientHeight)
    echarts.registerTheme("shine", customTheme.theme)
    const chartInstance = echarts.init(chartContainer.value, "shine")

    // Prepare the series data based on logpowerclaimdata
    const series = [
      { name: labels.power_after, type: "bar", data: data.logpowerclaimdata.map(item => [item.timeStamp, item.power_after]) },
      { name: labels.power_from_boosters, type: "bar", yAxisIndex: 0, data: data.logpowerclaimdata.map(item => [item.timeStamp, item.power_from_boosters]) },
      { name: labels.fah_score, type: "line", yAxisIndex: 1, data: data.protocolsdata.map(item => [item.date, item.score]) }
    ]
    const yAxis = [
      {
        type: "value",
        name: "Power"
      },
      {
        type: "log",
        name: labels.fah_score,
        position: "right",
        logBase: 10,
        minorSplitLine: { show: true },
        axisLabel: {
          // Format labels to show values in millions with one decimal place
          formatter: function(value:number) {
            return (value / 1e6).toFixed(1) + "M"
          }
        }
      }
    ]
    const options = {
      legend: {},
      tooltip: {
        trigger: "axis",
        formatter: function(params:any) {
          let result = params[0].axisValueLabel + "<br/>"
          params.forEach(function(item:any) {
            let value = item.data[1] // Assuming the value is the second item in data array
            if (item.seriesName === "Folding@Home Score") {
              // Format as millions or billions based on the value size
              value = value >= 1e9 ? (value / 1e9).toFixed(2) + "B" : (value / 1e6).toFixed(2) + "M"
            }
            result += item.marker + " " + item.seriesName + ": " + value + "<br/>"
          })
          return result
        }
      },
      xAxis: { type: "time" },
      yAxis,
      series
    }

    chartInstance.setOption(options)
    chartInstance.resize()
  }
}

async function manualPowerDataFetch() {
  console.log("Manual Fetch initiated for Boid ID:", selectedBoidId.value)
  const data = await fetchData()
  if (data) {
    await setupChart(data)
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
}
</style>
