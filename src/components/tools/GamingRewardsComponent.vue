
<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="activeTab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      allign="justify"
      narrow-indicator
    >
      <q-tab name="config" label="Configuration" />
      <q-tab name="game-records" label="Game Records" />
      <q-tab name="rewards" label="Rewards" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="activeTab" animated>
      <!-- Configuration Panel -->
      <q-tab-panel name="config">
        <div class="row q-col-gutter-md">
          <!-- Left Column -->
          <div class="col-12 col-md-6">
            <!-- Global Config -->
            <q-card class="q-mb-md">
              <q-card-section>
                <div class="row items-center justify-between">
                  <div class="text-h6">Global Configuration</div>
                  <q-btn-group flat>
                    <q-btn flat round icon="refresh" @click="refreshConfig" />
                    <q-btn flat round icon="settings" />
                  </q-btn-group>
                </div>
              </q-card-section>
              <q-card-section>
                <template v-if="config?.globalConfig?.length">
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
                </template>
                <div v-else class="text-grey-6 q-pa-md text-center">
                  No global configuration found
                </div>
              </q-card-section>
            </q-card>

            <!-- Token Config -->
            <q-card class="q-mb-md">
              <q-card-section>
                <div class="row items-center justify-between">
                  <div class="text-h6">Token Configuration</div>
                  <q-btn-group flat>
                    <q-btn flat round icon="add" />
                    <q-btn flat round icon="settings" />
                  </q-btn-group>
                </div>
              </q-card-section>
              <q-card-section>
                <template v-if="config?.tokenConfig?.length">
                  <div class="row q-col-gutter-md">
                    <div v-for="token in config.tokenConfig" :key="token.token_contract.toString()" class="col-12">
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

          <!-- Right Column -->
          <div class="col-12 col-md-6">
            <!-- Game Config -->
            <q-card class="q-mb-md">
              <q-card-section>
                <div class="row items-center justify-between">
                  <div class="text-h6">Game Configuration</div>
                  <q-btn-group flat>
                    <q-btn flat round icon="add" />
                    <q-btn flat round icon="settings" />
                  </q-btn-group>
                </div>
              </q-card-section>
              <q-card-section>
                <template v-if="config?.gameConfig?.length">
                  <div v-for="game in config.gameConfig" :key="String(game.game_id)" class="q-mb-sm">
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
              </q-card-section>
            </q-card>

            <!-- Reward Distribution -->
            <q-card class="q-mb-md">
              <q-card-section>
                <div class="row items-center justify-between">
                  <div class="text-h6">Reward Distribution</div>
                  <q-btn-group flat>
                    <q-btn flat round icon="add" />
                    <q-btn flat round icon="settings" />
                  </q-btn-group>
                </div>
              </q-card-section>
              <q-card-section>
                <template v-if="config?.rewardDist?.length">
                  <div class="row q-col-gutter-md">
                    <div v-for="dist in config.rewardDist" :key="dist.game_id.toString()" class="col-12">
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
                </template>
                <div v-else class="q-pa-md text-grey-7">
                  No reward distribution found
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-tab-panel>

      <!-- Game Records Panel -->
      <q-tab-panel name="game-records">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6">
                  Game Records
                  <q-btn flat round icon="refresh" @click="getGameRecords" />
                </div>
              </q-card-section>
              <q-card-section>
                <!-- Add your data table here -->
                <q-table
                  :rows="gameRecords"
                  :columns="gameRecordsColumns"
                  row-key="id"
                  :loading="loading"
                >
                  <!-- Add table slots here -->
                </q-table>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-tab-panel>

      <!-- Rewards Panel -->
      <q-tab-panel name="rewards">
        <div class="row q-col-gutter-md">
          aaaa
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGamingRewardsStore } from 'src/stores/gamingRewardsStore'
import { storeToRefs } from 'pinia'
import {
    ABI,
    Asset,
    Blob,
    Bytes,
    Name,
    Struct,
    TimePointSec,
    UInt32,
    UInt64,
    UInt8,
} from '@wharfkit/antelope'

const gamingRewardsStore = useGamingRewardsStore()
const { config } = storeToRefs(gamingRewardsStore)
const gameRecords = computed(() => gamingRewardsStore.gameRecords ?? [])
const activeTab = ref('config')
const loading = ref(false)

const refreshConfig = async () => {
  loading.value = true
  try {
    await gamingRewardsStore.fetchConfig()
  } finally {
    loading.value = false
  }
}
const getRewardsRecorded = async () => {
  loading.value = true
  try {
    await gamingRewardsStore.fetchRewardsRecorded()
  } finally {
    loading.value = false
  }
}
const getGameRecords = async () => {
  loading.value = true
  try {
    await gamingRewardsStore.fetchGameRecords()
  } finally {
    loading.value = false
  }
}

const timeRemaining = ref('')
const currentCycle = ref(0)

const calculateCycleAndTime = () => {
  if (config.value) {
    const globalConfig = config.value.globalConfig?.[0]
    if (!globalConfig) return

    // Convert TimePointSec to timestamp by multiplying by 1000 (to convert seconds to milliseconds)
    const initTime = new Date(globalConfig.cycles_initiation_time.toString()).getTime()
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

const gameRecordsColumns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    format: (val: number) => val.toString(),
    sortable: true
  },
  {
    name: 'player',
    label: 'Player',
    field: 'player',
    format: (val: Name) => val.toString(),
    sortable: true
  },
  {
    name: 'game_id',
    label: 'Game',
    field: 'game_id',
    format: (val: UInt8) => val.toString(),
    sortable: true
  },
  {
    name: 'rewards_distributed',
    label: 'Distributed?',
    field: 'rewards_distributed',
    format: (val: boolean) => (val ? 'Yes' : 'No'),
    sortable: true
  },
  {
    name: 'stats_names',
    label: 'Stats Names',
    field: 'stats_names',
    format: (val: Name[]) => val.map(name => name.toString()).join(', ')
  },
  {
    name: 'stats_values',
    label: 'Stats Values',
    field: 'stats_values',
    format: (val: UInt64[]) => val.map(value => value.toString()).join(', ')
  },
  {
    name: 'cycle_number',
    label: 'Cycle',
    field: 'cycle_number',
    format: (val: UInt32) => val.toString(),
    sortable: true
  },
  {
    name: 'game_completion_time',
    label: 'Completion Time',
    field: 'game_completion_time',
    format: (val: TimePointSec) => val.toString(),
    sortable: true
  },
  {
    name: 'last_updated',
    label: 'Last Updated',
    field: 'last_updated',
    format: (val: TimePointSec) => val.toString(),
    sortable: true
  }
]

</script>

<style scoped>
.card-class {
  min-width: 400px;
  max-width: 100%;
}
</style>
