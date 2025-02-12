<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">
          Add Rewards
        </div>
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
                v-model="form.cycle_number"
                label="Cycle Number"
                type="number"
                outlined
                dense
                :rules="[val => !!val || 'Cycle Number is required']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.stat_name"
                label="Stat Name"
                outlined
                dense
                :rules="[val => !!val || 'Stat Name is required']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.total_reward"
                label="Total Reward"
                outlined
                dense
                :rules="[val => !!val || 'Total Reward is required']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.token_contract"
                label="Token Contract"
                outlined
                dense
                :rules="[val => !!val || 'Token Contract is required']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.reward_percentages"
                label="Reward Percentages"
                outlined
                dense
                hint="Comma-separated list of percentages"
                :rules="[
                  val => !!val || 'Reward Percentages are required',
                  val => !val || /^\d+(?:,\d+)*$/.test(val) || 'Please enter valid numbers separated by commas'
                ]"
              />
            </div>
          </div>

          <q-card-actions allign="right" class="q-mt-md">
            <q-btn flat label="Cancel" color="negative" @click="$emit('update:modelValue', false)" />
            <q-btn flat label="Add Rewards" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { DistributeForm } from "src/types/gamingRecordsComponentTypes"
import { Name, Asset, Bytes } from "@wharfkit/antelope"

const emit = defineEmits(["update:modelValue", "submit"])
const props = defineProps<{
  modelValue:boolean
}>()

const form = ref<DistributeForm>({
  game_id: "1",
  cycle_number: "0",
  stat_name: "score",
  total_reward: "10000.0000 BOID",
  token_contract: "token.boid",
  reward_percentages: "40,30,15,10,5"
})

const handleSubmit = () => {
  // Convert form values to appropriate types
  const formData = {
    game_id: Number(form.value.game_id),
    cycle_number: Number(form.value.cycle_number),
    stat_name: Name.from(form.value.stat_name),
    total_reward: Asset.from(form.value.total_reward),
    token_contract: Name.from(form.value.token_contract),
    reward_percentages: form.value.reward_percentages
  }
  emit("submit", formData)
  // Reset form
  form.value = {
    game_id: "1",
    cycle_number: "0",
    stat_name: "score",
    total_reward: "10000.0000 BOID",
    token_contract: "token.boid",
    reward_percentages: "40,30,15,10,5"
  }
  emit("update:modelValue", false) // Close dialog
}
</script>
