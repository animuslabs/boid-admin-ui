<template>
  <q-page class="container" padding>
    <q-card class="card-class">
      <div class="col-auto q-mr-md">
        <q-card>
          <q-card-section class="row">
            <div class="col">
              <div class="text-h6">
                Enter Boid ID
              </div>
              <q-input
                class="inputForm"
                filled
                v-model="search"
                placeholder="Boid ID"
                debounce="300"
                @input="onSearch"
              />
              <div class="list-container" v-if="filteredBoidIds.length && !boidSelected">
                <q-list bordered>
                  <q-item
                    v-for="boid in filteredBoidIds"
                    :key="boid"
                    clickable
                    dense
                    @click="selectBoidId(boid)"
                  >
                    <q-item-section>{{ boid }}</q-item-section>
                  </q-item>
                </q-list>
              </div>
              <q-form @submit.prevent="onSubmit" class="q-gutter-md">
                <q-btn label="Get Data" type="submit" color="primary" />
              </q-form>
            </div>
          </q-card-section>
          <q-card-section class="row">
            <div class="col">
              <div class="font-bold ">
                Acc status in BOID
                <q-btn
                  icon="refresh"
                  color="primary"
                  flat
                  size="sm"
                  @click="refreshData"
                  class="q-ml-sm"
                >
                  <q-tooltip>
                    <span>Refresh Data</span>
                  </q-tooltip>
                </q-btn>
              </div>
              <div>Liquid: {{ walletData.liquidBalance }}</div>
              <div>Self Stake: {{ walletData.selfStake }}</div>
              <div>Delegated Stake: {{ walletData.delegatedStake }}</div>
              <div>Total Stake: {{ walletData.selfStake + walletData.delegatedStake }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-auto q-mr-md">
        <q-card>
          <q-card-section class="row">
            <div class="col q-mr-sm">
              <div class="text-h6">
                Unstake
              </div>
              <q-form @submit.prevent="onUnstake">
                <q-input class="inputForm" filled dense v-model="walletData.selfUnstake" label="Unstake amount" type="number" />
                <q-btn label="Unstake" type="submit" color="primary" class="q-ma-sm" />
              </q-form>
            </div>
            <div class="col">
              <div class="text-h6">
                Stake
              </div>
              <q-form @submit.prevent="onStake">
                <q-input class="inputForm" filled dense v-model="walletData.liquidBalance" label="Stake amount" type="number" />
                <q-btn label="Stake" type="submit" color="primary" class="q-ma-sm" />
              </q-form>
            </div>
          </q-card-section>

          <q-card-section class="col">
            <div>
              Current Round: <b>{{ currentRound }}</b> | Round Progress: <b>{{ roundProgress }}</b>
            </div>
            <div class="font-bold q-mt-sm">
              Unstaking
            </div>
            <q-table
              :rows="walletData.unstaking"
              :columns="unstakingColumns"
              row-key="redeemable_after_round"
            >
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    icon="check"
                    color="primary"
                    round
                    dense
                    size="sm"
                    @click="onRedeemUnstake(props.row)"
                  />
                  <q-btn
                    icon="remove"
                    color="secondary"
                    round
                    dense
                    size="sm"
                    @click="onCancelUnstake(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-auto">
        <q-card>
          <q-card-section>
            <div class="col-12 text-h6">
              Withdraw
            </div>
            <div class="col-12">
              <q-form @submit.prevent="onWithdraw">
                <q-input class="inputForm q-pb-sm" filled dense v-model="walletData.withDrawQuantity" label="Withdraw amount" type="number" />
                <q-input class="inputForm" filled dense v-model="walletData.withDrawTo" label="Withdraw to" />
                <q-btn label="Withdraw" type="submit" color="primary" class="q-ma-sm" />
              </q-form>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="col-12 text-h6">
              Internal Transfer
            </div>
            <div class="col-12">
              <q-form @submit.prevent="onInternalTransfer">
                <q-input class="inputForm q-mb-sm" filled dense v-model="walletData.internalTrasferQuantity" label="Transfer amount" type="number" />
                <q-input class="inputForm" filled dense v-model="walletData.internalTransferTo" label="Transfer to" />
                <q-btn label="Transfer" type="submit" color="primary" class="q-ma-sm" />
              </q-form>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-card>
  </q-page>
</template>



<script lang="ts" setup>
import { onMounted, onUnmounted, ref, Ref, computed, watch, reactive } from "vue"
import { userStore } from "src/stores/usersStore"
import { useConfigStore } from "src/stores/configStore"
import { walletStore } from "src/stores/walletStore"
import { AccountStakingData, TeamTokenUnstake } from "src/types/types-stores"
import { storeToRefs } from "pinia"
import { toObject } from "src/lib/util"

const store = userStore()
const wallet = walletStore()

// Rounds logic
const configStore = useConfigStore()
const config = reactive({
  time: {
    rounds_start_sec_since_epoch: 0,
    round_length_sec: 0
  }
})
const currentRound = computed(() => {
  const now = Date.now() / 1000
  return Math.floor((now - config.time.rounds_start_sec_since_epoch) / config.time.round_length_sec)
})
const roundProgress = ref<string>("00:00:00")
let interval:number | NodeJS.Timeout | undefined
function padZero(num:number) {
  return num.toString().padStart(2, "0")
}
onMounted(async() => {
  const fetchedConfig = await configStore.fetchConfig()
  if (fetchedConfig && fetchedConfig[0]) {
    const configObject = toObject(fetchedConfig[0])
    Object.assign(config, configObject)
  }
  updateRoundProgress()
  interval = setInterval(updateRoundProgress, 1000)
})
onUnmounted(() => {
  clearInterval(interval)
})

function updateRoundProgress() {
  const now = Date.now() / 1000
  const currentRoundStart = config.time.rounds_start_sec_since_epoch + (currentRound.value) * config.time.round_length_sec
  const secondsIntoRound = now - currentRoundStart
  const secondsRemaining = config.time.round_length_sec - secondsIntoRound
  const hours = Math.floor(secondsRemaining / 3600)
  const minutes = Math.floor((secondsRemaining % 3600) / 60)
  const seconds = Math.floor(secondsRemaining % 60)
  roundProgress.value = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
}
function convertRoundToDate(redeemable_after_round:number):string {
  const roundStartTime = config.time.rounds_start_sec_since_epoch + (redeemable_after_round * config.time.round_length_sec)
  const date = new Date(roundStartTime * 1000)
  return date.toISOString().replace("T", " ").substring(0, 16)
}

const { organizedAccStakingData: organizedDataRaw } = storeToRefs(store)
const organizedData = organizedDataRaw as Ref<AccountStakingData[] | undefined>
const search = ref("")
const boidSelected = ref(false)
const filteredBoidIds = computed(() => {
  if (!search.value || !organizedData.value) return []
  return organizedData.value
    .filter(account => account.boid_id.includes(search.value))
    .map(account => account.boid_id)
})
const walletData = ref(
  {
    boidId: "",
    liquidBalance: 0,
    selfStake: 0,
    selfUnstake: 0,
    delegatedStake: 0,
    delegatedUnstake: 0,
    withDrawQuantity: 0,
    withDrawTo: "",
    internalTrasferQuantity: 0,
    internalTransferTo: "",
    unstaking: [] as (TeamTokenUnstake & { date:string })[]
  }
)

const unstakingColumns = [
  { name: "quantity", required: true, label: "BOID", align: "left" as const, field: "quantity" },
  { name: "redeemable_after_round", required: true, label: "After Round", align: "left" as const, field: "redeemable_after_round" },
  { name: "date", required: true, label: "Date", align: "left" as const, field: "date" },
  { name: "actions", required: true, label: "Actions", align: "left" as const, field: "actions" }
]

const selectBoidId = (boid:string) => {
  walletData.value.boidId = boid
  search.value = boid
  boidSelected.value = true
}
const onSearch = () => {
  walletData.value.boidId = search.value
  boidSelected.value = false
}
watch(search, (newVal, oldVal) => {
  if (newVal === "") {
    walletData.value.boidId = ""
  } else {
    boidSelected.value = false
  }
})
const onSubmit = async() => {
  const account = organizedData.value?.find(account => account.boid_id === search.value)
  if (account) {
    walletData.value = {
      boidId: account.boid_id,
      liquidBalance: account.balance,
      selfStake: account.self_staked,
      selfUnstake: account.self_staked,
      delegatedStake: account.received_delegated_stake,
      delegatedUnstake: account.received_delegated_stake,
      withDrawQuantity: account.balance,
      withDrawTo: "vault.boid",
      internalTrasferQuantity: account.balance,
      internalTransferTo: "",
      unstaking: account.unstaking.map(unstake => ({
        ...unstake,
        date: convertRoundToDate(unstake.redeemable_after_round)
      }))
    }
  }
}
const onWithdraw = async() => {
  await wallet.withdrawAction(walletData.value.boidId, walletData.value.withDrawQuantity, walletData.value.withDrawTo)
}
const onInternalTransfer = async() => {
  await wallet.internalXferAction(walletData.value.boidId, walletData.value.internalTransferTo, walletData.value.internalTrasferQuantity, "Go Boid!")
}
const onUnstake = async() => {
  await wallet.unstakeInitAction(walletData.value.boidId, walletData.value.selfUnstake)
}
const onStake = async() => {
  await wallet.stakeAction(walletData.value.boidId, walletData.value.liquidBalance)
}
const onRedeemUnstake = async() => {
  await wallet.unstakeEndAction(walletData.value.boidId)
}
const onCancelUnstake = async() => {
  await wallet.unstakeStopAction(walletData.value.boidId)
}
const refreshData = async() => {
  await store.fetchAccStakingData()
}

onMounted(async() => {
  await store.fetchAccStakingData()
})

</script>
<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-width: 100%;
  margin-left: auto; /* Center horizontally */
  margin-right: auto; /* Center horizontally */
}
.inputForm {
  max-width: 200px;
}
.list-container {
  position: absolute;
  z-index: 1000;
  width: 100%;
  max-width: 250px;
  background: white;
}
.card-class {
  width: 100%;
  max-width: 600px;
  margin: 10px;
  padding: 10px;
}
</style>
