<template>
  <div class="fit row justify-center q-ma-md">
    <VueApexCharts
      :options="boidIDstakePowerOptionsFinal"
      :series="boidIDstakePowerSeriesFinal"
      class="my-chart"
    />
    <VueApexCharts
      :options="combinedDataOptionsFinal"
      :series="combinedDataSeriesFinal"
      class="my-chart"
    />
    <VueApexCharts
      :options="logpowerclaimOptionsFinal"
      :series="logpowerclaimSeriesFinal"
      class="my-chart"
    />
    <VueApexCharts
      :options="mintedBoidIDOptionsFinal"
      :series="mintedBoidIDSeriesFinal"
      class="my-chart"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps } from "vue"
import { userStore } from "src/stores/usersStore"
import { storeToRefs } from "pinia"
import VueApexCharts from "vue3-apexcharts"
import {
  fetchGetDeltasBoidIDData,
  fetchGetLogPwrClaimData,
  fetchGetCombinedData,
  boidIDstakePowerOptions,
  combinedDataOptions,
  logPwrClaimOptions,
  mintedBoidIDOptions
} from "src/lib/trpc/data"
import {
  SeriesDataInterface,
  DeltasDataItem,
  CombinedDataItem
} from "src/lib/trpc/interfaces"
import { PwrClaimData } from "src/lib/trpc/api4DeltasTypes"

const props = defineProps({
  boidId: String,
  fromDate: String,
  toDate: String
})
const store = userStore()
const { selectedBoidId } = storeToRefs(store)
// chart 1 - Boid ID Stake & Power
const boidIDstakePowerSeries = ref<SeriesDataInterface[]>([])
const boidIDstakePowerOptionsNext = ref(boidIDstakePowerOptions)
const boidIDstakePowerOptionsFinal = computed(() => {
  return boidIDstakePowerOptionsNext.value
})
const boidIDstakePowerSeriesFinal = computed(() => {
  return boidIDstakePowerSeries.value
})

// chart 2 - Boid ID Stake & Power & Folding@Home points & Balance
const combinedDataSeries = ref<SeriesDataInterface[]>([])
const combinedDataOptionsNext = ref(combinedDataOptions)
const combinedDataOptionsFinal = computed(() => {
  return combinedDataOptionsNext.value
})
const combinedDataSeriesFinal = computed(() => {
  return combinedDataSeries.value
})

// chart 3 - Boid ID Power Data
const logpowerclaimSeries = ref<SeriesDataInterface[]>([])
const logpowerclaimOptionsNext = ref(logPwrClaimOptions)
const logpowerclaimOptionsFinal = computed(() => {
  return logpowerclaimOptionsNext.value
})
const logpowerclaimSeriesFinal = computed(() => {
  return logpowerclaimSeries.value
})

// chart 4 - Minted Boid ID
const mintedBoidIDSeries = ref<SeriesDataInterface[]>([])
const mintedBoidIDOptionsNext = ref(mintedBoidIDOptions)
const mintedBoidIDOptionsFinal = computed(() => {
  return mintedBoidIDOptionsNext.value
})
const mintedBoidIDSeriesFinal = computed(() => {
  return mintedBoidIDSeries.value
})

const fetchDataDeltasBoidID = async() => {
  if (selectedBoidId.value && props.fromDate && props.toDate) {
    const deltasData:DeltasDataItem[] = await fetchGetDeltasBoidIDData(
      selectedBoidId.value,
      props.fromDate,
      props.toDate
    )
    const ensureFiniteNumber = (obj:DeltasDataItem, property:string) => {
      let val:string | number | undefined = obj[property]
      if (typeof val === "number") {
        if (!isFinite(val)) {
          console.error(
                `Invalid ${property} data point for timestamp ${obj.timeStamp}:`,
                val
          )
          obj[property] = 0
        }
      } else if (typeof val === "string") {
        let parsed = parseFloat(val)
        if (isNaN(parsed) || !isFinite(parsed)) {
          console.error(
                `Invalid ${property} data point for timestamp ${obj.timeStamp}:`,
                val
          )
          obj[property] = 0
        } else {
          obj[property] = parsed
        }
      } else {
        console.error(
              `Invalid ${property} data point for timestamp ${obj.timeStamp}:`,
              val
        )
        obj[property] = 0
      }
    }

    deltasData.forEach((item) => {
      ["power", "selfStaked", "balance", "receivedDelegatedStake"].forEach(
        (property) => ensureFiniteNumber(item, property)
      )
    })
    const powerSeriesData = deltasData.map((item) => item.power)
    const selfStakedSeriesData = deltasData.map((item) => item.selfStaked)
    const balanceSeriesData = deltasData.map((item) => item.balance)
    const receivedDelegatedStakeSeriesData = deltasData.map(
      (item) => item.receivedDelegatedStake
    )
    boidIDstakePowerSeries.value = [
      {
        name: "Self Staked",
        type: "line",
        data: selfStakedSeriesData,
        yAxisIndex: 0
      },
      {
        name: "Power",
        type: "column",
        data: powerSeriesData,
        yAxisIndex: 0
      },
      {
        name: "Balance",
        type: "line",
        data: balanceSeriesData,
        yAxisIndex: 0
      },

      {
        name: "Received Delegated Stake",
        type: "line",
        data: receivedDelegatedStakeSeriesData,
        yAxisIndex: 0
      }
    ]
    // Convert each timestamp in your data to a Date object
    const dates = deltasData.map((item) => new Date(item.timeStamp))
    // Then format those dates as strings in the format you want
    const boidIDstakePowerCategoriesData = dates.map(
      (date) =>
            `${date.getUTCDate()} ${date.toLocaleString("default", {
              month: "short"
            })} ${date.getUTCHours()}:${date.getUTCMinutes()}`
    )

    boidIDstakePowerOptionsNext.value = {
      ...boidIDstakePowerOptions,
      xaxis: {
        ...boidIDstakePowerOptions.xaxis,
        categories: boidIDstakePowerCategoriesData
      },
      yaxis: boidIDstakePowerOptions.yaxis.map((yaxis) => {
        if (yaxis.opposite) {
          return {
            ...yaxis
          }
        }
        return {
          ...yaxis
        }
      })
    }
    console.log("Deltas Data: ", deltasData)
  }
}

const fetchDataGetCombinedData = async() => {
  if (selectedBoidId.value && props.fromDate && props.toDate) {
    const combinedData:CombinedDataItem[] = await fetchGetCombinedData(
      selectedBoidId.value,
      props.fromDate,
      props.toDate
    )

    const powerSeriesData = combinedData.map((item) => Number(item.power))
    const stakedSeriesData = combinedData.map((item) =>
      Number(item.staked)
    )
    const balanceSeriesData = combinedData.map((item) =>
      Number(item.balance)
    )
    const receivedScoreSeriesData = combinedData.map((item) =>
      Number(item.score)
    )
    combinedDataSeries.value = [
      {
        name: "Power",
        type: "line",
        data: powerSeriesData,
        yAxisIndex: 0
      },
      {
        name: "Staked",
        type: "column",
        data: stakedSeriesData,
        yAxisIndex: 0
      },
      {
        name: "Balance",
        type: "column",
        data: balanceSeriesData,
        yAxisIndex: 0
      },

      {
        name: "Folding@Home Score",
        type: "line",
        data: receivedScoreSeriesData,
        yAxisIndex: 0
      }
    ]
    // Convert each timestamp in your data to a Date object
    const dates = combinedData.map((item) => new Date(item.date))
    // Then format those dates as strings in the format you want
    const combinedDataCategoriesData = dates.map(
      (date) =>
            `${date.getUTCDate()} ${date.toLocaleString("default", {
              month: "short"
            })} ${date.getUTCHours()}:${date.getUTCMinutes()}`
    )

    combinedDataOptionsNext.value = {
      ...combinedDataOptions,
      xaxis: {
        ...combinedDataOptions.xaxis,
        categories: combinedDataCategoriesData
      },
      yaxis: combinedDataOptions.yaxis.map((yaxis) => {
        if (yaxis.opposite) {
          return {
            ...yaxis
          }
        }
        return {
          ...yaxis
        }
      })
    }
  }
}

const fetchlogpowerclaimData = async() => {
  if (selectedBoidId.value && props.fromDate && props.toDate) {
    const fetchedData = await fetchGetLogPwrClaimData(
      selectedBoidId.value,
      props.fromDate,
      props.toDate
    )
    const logpowerclaimdata:PwrClaimData[] = fetchedData.map((item) => ({
      ...item,
      timeStamp: new Date(item.timeStamp)
    }))
    console.log("fetchedData: ", fetchedData)
    console.log("Log Power Claim Data: ", logpowerclaimdata)
    const powerbeforeSeriesData = logpowerclaimdata.map(
      (item) => item.power_before || 0
    )
    const powerafterSeriesData = logpowerclaimdata.map(
      (item) => item.power_after || 0
    )
    const minttotalSeriesData = logpowerclaimdata.map(
      (item) => item.mint_total || 0
    )
    const powerfromboostersSeriesData = logpowerclaimdata.map(
      (item) => item.power_from_boosters || 0
    )
    const mintaccountearnedSeriesData = logpowerclaimdata.map(
      (item) => item.mint_account_earned || 0
    )
    const mintoverstakemintSeriesData = logpowerclaimdata.map(
      (item) => item.mint_overstake_mint || 0
    )
    const mintpowermintSeriesData = logpowerclaimdata.map(
      (item) => item.mint_power_mint || 0
    )
    const mintpoweredstakemintSeriesData = logpowerclaimdata.map(
      (item) => item.mint_powered_stake_mint || 0
    )
    const mintteamcutSeriesData = logpowerclaimdata.map(
      (item) => item.mint_team_cut || 0
    )
    const mintteamownerearnedSeriesData = logpowerclaimdata.map(
      (item) => item.mint_team_owner_earned || 0
    )


    const powerChangeSeriesData = powerafterSeriesData.map((after:number, index:number) => {
      const before = powerbeforeSeriesData[index] || 0
      return after - before
    })
    logpowerclaimSeries.value = [
      {
        name: "Power Change",
        type: "column",
        data: powerChangeSeriesData,
        yAxisIndex: 0
      },
      {
        name: "Power From Boosters",
        type: "line",
        data: powerfromboostersSeriesData,
        yAxisIndex: 1
      },
      {
        name: "Mint Total",
        type: "line",
        data: minttotalSeriesData,
        yAxisIndex: 1
      },
      {
        name: "Mint Account Earned",
        type: "line",
        data: mintaccountearnedSeriesData,
        yAxisIndex: 1
      },
      {
        name: "Mint Overstake Mint",
        type: "line",
        data: mintoverstakemintSeriesData,
        yAxisIndex: 1
      },
      {
        name: "Mint Power Mint",
        type: "line",
        data: mintpowermintSeriesData,
        yAxisIndex: 1
      },
      {
        name: "Mint Powered Stake Mint",
        type: "line",
        data: mintpoweredstakemintSeriesData,
        yAxisIndex: 1
      },
      {
        name: "Mint Team Cut",
        type: "line",
        data: mintteamcutSeriesData,
        yAxisIndex: 1
      },
      {
        name: "Mint Team Owner Earned",
        type: "line",
        data: mintteamownerearnedSeriesData,
        yAxisIndex: 1
      }
    ]

    mintedBoidIDSeries.value = [
      {
        name: "Mint Account Earned",
        type: "column",
        data: mintaccountearnedSeriesData,
        yAxisIndex: 0
      },
      {
        name: "Mint Overstake Mint",
        type: "column",
        data: mintoverstakemintSeriesData,
        yAxisIndex: 0
      },
      {
        name: "Mint Team Cut",
        type: "column",
        data: mintteamcutSeriesData,
        yAxisIndex: 0
      },
      {
        name: "Mint Team Owner Earned",
        type: "column",
        data: mintteamownerearnedSeriesData,
        yAxisIndex: 0
      }
    ]
    console.log("Mint Acc Earned: ", mintaccountearnedSeriesData)
    console.log("Mint Overstake Mint: ", mintoverstakemintSeriesData)
    console.log("Mint Team Cut: ", mintteamcutSeriesData)
    console.log("Mint Team Owner Earned: ", mintteamownerearnedSeriesData)
    // Convert each timestamp in your data to a Date object
    const dates = logpowerclaimdata.map((item) => new Date(item.timeStamp))
    // Then format those dates as strings in the format you want
    const logpowerclaimCategoriesData = dates.map(
      (date) =>
            `${date.getUTCDate()} ${date.toLocaleString("default", {
              month: "short"
            })} ${date.getUTCHours()}:${date.getUTCMinutes()}`
    )

    logpowerclaimOptionsNext.value = {
      ...logPwrClaimOptions,
      xaxis: {
        ...logPwrClaimOptions.xaxis,
        categories: logpowerclaimCategoriesData
      },
      yaxis: logPwrClaimOptions.yaxis.map((yaxis) => {
        if (yaxis.opposite) {
          return {
            ...yaxis
          }
        }
        return {
          ...yaxis
        }
      })
    }

    const mintedBoidIDCategoriesData = dates.map(
      (date) =>
            `${date.getUTCDate()} ${date.toLocaleString("default", {
              month: "short"
            })} ${date.getUTCHours()}:${date.getUTCMinutes()}`
    )
    console.log("Minted Boid ID Data: ", mintedBoidIDSeries.value)
    console.log("Minted Boid ID Data categories: ", mintedBoidIDCategoriesData)
    console.log("Minted Boid Options Next: ", mintedBoidIDOptionsNext.value)
    console.log("Minted Boid Options: ", mintedBoidIDOptions)
    mintedBoidIDOptionsNext.value = {
      ...mintedBoidIDOptions,
      xaxis: {
        ...mintedBoidIDOptions.xaxis,
        categories: mintedBoidIDCategoriesData
      },
      yaxis: mintedBoidIDOptions.yaxis.map((yaxis) => {
        if (yaxis.opposite) {
          return {
            ...yaxis
          }
        }
        return {
          ...yaxis
        }
      })
    }
  }
}

async function manualFetch() {
  console.log("Manual Fetch initiated")
  console.log("Boid ID:", selectedBoidId.value)
  console.log("From Date:", props.fromDate)
  console.log("To Date:", props.toDate)

  if (selectedBoidId.value && props.fromDate && props.toDate) {
    try {
      await fetchDataDeltasBoidID()
      await fetchDataGetCombinedData()
      await fetchlogpowerclaimData()
    } catch (error) {
      console.error("Error in manual fetch:", error)
    }
  } else {
    console.log("Not all conditions are met for manual fetch")
  }
}
defineExpose({ manualFetch })
</script>
<style scoped>
/* Center the items inside the q-header */
.q-header .row {
  width: 100%;
  height: 100%;
  flex-wrap: nowrap;
}

.my-chart {
  max-width: 1024px;
  max-height: 1024px;
  min-height: 400px;
  min-width: 200px;
  width: 100%;
  height: 100%;
}
</style>
