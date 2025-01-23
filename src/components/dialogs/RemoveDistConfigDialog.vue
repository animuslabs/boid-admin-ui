<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Remove Distribution Config</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="handleSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="gameId"
                label="Game ID"
                type="number"
                outlined
                dense
                :rules="[val => !!val || 'Game ID is required']"
              />
            </div>
          </div>

          <q-card-actions align="right" class="q-mt-md">
            <q-btn flat label="Cancel" color="negative" @click="$emit('update:modelValue', false)" />
            <q-btn flat label="Remove Config" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UInt8 } from '@wharfkit/antelope'

const emit = defineEmits(['update:modelValue', 'submit'])
const props = defineProps<{
  modelValue: boolean
}>()

const gameId = ref('')

const handleSubmit = () => {
  emit('submit', {
    game_id: UInt8.from(parseInt(gameId.value))
  })
  gameId.value = '' // Reset form
  emit('update:modelValue', false) // Close dialog
}
</script>
