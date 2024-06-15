<template>
  <q-page class="container" padding>
    <q-card class="card-class">
      <div>
        Current Round: <b>{{ currentRound }}</b>
      </div>
      <div>
        Round Progress: <b>{{ roundProgress }}</b>
      </div>
      <q-card-section>
        <q-date class="q-mr-md" v-model="startDate" mask="YYYY-MM-DD" minimal :min="minDate" :max="today" />
        <q-date v-model="endDate" mask="YYYY-MM-DD" minimal :min="startDate" :max="today" />
      </q-card-section>
      <q-card-section>
        <q-btn label="Calculate Rounds" color="primary" @click="calculateRounds" />
        <div class="q-mt-sm" v-if="startRound && endRound">
          Start Round: <b>{{ startRound }}</b>, End Round: <b>{{ endRound }}</b>
          <p>Total Rounds Locked: <b>{{ endRound - startRound }}</b></p>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, reactive } from "vue"
import { useConfigStore } from "stores/configStore"
import { toObject } from "src/lib/util"

const today = new Date().toISOString().substring(0, 10)
const startDate = ref(today)
const endDate = ref(today)
const startRound = ref<number | null>(null)
const endRound = ref<number | null>(null)
const roundProgress = ref<string>("00:00:00")

const store = useConfigStore()
const config = reactive({
  time: {
    rounds_start_sec_since_epoch: 0,
    round_length_sec: 0
  }
})

const minDate = computed(() => new Date(config.time.rounds_start_sec_since_epoch * 1000).toISOString().substring(0, 10))

const currentRound = computed(() => {
  const now = Date.now() / 1000
  return Math.floor((now - config.time.rounds_start_sec_since_epoch) / config.time.round_length_sec)
})

let interval:number | NodeJS.Timeout | undefined

onMounted(async() => {
  const fetchedConfig = await store.fetchConfig()
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

function padZero(num:number) {
  return num.toString().padStart(2, "0")
}

function calculateRounds() {
  const startSeconds = new Date(startDate.value).getTime() / 1000
  const endSeconds = new Date(endDate.value).getTime() / 1000
  startRound.value = Math.floor((startSeconds - config.time.rounds_start_sec_since_epoch) / config.time.round_length_sec) + 1
  endRound.value = Math.floor((endSeconds - config.time.rounds_start_sec_since_epoch) / config.time.round_length_sec) + 1
}
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Corrected from 'flex-center' to 'center' */
  height: 100%;
  max-width: 700px;
  margin-left: auto; /* Center horizontally */
  margin-right: auto; /* Center horizontally */
}
.card-class {
  width: 100%;
  max-width: 650px;
  margin: 10px;
  padding: 10px;
}
</style>
