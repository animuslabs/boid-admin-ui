
<template>
  <q-page class="container" padding>
    <div class="col-6">
    <q-card class="card-class q-pa-sm q-ma-sm">
      <div class="text-bold">Global Configuration</div>
      <template v-if="config?.globalConfig?.length">
        <div class="q-mt-md">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center q-mb-sm">
                <div class="text-subtitle1">System Status</div>
                <div class="q-ml-lg">
                  <q-chip
                    :color="config.globalConfig?.[0]?.initialized ? 'positive' : 'negative'"
                    :label="config.globalConfig?.[0]?.initialized ? 'Initialized' : 'Not Initialized'"
                    text-color="white"
                    size="md"
                  />
                </div>
              </div>

              <div class="row q-gutter-sm">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Cycles Initiation Time</q-item-label>
                    <q-item-label>
                      {{ config.globalConfig?.[0]?.cycles_initiation_time ? (config.globalConfig[0].cycles_initiation_time).toLocaleString() : 'Not set' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Cycle Length</q-item-label>
                    <q-item-label>{{ config.globalConfig?.[0]?.cycle_length_sec }} seconds</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Max Cycle Length</q-item-label>
                    <q-item-label>{{ config.globalConfig?.[0]?.max_cycle_length_sec }} seconds</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Max Reward Tiers</q-item-label>
                    <q-item-label>{{ config.globalConfig?.[0]?.max_reward_tiers }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Min Reward Percentage</q-item-label>
                    <q-item-label>{{ config.globalConfig?.[0]?.min_reward_percentage }}%</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row q-ma-xs">
                <div class="col">
                    <q-item-label caption>Current Cycle</q-item-label>
                    <q-item-label><b>{{ currentCycle }}</b></q-item-label>
                </div>
                <div class="col">
                    <q-item-label caption>Next Cycle</q-item-label>
                    <q-item-label><b>{{ timeRemaining }}</b></q-item-label>
                </div>

              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
      <div v-else class="text-grey-6 q-pa-md text-center">
        No global configuration found
      </div>
    </q-card>

    <q-card class="card-class q-pa-sm q-ma-sm">
      <!-- Reward Distribution Configuration Card -->
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-bold">Reward Distribution</div>
          <q-chip
            v-if="config?.rewardDist?.length"
            color="positive"
            text-color="white"
            size="md"
          >
            Configured
          </q-chip>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div v-for="dist in config?.rewardDist" :key="dist.game_id.toString()" class="col-12">
            <q-item>
              <q-item-section>
                <div class="row items-center q-gutter-md">
                  <div>
                    <q-item-label caption>Game ID</q-item-label>
                    <q-item-label><b>{{ dist.game_id }}</b></q-item-label>
                  </div>
                  <div>
                    <q-item-label caption>Destination Contract</q-item-label>
                    <q-item-label><b>{{ dist.destination_contract }}</b></q-item-label>
                  </div>
                  <div>
                    <q-item-label caption>Direct Transfer</q-item-label>
                    <q-item-label><b>{{ dist.use_direct_transfer ? 'Yes' : 'No' }}</b></q-item-label>
                  </div>
                </div>
                <div class="q-mt-sm">
                  <q-item-label caption>Memo Template</q-item-label>
                  <q-item-label><b>{{ dist.memo_template }}</b></q-item-label>
                </div>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>
    </q-card>
    </div>
    <div class="col-6">
    <q-card class="card-class q-pa-sm q-ma-sm">
      <!-- Game Config Section -->
        <div class="text-bold">Game Configuration</div>
        <template v-if="config?.gameConfig?.length">
          <div v-for="game in config.gameConfig" :key="String(game.game_id)" class="q-mt-md">
            <q-card flat bordered>
              <q-card-section>
                <div class="row items-center q-mb-sm">
                  <div class="text-subtitle1">{{ game.display_name }}</div>
                  <div class="q-ml-lg">
                    Game ID {{ game.game_id }}
                  </div>
                </div>
                <div class="row q-gutter-sm">
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Stats Names</q-item-label>
                      <q-item-label>
                        <q-chip
                          v-for="stat in game.stats_names"
                          :key="String(stat)"
                          size="md"
                          color="primary"
                          text-color="white"
                        >
                          {{ stat }}
                        </q-chip>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <q-item v-if="game.metadata">
                  <q-item-section>
                    <q-item-label caption>Metadata</q-item-label>
                    <q-item-label class="text-body2">{{ game.metadata }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>
            </q-card>
          </div>
        </template>
        <div v-else class="text-grey-6 q-pa-md text-center">
          No game configurations found
        </div>
    </q-card>

    <q-card class="card-class q-pa-sm q-ma-sm">
      <!-- Token Configuration Card -->
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-bold">Token Configuration</div>
          <q-chip
            v-if="config?.tokenConfig?.length"
            color="positive"
            text-color="white"
            size="md"
          >
            Configured
          </q-chip>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <template v-if="config?.tokenConfig?.length">
          <div class="row q-col-gutter-md">
            <div v-for="token in config.tokenConfig" :key="token.token_contract" class="col-12">
              <q-item>
                <q-item-section>
                  <div class="row items-center q-gutter-md">
                    <div>
                      <q-item-label caption>Token Contract</q-item-label>
                      <q-item-label><b>{{ token.token_contract }}</b></q-item-label>
                    </div>
                    <div>
                      <q-item-label caption>Token Symbol</q-item-label>
                      <q-item-label><b>{{ token.token_symbol }}</b></q-item-label>
                    </div>
                    <div>
                      <q-item-label caption>Precision</q-item-label>
                      <q-item-label><b>{{ token.token_symbol.precision }}</b></q-item-label>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </template>
        <div v-else class="q-pa-md text-grey-7">
          No token configuration found
        </div>
      </q-card-section>
    </q-card>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { useGamingRewardsStore } from 'src/stores/gamingRewardsStore'
import { storeToRefs } from 'pinia'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { toObject } from "src/lib/util"

const gamingRewardsStore = useGamingRewardsStore()
const { config } = storeToRefs(gamingRewardsStore)

const timeRemaining = ref('')
const currentCycle = ref(0)

const calculateCycleAndTime = () => {
  if (config.value) {
    const globalConfig = config.value.globalConfig?.[0]
    if (!globalConfig) return

    const initTime = new Date(toObject(globalConfig.cycles_initiation_time)).getTime()
    const cycleLength = Number(globalConfig.cycle_length_sec) * 1000
    const now = Date.now()
    const timeSinceInit = now - initTime

    // Calculate current cycle
    currentCycle.value = Math.floor(timeSinceInit / cycleLength)

    // Calculate time until next cycle
    const nextCycleStart = initTime + ((currentCycle.value + 1) * cycleLength)
    const remaining = nextCycleStart - now

    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

    timeRemaining.value = `${hours}h ${minutes}m ${seconds}s`
  }
}

let timer: NodeJS.Timer | null = null

onMounted(async () => {
  await gamingRewardsStore.fetchConfig()
  calculateCycleAndTime()
  timer = setInterval(calculateCycleAndTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style>
.container {
  display: flex;
  flex-direction: row inline;
  align-items: top;
  justify-content: center;
  height: 100%;
  max-width: 100%;
  margin-left: auto; /* Center horizontally */
  margin-right: auto; /* Center horizontally */
}
.card-class {
  min-width: 400px;
  max-width: 400px;
  height: fit-content;
}
</style>
