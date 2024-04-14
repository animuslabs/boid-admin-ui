<template>
  <div ref="chartContainer" class="echart-container" />
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { storeToRefs } from "pinia"
import { userStore } from "src/stores/usersStore"
import { fetchGetDeltasBoidIDData } from "src/lib/trpc/data"
import { DeltasDataItem, StakingData } from "src/types/types"
import * as echarts from "echarts"
import { customTheme } from "src/lib/echarts-theme"
import { useConfigStore } from "src/stores/configStore"

defineExpose({ manualStakingDataFetch })

const chartContainer = ref<HTMLElement | null>(null)
const props = defineProps({
  boidId: String,
  fromDate: String,
  toDate: String
})
const store = userStore()
const { selectedBoidId } = storeToRefs(store)

const labels = {
  selfStaked: "Self Staked",
  balance: "Token Balance",
  receivedDelegatedStake: "Delegated Stake",
  powered_stake: "Powered Stake",
  max_powered_stake: "Max Powered Stake"
}

async function fetchData():Promise<StakingData[] | undefined> {
  const configStore = useConfigStore()
  const configResult = await configStore.fetchConfig()
  const firstConfig = configResult?.[0]
  const maxPoweredStakeMultiplier = firstConfig ? Number(firstConfig.power.powered_stake_mult) : 1
  if (selectedBoidId.value && props.fromDate && props.toDate) {
    const stakingDataResponse:DeltasDataItem[] = await fetchGetDeltasBoidIDData(selectedBoidId.value, props.fromDate, props.toDate)
    if (!stakingDataResponse) {
      console.error("Failed to fetch staking data.")
      return undefined
    }

    const stakingData:StakingData[] = stakingDataResponse.map(item => {
      const totalStake = Number(item.selfStaked) + Number(item.receivedDelegatedStake)
      const max_powered_stake = Number(maxPoweredStakeMultiplier) * Number(item.power)
      const powered_stake = Math.min(totalStake, max_powered_stake)

      return {
        ...item,
        timeStamp: new Date(item.timeStamp), // Convert string to Date if necessary
        powered_stake,
        max_powered_stake
      }
    })

    return stakingData
  }
}

// Chart setup function
const setupChart = async(data:StakingData[]) => {
  await nextTick()
  if (chartContainer.value) {
    console.log("Staking Chart Width: ", chartContainer.value?.clientWidth, "Staking Chart Height: ", chartContainer.value?.clientHeight)
    echarts.registerTheme("shine", customTheme.theme)
    const chartInstance = echarts.init(chartContainer.value, "shine")

    const timeStampFormat = (dateString:any) => dateString.getTime()
    const poweredStakeSeriesData = data.map(item => [timeStampFormat(item.timeStamp), item.powered_stake])
    const maxPoweredStakeSeriesData = data.map(item => [timeStampFormat(item.timeStamp), item.max_powered_stake])

    const series = [
      // First grid series - Line charts for self staked and received delegated stake
      { name: labels.selfStaked, type: "line", areaStyle: {}, colorBy: "series", data: data.map(item => [item.timeStamp.getTime(), item.selfStaked]), xAxisIndex: 0, yAxisIndex: 0 },
      { name: labels.receivedDelegatedStake, type: "bar", colorBy: "series", data: data.map(item => [item.timeStamp.getTime(), item.receivedDelegatedStake]), xAxisIndex: 0, yAxisIndex: 0 },
      { name: labels.balance, type: "line", colorBy: "series", data: data.map(item => [item.timeStamp.getTime(), item.balance]), xAxisIndex: 0, yAxisIndex: 0 },

      // Second grid series - Bar charts for balance, powered stake, and max powered stake
      { name: labels.max_powered_stake, type: "line", areaStyle: {}, colorBy: "series", data: maxPoweredStakeSeriesData, xAxisIndex: 1, yAxisIndex: 1 },
      { name: labels.powered_stake, type: "line", areaStyle: {}, colorBy: "series", data: poweredStakeSeriesData, xAxisIndex: 1, yAxisIndex: 1 }
    ]

    const options = {
      legend: {
        data: [labels.selfStaked, labels.receivedDelegatedStake, labels.balance, labels.powered_stake, labels.max_powered_stake]
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" }
      },
      toolbox: {},
      grid: [
        { bottom: "55%" }, // First grid
        { top: "55%" } // Second grid
      ],
      xAxis: [
        { type: "time", gridIndex: 0 },
        { type: "time", gridIndex: 1 }
      ],
      yAxis: [
        { type: "value", name: "Stake", gridIndex: 0, axisLabel: { formatter: "{value}" } },
        { type: "value", name: "Powered Stake", gridIndex: 1 }
      ],
      series
    }

    chartInstance.setOption(options)
    chartInstance.resize()
  }
}

async function manualStakingDataFetch() {
  console.log("Manual Fetch initiated for Boid ID:", selectedBoidId.value)
  const data = await fetchData()
  if (data) { // If data is successfully fetched
    await setupChart(data)
  } else {
    console.error("No data available for chart setup.")
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
