
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
    <q-tab name="rewards" label="Rewards" />
    <q-tab name="game-records" label="Game Records" />
    <q-tab name="config" label="Configuration" />

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
                    <q-btn flat round icon="build" @click="showConfigDialog = true" />
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
                    <q-btn flat round icon="add_circle_outline" @click="showSetTokenDialog = true" />
                    <q-btn flat round icon="delete" @click="showRemoveTokenDialog = true" />
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
                    <q-btn flat round icon="sports_esports" @click="showGameConfigDialog = true" />
                    <q-btn flat round icon="delete" @click="showGameRemoveDialog = true" />
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
                    <q-btn flat round icon="add" @click="showSetDistConfigDialog = true" />
                    <q-btn flat round icon="delete" @click="showRemoveDistConfigDialog = true"/>
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
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-h6">
                    Game Records
                    <q-btn flat round icon="refresh" @click="getGameRecords" />
                    <q-btn round icon="add" color="green" size="sm" @click="showGameAddRecordDialog = true" />
                    <q-btn round icon="delete" color="red" size="sm" @click="removeGameRecords" />
                  </div>
                  <q-input
                    v-model="searchQuery"
                    dense
                    outlined
                    placeholder="Search records..."
                    class="col-4"
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </q-card-section>
              <q-card-section>
                <!-- Add your data table here -->
                <q-table
                  :rows="filteredGameRecords"
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
          <div class="col-12">
            <q-card>
              <q-card-section>
                <q-badge class="q-mr-sm">Current Cycle: {{ currentCycle }}</q-badge><q-badge>Time Remaining: {{ timeRemaining }}</q-badge>
                <q-btn flat round icon="refresh" @click="getRewardsRecorded" />
                <q-btn round icon="add" color="green" size="sm"  @click="rewardsDialog = true" />
                <div class="text-h6">
                  Rewards
                </div>
              </q-card-section>
              <q-card-section>
                <!-- Add your data table here -->
                <q-table
                  :rows="gameRewards"
                  :columns="gameRewardsColumns"
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
    </q-tab-panels>
  </q-page>

  <!-- Add Rewards Distribution Dialog -->
  <RewardsDialog
    v-model="rewardsDialog"
    @submit="handleDistributeSubmit"
  />

  <!-- Add Clear Records Dialog -->
  <ClearRecordsDialog
    v-model="clearRecordsDialog"
    @submit="handleClearRecords"
  />

  <ConfigInitDialog v-model="showConfigDialog" />

  <GameConfigDialog v-model="showGameConfigDialog" />

  <GameRemoveDialog
    v-model="showGameRemoveDialog"
    @submit="handleRemoveGame"
  />

  <SetDistConfigDialog
    v-model="showSetDistConfigDialog"
    @submit="handleSetDistConfig"
  />

  <SetTokenDialog
    v-model="showSetTokenDialog"
    @submit="handleSetToken"
  />

  <RemoveTokenDialog
    v-model="showRemoveTokenDialog"
    @submit="handleRemoveToken"
  />

  <RemoveDistConfigDialog
    v-model="showRemoveDistConfigDialog"
    @submit="handleRemoveDistConfig"
  />

  <GameAddRecordDialog
    v-model="showGameAddRecordDialog"
    @submit="handleAddGameRecord"
  />

</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useGamingRewardsStore } from 'src/stores/gamingRewardsStore'
import ConfigInitDialog from '../dialogs/ConfigInitDialog.vue'
import GameConfigDialog from '../dialogs/GameConfigDialog.vue'
import RewardsDialog from '../dialogs/RewardsDialog.vue'
import ClearRecordsDialog from '../dialogs/ClearRecordsDialog.vue'
import GameRemoveDialog from '../dialogs/GameRemoveDialog.vue'
import SetDistConfigDialog from '../dialogs/SetDistConfig.vue'
import SetTokenDialog from '../dialogs/SetTokenDialog.vue'
import RemoveTokenDialog from '../dialogs/RemoveTokenDialog.vue'
import RemoveDistConfigDialog from '../dialogs/RemoveDistConfigDialog.vue'
import GameAddRecordDialog from '../dialogs/GameAddRecordDialog.vue'
import { storeToRefs } from 'pinia'
import { DistributeForm, ConfigForm } from 'src/types/gamingRecordsComponentTypes'
import {
    Asset,
    Name,
    TimePointSec,
    UInt32,
    UInt64,
    UInt8,
    Bytes
} from '@wharfkit/antelope'
import { gameRecordsColumns, gameRewardsColumns } from '../columns/GamingRewCompCol'

const gamingRewardsStore = useGamingRewardsStore()
const { config } = storeToRefs(gamingRewardsStore)
const gameRecords = computed(() => gamingRewardsStore.gameRecords ?? [])
const gameRewards = computed(() => gamingRewardsStore.rewardsRecorded ?? [])
const activeTab = ref('rewards')
const loading = ref(false)
const rewardsDialog = ref(false)
const clearRecordsDialog = ref(false)
const showConfigDialog = ref(false)
const showGameConfigDialog = ref(false)
const showGameRemoveDialog = ref(false)
const showSetDistConfigDialog = ref(false)
const showSetTokenDialog = ref(false)
const showRemoveTokenDialog = ref(false)
const showRemoveDistConfigDialog = ref(false)
const showGameAddRecordDialog = ref(false)
const searchQuery = ref('')

const filteredGameRecords = computed(() => {
  if (!searchQuery.value) return gameRecords.value

  const query = searchQuery.value.toLowerCase()
  return gameRecords.value.filter(record => {
    // Convert all fields to string and search
    return Object.values(record).some(value => {
      if (Array.isArray(value)) {
        return value.some(v => String(v).toLowerCase().includes(query))
      }
      return String(value).toLowerCase().includes(query)
    })
  })
})

const handleDistributeSubmit = async (formData: DistributeForm) => {
  try {
    loading.value = true
    const data = {
      game_id: UInt8.from(parseInt(formData.game_id)),
      cycle_number: UInt32.from(parseInt(formData.cycle_number)),
      stat_name: Name.from(formData.stat_name),
      total_reward: Asset.from(formData.total_reward),
      token_contract: Name.from(formData.token_contract),
      reward_percentages: Bytes.from(formData.reward_percentages.split(',').map(p => parseInt(p.trim())))
    }
    await gamingRewardsStore.createDistributeAction(data)
    rewardsDialog.value = false
    await getRewardsRecorded()
  } catch (error) {
    console.error('Error distributing rewards:', error)
  } finally {
    loading.value = false
  }
}

const configForm = ref<ConfigForm>({
  start_time: '',
  cycle_length_sec: '',
  max_cycle_length_sec: '',
  max_reward_tiers: '',
  min_reward_percentage: ''
})

// Watch for config changes to update form defaults
watch(() => config.value, (newConfig) => {
  if (newConfig?.globalConfig?.[0]) {
    const date = new Date(newConfig.globalConfig[0].cycles_initiation_time.toDate())
    configForm.value = {
      start_time: date.toISOString().slice(0, 16), // Format for datetime-local input
      cycle_length_sec: newConfig.globalConfig[0].cycle_length_sec.toString(),
      max_cycle_length_sec: newConfig.globalConfig[0].max_cycle_length_sec.toString(),
      max_reward_tiers: newConfig.globalConfig[0].max_reward_tiers.toString(),
      min_reward_percentage: newConfig.globalConfig[0].min_reward_percentage.toString()
    }
  }
}, { immediate: true })

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

const removeGameRecords = () => {
  clearRecordsDialog.value = true
}

const handleClearRecords = async (recordIdsInput: string) => {
  try {
    if (!recordIdsInput) return

    const ids = recordIdsInput.split(',').map(id => id.trim())
    if (!ids.length) return

    await gamingRewardsStore.createClearRecordAction({
      record_ids: ids.map(id => UInt64.from(id))
    })

    clearRecordsDialog.value = false
    await getGameRecords()
  } catch (error) {
    console.error('Error clearing records:', error)
  }
}

const handleRemoveGame = async (data: { game_id: UInt8 }) => {
  try {
    await gamingRewardsStore.createRemoveGameAction(data)
    await gamingRewardsStore.fetchConfig()
  } catch (error) {
    console.error('Error removing game:', error)
  }
}

const handleSetDistConfig = async (data: {
  game_id: UInt8
  destination_contract: Name
  memo_template: string
  use_direct_transfer: boolean
}) => {
  try {
    await gamingRewardsStore.createSetDistConfigAction(data)
    await gamingRewardsStore.fetchConfig()
  } catch (error) {
    console.error('Error setting distribution config:', error)
  }
}

const handleSetToken = async (data: {
  token_contract: Name
  token_symbol: Asset.Symbol
  enabled: boolean
}) => {
  try {
    await gamingRewardsStore.createSetTokenAction(data)
    await gamingRewardsStore.fetchConfig()
  } catch (error) {
    console.error('Error setting token config:', error)
  }
}

const handleRemoveToken = async (data: { token_symbol: Asset.Symbol }) => {
  try {
    await gamingRewardsStore.createRemoveTokenAction(data)
    await gamingRewardsStore.fetchConfig()
  } catch (error) {
    console.error('Error removing token:', error)
  }
}

const handleRemoveDistConfig = async (data: { game_id: UInt8 }) => {
  try {
    await gamingRewardsStore.createRemoveDistConfigAction(data)
    await gamingRewardsStore.fetchConfig()
  } catch (error) {
    console.error('Error removing distribution config:', error)
  }
}

const handleAddGameRecord = async (data: { records: {
  game_id: UInt8
  player: Name
  stats_names: Name[]
  stats_values: UInt64[]
  completion_time: TimePointSec
}[] }) => {
  try {
    await gamingRewardsStore.createRecordGameAction(data)
    await getGameRecords()
  } catch (error) {
    console.error('Error adding game record:', error)
  }
}
</script>

<style scoped>
.card-class {
  min-width: 400px;
}
</style>
