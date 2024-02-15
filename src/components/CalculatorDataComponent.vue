<template>
  <q-page class="container" padding>
    <q-card class="card-class">
      <div class="q-ma-sm text-h6">
        Boid Rewards Calculator
        <q-icon color="primary" name="info">
          <q-tooltip>
            This calculator estimates your BOID rewards based on stake and power, allowing you to simulate different parameters' impact.
            Calculations are performed using a virtual blockchain machine that emulates the Boid core smart contract.
          </q-tooltip>
        </q-icon>
      </div>
      <q-card-section>
        <div class="q-my-md">
          <b>Rewards Period (Months)</b>
          <q-icon class="q-ml-xs" color="primary" name="info">
            <q-tooltip>
              The rewards period is the time frame over which the rewards are calculated. The longer the period, the more rewards you can earn.
            </q-tooltip>
          </q-icon>
          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="schedule" />
            </q-item-section>
            <q-item-section>
              <q-slider
                v-model="periodMonths"
                :min="1"
                :max="18"
                :step="1"
                color="primary"
                label
                label-always
                switch-label-side
                :label-value="periodMonths + ' months'"
                label-alwaysclass="q-my-md"
              />
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div class="q-my-md">
          <b>Power Per Round (13h)</b>
          <q-icon class="q-ml-xs" color="primary" name="info">
            <q-tooltip>
              The power per round is the amount of power you contribute to the Boid network every 13 hours. The more power you contribute, the more rewards you can earn.
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
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div class="q-my-md">
          <b>BOID Stake</b>
          <q-icon class="q-ml-xs" color="primary" name="info">
            <q-tooltip>
              The BOID stake is the amount of BOID tokens you have staked.
              The more you stake, the more rewards you can earn. The maximum powered stake is calculated based on the power per round.
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
          <q-item :class="`stake-state-${stakeState}`" class="q-mt-md">
            <q-item-section style="width: 100%">
              <div class="row items-start justify-between">
                <div class="col">
                  <div>
                    <b>Max Powered Stake</b>
                    <q-icon class="q-ml-xs" color="primary" name="info">
                      <q-tooltip>
                        Max powered stake is influenced by your power per round.
                        In scenarios where power is low but stake is high, an overstake event occurs, leading to a portion of your rewards being directed to the Boid DAO.
                        The greater the overstake, the larger the share of rewards goes to the Boid DAO.
                      </q-tooltip>
                    </q-icon>
                  </div>
                  <div>{{ formattedMaxPoweredStake }} BOID</div>
                </div>
                <q-icon :name="stakeIcon(stakeState as StakeState)" size="40px" color="primary" class="col-auto" />
              </div>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <q-toggle v-model="liveSim" label="Live Power Simulation" />
        <q-icon class="q-ml-xs" color="primary" name="info">
          <q-tooltip>
            Random +-20% change of power is applied to simulate real live power contribution.
          </q-tooltip>
        </q-icon>
        <q-separator inset />
        <q-toggle v-model="activeSponsor" label="Active Sponsor" />
        <q-icon class="q-ml-xs" color="primary" name="info">
          <q-tooltip>
            When user has a sponsor, the sponsor's tax is applied to the user's rewards. When user has a Gold Account, there is no tax.
          </q-tooltip>
        </q-icon>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <b>Team TAX (%)</b>
        <q-icon class="q-ml-xs" color="primary" name="info">
          <q-tooltip>
            Each team member is being taxed by the team. The tax is used to fund the team's activities.
          </q-tooltip>
        </q-icon>
        <q-item>
          <q-item-section>
            <q-input standout dense v-model.number="userTaxPercentage" type="number" min="0" max="100">
              <template #prepend>
                <q-icon color="primary" name="account_balance" />
              </template>
            </q-input>
          </q-item-section>
          <q-item-section>
            <q-slider
              v-model.number="userTaxPercentage"
              :min="0"
              :max="100"
              :step="1"
              color="primary"
              label
              label-always
              switch-label-side
              :label-value="`${userTaxPercentage} %`"
              type="number"
              class="q-my-md"
            />
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator inset />
      <q-btn class="q-ma-md" label="Calculate" color="primary" @click="fetchData" :loading="loading" :disable="loading" />
    </q-card>
    <q-card class="card-class">
      <div v-if="calcData">
        <q-list class="rounded-borders">
          <q-expansion-item
            expand-separator
            dense-toggle
            icon="expand_more"
            v-model="showDetails"
            expand-icon="none"
            class="text-primary"
          >
            <template #header>
              <q-item
                class="bg-primary text-white"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <img src="src/assets/TokenLogo-light.png" alt="Reward" style="width: 100%; height: 40px;">
                </q-item-section>
                <q-item-section>
                  <strong>Estimated Account Reward: {{ calcData.accumulated.account_earned.toLocaleString('en-US').replace(/,/g, "'") }} BOID</strong>
                </q-item-section>
                <q-item-section side>
                  <q-icon :name="showDetails ? 'expand_less' : 'expand_more'" />
                </q-item-section>
              </q-item>
            </template>
            <q-item>
              <q-item-section avatar>
                <q-icon name="flash_on" color="primary" />
              </q-item-section>
              <q-item-section>
                <div>
                  From Power
                  <q-icon class="q-ml-xs" color="primary" name="info">
                    <q-tooltip>
                      BOID minted only from power without stake.
                    </q-tooltip>
                  </q-icon>
                </div>
                <b>{{ calcData.accumulated.power_mint.toLocaleString("en-US").replace(/,/g, "'") }}</b>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="account_balance_wallet" color="primary" />
              </q-item-section>
              <q-item-section>
                <div>
                  From Powered Stake<q-icon class="q-ml-xs" color="primary" name="info">
                    <q-tooltip>BOID minted only from stake that is backed by Boid Power. Unpowered stake mint always goes to the Boid DAO.</q-tooltip>
                  </q-icon>
                </div>
                <b>{{ calcData.accumulated.powered_stake_mint.toLocaleString("en-US").replace(/,/g, "'") }}</b>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item>
              <q-item-section avatar>
                <q-icon name="group" color="primary" />
              </q-item-section>
              <q-item-section>
                <div>
                  Team Contribution
                  <q-icon class="q-ml-xs" color="primary" name="info">
                    <q-tooltip>
                      Share of account's contribution to the team.
                    </q-tooltip>
                  </q-icon>
                </div>
                <b>{{ calcData.acc.team.team_cumulative_contribution.toLocaleString("en-US").replace(/,/g, "'") }}</b>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="content_cut" color="primary" />
              </q-item-section>
              <q-item-section>
                <div>
                  Team TAX Cut<q-icon class="q-ml-xs" color="primary" name="info">
                    <q-tooltip>BOID minted and allocated to the user's respective Boid Team. Each team define's their own tax level.</q-tooltip>
                  </q-icon>
                </div>
                <b>{{ calcData.accumulated.team_cut.toLocaleString("en-US").replace(/,/g, "'") }}</b>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="diversity_1" color="primary" />
              </q-item-section>
              <q-item-section>
                <div>
                  Overstake Mint<q-icon class="q-ml-xs" color="primary" name="info">
                    <q-tooltip>BOID minted that goes straight to the Boid DAO.</q-tooltip>
                  </q-icon>
                </div>
                <b>{{ calcData.accumulated.overstake_mint.toLocaleString("en-US").replace(/,/g, "'") }}</b>
              </q-item-section>
            </q-item>
            <q-separator size="0.2em" />
            <q-item>
              <q-item-section avatar>
                <q-icon name="toll" color="primary" />
              </q-item-section>
              <q-item-section>
                <strong>Total BOID Mint
                  <q-icon class="q-ml-xs" color="primary" name="info">
                    <q-tooltip>
                      Sum of all minted BOID connected to the account. During this simulation.
                    </q-tooltip>
                  </q-icon>
                </strong>
                <span style="color: rgb(18, 116, 18);">{{ calcData.accumulated.total.toLocaleString("en-US").replace(/,/g, "'") }}</span>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from "vue"
import { fetchCalculatorData } from "src/lib/trpc/data"
import { useConfigStore } from "stores/configStore"
import { toObject } from "src/lib/util"
import { CalcDataStructure } from "src/lib/trpc/interfaces"

const store = useConfigStore()
const config = reactive({
  account: {
    invite_price: 0,
    premium_purchase_price: 0,
    max_premium_prefix: 0,
    max_owners: 0,
    max_boosters: 0,
    suffix_whitelist: [""],
    remove_sponsor_price: 0,
    sponsor_max_invite_codes: 0,
    invite_code_expire_rounds: 0
  },
  power: {
    sponsor_tax_mult: 0,
    powered_stake_mult: 0,
    claim_maximum_elapsed_rounds: 0,
    soft_max_pwr_add: 0,
    history_slots_length: 0
  },
  mint: {
    round_powered_stake_mult: 0,
    round_power_mult: 0
  },
  team: {
    change_min_rounds: 0,
    edit_team_min_rounds: 0,
    team_edit_max_pct_change: 0,
    buy_team_cost: 0,
    owner_stake_required: 0,
    owner_future_stake_lock_rounds_required: 0
  },
  stake: {
    unstake_rounds: 0,
    extra_stake_min_locked_rounds: 0
  },
  time: {
    rounds_start_sec_since_epoch: 0,
    round_length_sec: 0
  },
  auth: {
    key_actions_whitelist: [""],
    key_account_max_stake: 0,
    key_account_max_balance: 0,
    account_max_keys: 0,
    worker_max_bill_per_action: 0
  },
  nft: {
    boid_id_maximum_nfts: 0,
    whitelist_collections: [""]
  },
  paused: false,
  allow_deposits: false,
  allow_withdrawals: false,
  recoveryAccount: ""
})
onMounted(async() => {
  const fetchedConfig = await store.fetchConfig()
  if (fetchedConfig && fetchedConfig[0]) {
    const configObject = toObject(fetchedConfig[0])
    Object.assign(config, configObject)
  }
})

const loading = ref(false)
const showDetails = ref(false)
const userTaxPercentage = ref(10) // Example starting value, representing 10%
const configAccountAdjusted = computed(() => ({
  min_pwr_tax_mult: userTaxPercentage.value * 2
}))


const periodMonths = ref(1) // User-selected period in months
// Calculated number of rounds based on the period in months
const rounds = computed(() => {
  const secondsPerMonth = 30.44 * 24 * 3600 // Average seconds in a month
  const roundDuration = 46800 // Duration of one round in seconds
  return Math.floor(periodMonths.value * secondsPerMonth / roundDuration)
})

const basePowerPerRound = ref(100)
const stake = ref(100)
const formattedStake = computed(() => {
  return stake.value.toLocaleString("en-US").replace(/,/g, "'")
})
const liveSim = ref(false)
const activeSponsor = ref(false)

const userConfig = computed(() => (
  {
    power: {
      sponsor_tax_mult: parseFloat(config.power.sponsor_tax_mult.toString()),
      powered_stake_mult: parseFloat(config.power.powered_stake_mult.toString())
    },
    mint: {
      round_powered_stake_mult: parseFloat(config.mint.round_powered_stake_mult.toString()),
      round_power_mult: parseFloat(config.mint.round_power_mult.toString())
    }
  }
))

const max_powered_stake = computed(() => {
  // Ensure you're accessing reactive properties correctly
  const multiplier = config.power.powered_stake_mult
  const powerPerRound = basePowerPerRound.value
  return multiplier * powerPerRound
})
const formattedMaxPoweredStake = computed(() => {
  return max_powered_stake.value.toLocaleString("en-US").replace(/,/g, "'")
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

const stakeIcon = (state:StakeState):string => {
  switch (state) {
    case "low":
      return "mood_bad" // sad face icon
    case "medium":
      return "sentiment_neutral" // better face icon
    case "high":
      return "rocket_launch" // rocket icon
    default:
      return "" // default case, no icon
  }
}

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
      liveSim.value,
      activeSponsor.value,
      { min_pwr_tax_mult: configAccountAdjusted.value.min_pwr_tax_mult }
    )

    // Transform and update calcData with relevant parts of result
    calcData.value = {
      acc: {
        stake: {
          self_staked: Number(result.acc.stake?.self_staked)
        },
        power: {
          rating: Number(result.acc.power?.rating ?? 0)
        },
        team: {
          team_cumulative_contribution: Number(result.acc.team?.team_cumulative_contribution ?? 0)
        }
      },
      accumulated: result.accumulated // Assuming this directly matches MintObject structure
    }

    console.log(calcData.value)
  } catch (error) {
    console.error("Failed to fetch calculator data:", error)
  } finally {
    loading.value = false // End loading
  }
}


</script>
<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Corrected from 'flex-center' to 'center' */
  height: 100%;
  max-width: 600px;
  margin-left: auto; /* Center horizontally */
  margin-right: auto; /* Center horizontally */
}
.card-class {
  width: 100%;
  max-width: 600px;
  margin: 10px;
  padding: 10px;
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
