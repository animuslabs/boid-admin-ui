<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Clear Game Records</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle2 q-mb-sm">Enter record IDs to clear (comma-separated):</div>
        <q-input
          v-model="recordIds"
          type="text"
          outlined
          dense
          placeholder="e.g., 1,2,3"
          hint="Enter the IDs of the records you want to clear, separated by commas"
          :rules="[
            val => !val || /^\d+(?:,\d+)*$/.test(val) || 'Please enter valid numbers separated by commas'
          ]"
        />
      </q-card-section>

      <q-card-actions allign="right">
        <q-btn flat label="Cancel" color="negative" @click="$emit('update:modelValue', false)" />
        <q-btn flat label="Clear" color="primary" @click="handleSubmit" :disable="!recordIds" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['update:modelValue', 'submit'])
const props = defineProps<{
  modelValue: boolean
}>()

const recordIds = ref('')

const handleSubmit = () => {
  emit('submit', recordIds.value)
  recordIds.value = '' // Reset the input after submission
  emit('update:modelValue', false) // Close the dialog
}
</script>
