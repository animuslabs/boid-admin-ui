<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Add/Update Token Config</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="handleSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.token_contract"
                label="Token Contract"
                outlined
                dense
                placeholder="e.g., token.boid"
                :rules="[val => !!val || 'Token contract is required']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.token_symbol"
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
            <div class="col-12">
              <q-toggle
                v-model="form.enabled"
                label="Enable Token"
              />
            </div>
          </div>

          <q-card-actions allign="right" class="q-mt-md">
            <q-btn flat label="Cancel" color="negative" @click="$emit('update:modelValue', false)" />
            <q-btn flat label="Save" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Name, Asset } from '@wharfkit/antelope'

const emit = defineEmits(['update:modelValue', 'submit'])
const props = defineProps<{
  modelValue: boolean
}>()

interface Form {
  token_contract: string
  token_symbol: string
  enabled: boolean
}

const form = ref<Form>({
  token_contract: '',
  token_symbol: '',
  enabled: false
})

const handleSubmit = () => {
  // Parse the token symbol input (format: precision,SYMBOL)
  const [precision, symbol] = form.value.token_symbol.split(',')

  emit('submit', {
    token_contract: Name.from(form.value.token_contract),
    token_symbol: Asset.Symbol.from(`${precision},${symbol}`),
    enabled: form.value.enabled
  })
  // Reset form
  form.value = {
    token_contract: '',
    token_symbol: '',
    enabled: false
  }
  emit('update:modelValue', false) // Close dialog
}
</script>
