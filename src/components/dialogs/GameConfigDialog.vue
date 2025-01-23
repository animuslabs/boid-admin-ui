<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Game Add or Update</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <q-input
            v-model="form.game_id"
            type="number"
            label="Game ID"
            :rules="[val => !!val || 'Game ID is required']"
          />
          <q-input
            v-model="form.display_name"
            label="Display Name"
            :rules="[val => !!val || 'Display name is required']"
          />
          <q-input
            v-model="form.metadata"
            type="textarea"
            label="Metadata"
          />
          <div class="q-gutter-sm">
            <div class="row q-gutter-sm">
              <q-input v-model="newStatName" label="Add Stat Name" class="col" @keyup.enter="addStat" />
              <q-btn icon="add" flat round @click="addStat" :disable="!newStatName" />
            </div>
            <div v-if="form.stats_names.length > 0" class="q-mt-sm">
              <q-chip
                v-for="stat in form.stats_names"
                :key="stat"
                removable
                @remove="form.stats_names = form.stats_names.filter(s => s !== stat)"
              >
                {{ stat }}
              </q-chip>
            </div>
            <div v-if="form.stats_names.length === 0" class="text-caption text-negative">
              At least one stat name is required
            </div>
          </div>
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

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{(e:'update:modelValue', value: boolean): void}>()

const gamingRewardsStore = useGamingRewardsStore()

const form = ref({
  game_id: '',
  display_name: '',
  metadata: '',
  stats_names: [] as string[]
})

const newStatName = ref('')

const addStat = () => {
  if (newStatName.value && !form.value.stats_names.includes(newStatName.value)) {
    form.value.stats_names.push(newStatName.value)
    newStatName.value = ''
  }
}

const handleSubmit = async () => {
  try {
    await gamingRewardsStore.createSetGameAction({
      game_id: Number(form.value.game_id),
      display_name: form.value.display_name,
      metadata: form.value.metadata,
      stats_names: form.value.stats_names
    })
    emit('update:modelValue', false)
    // Reset form
    form.value = {
      game_id: '',
      display_name: '',
      metadata: '',
      stats_names: []
    }
    // Refresh the config after submission
    await gamingRewardsStore.fetchConfig()
  } catch (error) {
    console.error('Error submitting game config:', error)
  }
}
</script>
