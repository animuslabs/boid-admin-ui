<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Add Game Record</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="handleSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.game_id"
                label="Game ID"
                type="number"
                outlined
                dense
                :rules="[val => !!val || 'Game ID is required']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.player"
                label="Player"
                outlined
                dense
                placeholder="e.g., player.name"
                :rules="[val => !!val || 'Player name is required']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.stats_names"
                label="Stats Names"
                outlined
                dense
                placeholder="e.g., kills,deaths,score"
                hint="Comma-separated list of stat names"
                :rules="[
                  val => !!val || 'Stats names are required',
                  val => /^[a-z1-5.]+(?:,[a-z1-5.]+)*$/.test(val) || 'Invalid format. Use comma-separated names'
                ]"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.stats_values"
                label="Stats Values"
                outlined
                dense
                placeholder="e.g., 10,5,100"
                hint="Comma-separated list of values (must match stats names count)"
                :rules="[
                  val => !!val || 'Stats values are required',
                  val => /^\d+(?:,\d+)*$/.test(val) || 'Invalid format. Use comma-separated numbers',
                  val => form.stats_names.split(',').length === form.stats_values.split(',').length || 'Number of values must match number of stat names'
                ]"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.completion_time"
                label="Completion Time"
                type="datetime-local"
                outlined
                dense
                :rules="[val => !!val || 'Completion time is required']"
              />
            </div>
          </div>

          <q-card-actions allign="right" class="q-mt-md">
            <q-btn flat label="Cancel" color="negative" @click="$emit('update:modelValue', false)" />
            <q-btn flat label="Add Record" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UInt8, Name, UInt64, TimePointSec } from '@wharfkit/antelope'

const emit = defineEmits(['update:modelValue', 'submit'])
const props = defineProps<{
  modelValue: boolean
}>()

interface Form {
  game_id: string
  player: string
  stats_names: string
  stats_values: string
  completion_time: string
}

const form = ref<Form>({
  game_id: '',
  player: '',
  stats_names: '',
  stats_values: '',
  completion_time: ''
})

const handleSubmit = () => {
  const record = {
    game_id: UInt8.from(parseInt(form.value.game_id)),
    player: Name.from(form.value.player),
    stats_names: form.value.stats_names.split(',').map(name => Name.from(name.trim())),
    stats_values: form.value.stats_values.split(',').map(value => UInt64.from(value.trim())),
    completion_time: TimePointSec.from(Math.floor(new Date(form.value.completion_time).getTime() / 1000))
  }

  emit('submit', {
    records: [record]
  })

  // Reset form
  form.value = {
    game_id: '',
    player: '',
    stats_names: '',
    stats_values: '',
    completion_time: ''
  }
  emit('update:modelValue', false) // Close dialog
}
</script>
