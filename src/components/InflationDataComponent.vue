<template>
  <q-page class="inflation-container" padding>
    <div class="q-ma-sm text-h6">
      Inflation Simulator
      <q-icon color="primary" name="info">
        <q-tooltip>
          <p class="text-subtitle2" style="max-width: 400px;">
            This simulator calculates the whole Boid network's inflation based on the number of users, their power, and stake.
            Calculations are performed using a virtual blockchain machine that emulates the Boid core smart contract. It also uses live blockchain data.
            Calculator loads the actual stake of chain when the page is loaded.
          </p>
        </q-tooltip>
      </q-icon>
    </div>
    <div class="row wrap justify-center content-center">
      <q-card flat class="column content-center">
        <div class="q-pa-md">
          <div class="q-ma-xs">
            <b>Number of Users</b>
            <q-icon class="q-ml-xs" color="primary" name="info">
              <q-tooltip>
                <p class="text-subtitle2" style="max-width: 400px;">
                  Enter the number of users on the Boid network.
                </p>
              </q-tooltip>
            </q-icon>
            <q-item>
              <q-input standout v-model.number="numberOfUsers" dense type="number" min="1">
                <template #prepend>
                  <q-icon color="primary" name="people" />
                </template>
              </q-input>
            </q-item>
          </div>
          <q-separator />
          <div class="q-my-md">
            <b>Average User's Power Per Round (13h)</b>
            <q-icon class="q-ml-xs" color="primary" name="info">
              <q-tooltip>
                <p class="text-subtitle2" style="max-width: 400px;">
                  Average amount of power that each user contributes to the Boid network every 13 hours.
                </p>
              </q-tooltip>
            </q-icon>
            <q-item>
              <q-input standout v-model.number="basePowerPerRound" dense>
                <template #prepend>
                  <q-icon color="primary" name="flash_on" />
                </template>
              </q-input>
            </q-item>
            <q-item>
              <q-item-section>
                <q-slider
                  v-model.number="basePowerPerRound"
                  :min="0"
                  :max="1000"
                  :step="10"
                  color="primary"
                  label
                  label-always
                  switch-label-side
                  :label-value="`${basePowerPerRound} power`"
                  type="number"
                  class="q-my-md"
                />
              </q-item-section>
            </q-item>
          </div>
          <q-separator />
          <div class="q-my-md">
            <b>Average BOID Stake</b>
            <q-icon class="q-ml-xs" color="primary" name="info">
              <q-tooltip>
                <p class="text-subtitle2" style="max-width: 400px;">
                  Average BOID staked by Boid users.
                </p>
              </q-tooltip>
            </q-icon>
            <q-item>
              <q-input standout v-model.number="stake" dense>
                <template #prepend>
                  <q-icon color="primary" name="lock_clock" />
                </template>
              </q-input>
            </q-item>
            <q-item>
              <q-item-section>
                <q-slider
                  v-model.number="stake"
                  :min="0"
                  :max="50000000"
                  :step="100000"
                  :color="sliderColor(stakeState as StakeState)"
                  label
                  label-always
                  switch-label-side
                  :label-value="`${formattedStake} stake`"
                  type="number"
                  class="q-my-md"
                />
              </q-item-section>
            </q-item>
          </div>
          <q-separator />
        </div>
        <div class="overflow: auto; q-pa-md">
          <q-btn class="full-width" label="Calculate" style="height: 25px;" color="primary" @click="fetchData" :loading="loading" :disable="loading" />
        </div>
      </q-card>
      <q-card flat class="q-ma-sm column content-center">
        <div class="column wrap justify-center content-center">
          <div class="q-ma-md">
            <div class="q-ma-xs text-subtitle1 row" v-if="calcData">
              <strong>Live BOID Token Data</strong>
            </div>
            <li><strong>Supply:</strong></li>
            <ul><strong>Total: </strong>{{ displayTokenData.totalBOIDsupply.toLocaleString("en-US").replace(/,/g, "'") }}</ul>
            <ul><strong>MAX:</strong> {{ displayTokenData.boid_max_total_supply.toLocaleString("en-US").replace(/,/g, "'") }}</ul>
            <li>
              <strong>Staked:</strong> {{ displayTokenData.staked_BOID_Telos.toLocaleString("en-US").replace(/,/g, "'") }} ({{ displayTokenData.stakedPercentageOfTotal.toFixed(2) }}%)
              <q-icon class="q-ml-xs" color="primary" name="info">
                <q-tooltip>
                  <p class="text-subtitle2" style="max-width: 400px;">
                    All staked BOID located on the Telos Native blockchain in stake.boid account.
                  </p>
                </q-tooltip>
              </q-icon>
            </li>
            <li><strong>DEX Liquid:</strong> {{ displayTokenData.boid_liquid_onDEXes.toLocaleString("en-US").replace(/,/g, "'") }} ({{ displayTokenData.boid_liquid_onDEXes_percentage.toFixed(2) }}%)</li>
            <li>
              <strong>Burned:</strong> {{ displayTokenData.burned.toLocaleString("en-US").replace(/,/g, "'") }}
              <q-icon class="q-ml-xs" color="primary" name="info">
                <q-tooltip>
                  <p class="text-subtitle2" style="max-width: 400px;">
                    Burned BOID tokens located on the Telos Native blockchain in the burn.boid account.
                  </p>
                </q-tooltip>
              </q-icon>
            </li>
            <li><strong>Mint Account Status:</strong></li>
            <ul>
              <b>BOID:</b> {{ displayTokenData.toBeMinted.toLocaleString("en-US").replace(/,/g, "'") }}
              <q-icon class="q-ml-xs" color="primary" name="info">
                <q-tooltip>
                  <p class="text-subtitle2" style="max-width: 400px;">
                    tknmint.boid on the Telos Native blockchain is the account that distributes new BOID tokens.
                  </p>
                </q-tooltip>
              </q-icon>
            </ul>
            <ul><strong>Projected to cover {{ daysUntilReplenishment.toFixed(0) }} days</strong></ul>
            <q-separator />
          </div>

          <div class="q-mx-md overflow: auto;">
            <div class="q-ma-xs text-subtitle1 row">
              <strong>Calculated Mint:</strong>
            </div>
            <li>
              <strong>From Power</strong>
              <q-icon class="q-ml-xs" name="info" color="primary">
                <q-tooltip dense>
                  BOID minted only from power without stake.
                </q-tooltip>
              </q-icon>: {{ calcData.accumulated.power_mint.toLocaleString("en-US").replace(/,/g, "'") }}
            </li>

            <li>
              <strong>From Powered Stake</strong>
              <q-icon class="q-ml-xs" name="info" color="primary">
                <q-tooltip dense>
                  BOID minted only from stake that is backed by Boid Power. Unpowered stake mint always goes to the Boid DAO.
                </q-tooltip>
              </q-icon>: {{ calcData.accumulated.powered_stake_mint.toLocaleString("en-US").replace(/,/g, "'") }}
            </li>

            <li>
              <strong>Overstake</strong>
              <q-icon class="q-ml-xs" name="info" color="primary">
                <q-tooltip dense>
                  BOID minted that goes straight to the Boid DAO.
                </q-tooltip>
              </q-icon>: {{ calcData.accumulated.overstake_mint.toLocaleString("en-US").replace(/,/g, "'") }}
            </li>
            <li><strong>Total mint:</strong> {{ calcData.accumulated.total.toLocaleString('en-US').replace(/,/g, "'") }}</li>
            <q-separator spaced />
            <div class="q-mx-md row justify-center">
              <q-chip class="q-ma-xs text-subtitle1 centered" size="lg" dense outline square :color="inflationColor" text-color="white" icon="notification_important">
                Yearly Inflation {{ (calcData.accumulated.total / displayTokenData.totalBOIDsupply * 100).toLocaleString("en-US").replace(/,/g, "'") }} %
              </q-chip>
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, onMounted } from "vue"
import { fetchCalculatorData, fetchBOIDtokenData } from "src/lib/trpc/data"
import { CalcDataStructure, BoidData } from "src/lib/trpc/interfaces"

const props = defineProps({
  config: Object
})


const tokenData:Ref<BoidData> = ref(
  {
    locked_BOID_EOS_IBC: "",
    mint_BOID_Telos: "",
    burned_BOID_Telos: "",
    staked_BOID_Telos: "",
    liquid_BOID_AlcorTelos: "",
    liquid_BOID_DefiboxEOS: "",
    boid_EOS_supply: "",
    boid_TLOS_supply: "",
    boid_max_total_supply: ""
  }
)


const displayTokenData = computed(() => {
  const maxTotalSupply = parseFloat(tokenData.value.boid_max_total_supply)
  const toBeMinted = parseFloat(tokenData.value.mint_BOID_Telos)
  const burned = parseFloat(tokenData.value.burned_BOID_Telos)
  const totalSupply = parseFloat(tokenData.value.boid_EOS_supply) - burned - toBeMinted

  // Existing calculations
  const supplyPercentage = totalSupply / maxTotalSupply * 100

  // Additional data from tokenData
  const staked_BOID_Telos = parseFloat(tokenData.value.staked_BOID_Telos)
  const liquid_BOID_AlcorTelos = parseFloat(tokenData.value.liquid_BOID_AlcorTelos)
  const liquid_BOID_DefiboxEOS = parseFloat(tokenData.value.liquid_BOID_DefiboxEOS)

  // Calculate the percentage of staked BOID (on Telos) compared to total supply
  const stakedPercentageOfTotal = staked_BOID_Telos / totalSupply * 100

  // Sum of liquid BOID on DEXes
  const boid_liquid_onDEXes = liquid_BOID_AlcorTelos + liquid_BOID_DefiboxEOS

  // Luiq BOID on DEXes as a percentage of total supply
  const boid_liquid_onDEXes_percentage = boid_liquid_onDEXes / totalSupply * 100

  return {
    totalBOIDsupply: totalSupply,
    supplyPercentage, // Percentage of total supply relative to max total supply
    boid_TLOS_supply: parseFloat(tokenData.value.boid_TLOS_supply), // Supply on Telos only
    boid_liquid_onDEXes,
    boid_max_total_supply: maxTotalSupply,
    staked_BOID_Telos,
    stakedPercentageOfTotal,
    boid_liquid_onDEXes_percentage,
    toBeMinted,
    burned
  }
})

const inflationColor = computed(() => {
  const inflationRate = calcData.value.accumulated.total / displayTokenData.value.totalBOIDsupply * 100
  if (inflationRate <= 2.5) {
    return "green" // Green color for inflation <= 2.5%
  } else if (inflationRate > 2.5 && inflationRate <= 5) {
    return "yellow-9" // Yellow color for inflation between 2.51% and 5%
  } else {
    return "red" // Red color for inflation > 5%
  }
})


const loading = ref(false)
const userTaxPercentage = ref(10) // Example starting value, representing 10%
const configAccountAdjusted = computed(() => ({
  min_pwr_tax_mult: userTaxPercentage.value * 2
}))

const periodMonths = 12
const liveSim = false
const activeSponsor = false
const roundDuration = 46800
const numberOfUsers = ref(100)
const basePowerPerRound = ref(100)
const stake = ref(100000)

// Calculated number of rounds based on the period in months
const rounds = computed(() => {
  const secondsPerMonth = 30.44 * 24 * 3600 // Average seconds in a month
  // Duration of one round in seconds
  return Math.floor(periodMonths * secondsPerMonth / roundDuration)
})
const tokensDistributedPerRound = computed(() => {
  return calcData.value.accumulated.total / rounds.value
})
const daysUntilReplenishment = computed(() => {
  if (!tokensDistributedPerRound.value || tokensDistributedPerRound.value === 0 || !displayTokenData.value.toBeMinted) {
    return 0 // Avoid division by zero or undefined initial values, returning 0 days initially
  }

  const roundsUntilReplenishment = displayTokenData.value.toBeMinted / tokensDistributedPerRound.value
  const secondsUntilReplenishment = roundsUntilReplenishment * roundDuration
  return secondsUntilReplenishment / (24 * 3600)
})



const formattedStake = computed(() => {
  return stake.value.toLocaleString("en-US").replace(/,/g, "'")
})


const userConfig = computed(() => {
  return {
    power: {
      // Provide default values if `props.config.power` or its properties are undefined
      sponsor_tax_mult: props.config && props.config.power && props.config.power.sponsor_tax_mult
        ? parseFloat(props.config.power.sponsor_tax_mult.toString())
        : 0, // Default value if not available
      powered_stake_mult: props.config && props.config.power && props.config.power.powered_stake_mult
        ? parseFloat(props.config.power.powered_stake_mult.toString())
        : 0 // Default value if not available
    },
    mint: {
      // Provide default values if `props.config.mint` or its properties are undefined
      round_powered_stake_mult: props.config && props.config.mint && props.config.mint.round_powered_stake_mult
        ? parseFloat(props.config.mint.round_powered_stake_mult.toString())
        : 0, // Default value if not available
      round_power_mult: props.config && props.config.mint && props.config.mint.round_power_mult
        ? parseFloat(props.config.mint.round_power_mult.toString())
        : 0 // Default value if not available
    }
  }
})

const max_powered_stake = computed(() => {
  // Check if `props.config` and nested properties exist, otherwise use default values
  const multiplier = props.config && props.config.power && props.config.power.powered_stake_mult
    ? parseFloat(props.config.power.powered_stake_mult.toString())
    : 0 // Default value if not available
  const powerPerRound = basePowerPerRound.value
  return multiplier * powerPerRound
})


const stakeState = computed(() => {
  const ratio = stake.value / max_powered_stake.value
  if (ratio < 0.5) {
    return "low" // less than 50% of max powered stake
  } else if (ratio >= 0.5 && ratio < 1) {
    return "medium" // between 50% and 100% of max powered stake
  } else if (ratio >= 1) {
    return "high" // equal or greater than max powered stake
  } else {
    return "unknown" // default return value if none of the above conditions are met
  }
})
type StakeState = "low" | "medium" | "high";

const sliderColor = (state:StakeState):string => {
  switch (state) {
    case "low":
      return "red-3" // Red color for low stake
    case "medium":
      return "grey-6" // Orange color for medium stake
    case "high":
      return "green-5" // Green color for high stake
    default:
      return "primary" // Default case, primary color
  }
}

const calcData = ref<CalcDataStructure>({
  acc: {
    stake: {
      self_staked: 0
    },
    power: {
      rating: 0
    },
    team: {
      team_cumulative_contribution: 0
    }
  },
  accumulated: {
    // Default values for MintObject
    power_mint: 0,
    powered_stake_mint: 0,
    account_earned: 0,
    team_cut: 0,
    team_owner_earned: 0,
    overstake_mint: 0,
    total: 0
  }
})



const fetchData = async() => {
  loading.value = true
  try {
    const result = await fetchCalculatorData(
      rounds.value,
      basePowerPerRound.value,
      stake.value,
      userConfig.value,
      liveSim,
      activeSponsor,
      { min_pwr_tax_mult: configAccountAdjusted.value.min_pwr_tax_mult }
    )

    // Prepare to transform result with numberOfUsers multiplication
    const transformedResult = {
      acc: {
        stake: {
          self_staked: Number(result.acc.stake?.self_staked) * numberOfUsers.value
        },
        power: {
          rating: Number(result.acc.power?.rating ?? 0) * numberOfUsers.value
        },
        team: {
          team_cumulative_contribution: Number(result.acc.team?.team_cumulative_contribution ?? 0) * numberOfUsers.value
        }
      },
      accumulated: {
        ...result.accumulated,
        power_mint: result.accumulated.power_mint * numberOfUsers.value,
        powered_stake_mint: result.accumulated.powered_stake_mint * numberOfUsers.value,
        account_earned: result.accumulated.account_earned * numberOfUsers.value,
        team_cut: result.accumulated.team_cut * numberOfUsers.value,
        team_owner_earned: result.accumulated.team_owner_earned * numberOfUsers.value,
        overstake_mint: result.accumulated.overstake_mint * numberOfUsers.value,
        total: result.accumulated.total * numberOfUsers.value
      }
    }

    // Assign the transformed result to calcData
    calcData.value = transformedResult

    console.log(calcData.value)
  } catch (error) {
    console.error("Failed to fetch calculator data:", error)
  } finally {
    loading.value = false // End loading
  }
}


// to be changed
onMounted(async() => {
  const fetchedBOIDtokenData = await fetchBOIDtokenData()
  tokenData.value = fetchedBOIDtokenData.tokenInfo
  numberOfUsers.value = fetchedBOIDtokenData.avTotals.totalUsers
  basePowerPerRound.value = fetchedBOIDtokenData.avTotals.averagePower
  stake.value = fetchedBOIDtokenData.avTotals.averageStaked
})
</script>
<style lang="scss">
.inflation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Corrected from 'flex-center' to 'center' */
  height: 100%;
  max-width: 100%;
  margin-left: auto; /* Center horizontally */
  margin-right: auto; /* Center horizontally */
}

.stake-state-low {
  background-color: $red-2; /* Light red for low stake */
}

.stake-state-medium {
  background-color: $grey-4; /* Light yellow for medium stake */
}

.stake-state-high {
  background-color: $green-3; /* Light green for high stake */
}

.q-item-section {
  transition: background-color 0.3s ease; /* Smooth transition for color change */
}
.q-expansion-item .q-item {
  width: 100%; // Ensure it fills the container
}
.q-expansion-item .no-wrap {
  flex-wrap: wrap;
}
</style>
