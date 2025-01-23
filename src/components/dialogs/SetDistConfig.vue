<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Set Distribution Configuration</div>
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
                v-model="form.destination_contract"
                label="Destination Contract"
                outlined
                dense
                placeholder="e.g., token.boid"
                :rules="[val => !!val || 'Destination contract is required']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.memo_template"
                label="Memo Template"
                outlined
                dense
                type="textarea"
                :rules="[val => !!val || 'Memo template is required']"
              />
            </div>
            <div class="col-12">
              <q-toggle
                v-model="form.use_direct_transfer"
                label="Use Direct Transfer"
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
import { UInt8, Name } from '@wharfkit/antelope'

const emit = defineEmits(['update:modelValue', 'submit'])
const props = defineProps<{
  modelValue: boolean
}>()

interface Form {
  game_id: string
  destination_contract: string
  memo_template: string
  use_direct_transfer: boolean
}

const form = ref<Form>({
  game_id: '',
  destination_contract: '',
  memo_template: '',
  use_direct_transfer: false
})

const handleSubmit = () => {
  emit('submit', {
    game_id: UInt8.from(parseInt(form.value.game_id)),
    destination_contract: Name.from(form.value.destination_contract),
    memo_template: form.value.memo_template,
    use_direct_transfer: form.value.use_direct_transfer
  })
  // Reset form
  form.value = {
    game_id: '',
    destination_contract: '',
    memo_template: '',
    use_direct_transfer: false
  }
  emit('update:modelValue', false) // Close dialog
}
</script>
