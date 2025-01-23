<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Remove Token Configuration</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="handleSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="tokenSymbol"
                label="Token Symbol"
                outlined
                dense
                placeholder="e.g., 4,BOID"
                hint="Format: precision,SYMBOL (e.g., 4,BOID)"
                :rules="[
                  val => !!val || 'Token symbol is required',
                  val => /^\d+,[A-Z]+$/.test(val) || 'Invalid format. Use: precision,SYMBOL'
                ]"
              />
            </div>
          </div>

          <q-card-actions allign="right" class="q-mt-md">
            <q-btn flat label="Cancel" color="negative" @click="$emit('update:modelValue', false)" />
            <q-btn flat label="Remove Token" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Asset } from '@wharfkit/antelope'

const emit = defineEmits(['update:modelValue', 'submit'])
const props = defineProps<{
  modelValue: boolean
}>()

const tokenSymbol = ref('')

const handleSubmit = () => {
  // Parse the token symbol input (format: precision,SYMBOL)
  const [precision, symbol] = tokenSymbol.value.split(',')

  emit('submit', {
    token_symbol: Asset.Symbol.from(`${precision},${symbol}`)
  })
  tokenSymbol.value = '' // Reset form
  emit('update:modelValue', false) // Close dialog
}
</script>
