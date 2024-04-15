<template>
  <div ref="chartContainer" class="echart-container" />
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { fetchPayOracle } from "src/lib/trpc/data"
import { OraclePayResponse } from "src/lib/trpc/api4DeltasTypes"
import * as echarts from "echarts"
import { customTheme } from "src/lib/echarts-theme"

defineExpose({ manualOracleDataFetch })

const chartContainer = ref<HTMLElement | null>(null)

const props = defineProps({
  fromDate: String,
  toDate: String,
  oracle: String
})

async function fetchData():Promise<OraclePayResponse[]> {
  if (props.fromDate && props.toDate && props.oracle) {
    const payOracleData = await fetchPayOracle(props.fromDate, props.toDate, props.oracle)
    return payOracleData.map(item => ({ ...item, timeStamp: new Date(item.timeStamp) }))
  }
  return []
}

// Chart setup function for Payments
const setupChartPayments = async(data:OraclePayResponse[]) => {
  await nextTick()
  echarts.registerTheme("shine", customTheme.theme)
  // Format dates to include date and hour
  const dates = data.map(item => {
    const date = new Date(item.timeStamp)
    return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`
  })
  // Define series for monetary values
  const basePaySeries = {
    name: "Base Pay",
    type: "line",
    data: data.map((item, index) => [dates[index], item.basePay])
  }
  const bonusPaySeries = {
    name: "Bonus Pay",
    type: "line",
    data: data.map((item, index) => [dates[index], item.bonusPay])
  }

  // Define series for report metrics
  const proposedSeries = {
    name: "Reports Proposed",
    type: "bar",
    yAxisIndex: 1,
    data: data.map((item, index) => [dates[index], item.reports_proposed])
  }
  const unreportedSeries = {
    name: "Unreported/Unmerged",
    type: "bar",
    yAxisIndex: 1,
    data: data.map((item, index) => [dates[index], item.reports_unreported_unmerged])
  }
  const reportedSeries = {
    name: "Reported/Merged",
    type: "bar",
    yAxisIndex: 1,
    data: data.map((item, index) => [dates[index], item.reports_reported_or_merged])
  }

  // Chart configuration
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      }
    },
    legend: {
      data: ["Base Pay", "Bonus Pay", "Reports Proposed", "Unreported/Unmerged", "Reported/Merged"]
    },
    xAxis: {
      type: "category",
      data: dates
    },
    yAxis: [
      {
        type: "value",
        name: "Monetary Value",
        position: "left"
      },
      {
        type: "value",
        name: "Reports Count",
        position: "right"
      }
    ],
    series: [basePaySeries, bonusPaySeries, proposedSeries, unreportedSeries, reportedSeries]
  }
  const chart = echarts.init(chartContainer.value, "shine")
  chart.setOption(options)
  chart.resize()
}


async function manualOracleDataFetch() {
  const data = await fetchData()
  if (data) {
    console.log("ChartContainer PowerComponent", chartContainer.value)
    await setupChartPayments(data)
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
