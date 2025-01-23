<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Initialize Contract Configuration</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <q-input
            v-model="form.start_time"
            type="datetime-local"
            label="Start Time"
            :rules="[val => !!val || 'Start time is required']"
          />
          <q-input
            v-model="form.cycle_length_sec"
            type="number"
            label="Cycle Length (seconds)"
            :rules="[val => !!val || 'Cycle length is required']"
          />
          <q-input
            v-model="form.max_cycle_length_sec"
            type="number"
            label="Max Cycle Length (seconds)"
            :rules="[val => !!val || 'Max cycle length is required']"
          />
          <q-input
            v-model="form.max_reward_tiers"
            type="number"
            label="Max Reward Tiers"
            :rules="[val => !!val || 'Max reward tiers is required']"
          />
          <q-input
            v-model="form.min_reward_percentage"
            type="number"
            label="Min Reward Percentage"
            :rules="[val => !!val || 'Min reward percentage is required']"
          />
          <div class="row justify-end q-gutter-sm">
            <q-btn label="Cancel" color="primary" flat v-close-popup />
            <q-btn label="Submit" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
import { useGamingRewardsStore } from 'src/stores/gamingRewardsStore'
import { TimePointSec } from '@wharfkit/antelope'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{(e:'update:modelValue', value:boolean):void}>()

const gamingRewardsStore = useGamingRewardsStore()

const form = ref({
  start_time: '',
  cycle_length_sec: '',
  max_cycle_length_sec: '',
  max_reward_tiers: '',
  min_reward_percentage: ''
})

const handleSubmit = async () => {
  try {
    await gamingRewardsStore.createInitiateContractAction({
      start_time: TimePointSec.from(new Date(form.value.start_time)),
      cycle_length_sec: Number(form.value.cycle_length_sec),
      max_cycle_length_sec: Number(form.value.max_cycle_length_sec),
      max_reward_tiers: Number(form.value.max_reward_tiers),
      min_reward_percentage: Number(form.value.min_reward_percentage)
    })
    emit('update:modelValue', false)
    // Reset form
    form.value = {
      start_time: '',
      cycle_length_sec: '',
      max_cycle_length_sec: '',
      max_reward_tiers: '',
      min_reward_percentage: ''
    }
    // Refresh the config after submission
    await gamingRewardsStore.fetchConfig()
  } catch (error) {
    console.error('Error submitting config:', error)
  }
}
</script>
