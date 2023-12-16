<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section class="text-center">
        <div class="text-h6">
          Create a Multi Signature Proposal
        </div>

        <!-- Text area for displaying and editing action data as JSON -->
        <q-input
          type="textarea"
          v-model="selectedActionDataJson"
          label="Action Data (JSON)"
          class="q-mt-md"
          style="min-height: 300px"
        />

        <!-- Text area for displaying and editing reqSignAccs data -->
        <q-input
          type="textarea"
          v-model="reqSignAccsJson"
          label="Required Signatory Accounts (JSON)"
          class="q-mt-md"
          style="min-height: 300px"
        />

        <q-card-actions align="right">
          <q-btn flat label="Create" color="green" @click="createProposal" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { createAndExecuteMultiSignProposal } from "src/lib/contracts"

const selectedActionDataJson = ref("")
const actions = [
  {
    account: "wt.boid",
    name: "transfer",
    data: { from: "vault.boid", to: "service.boid", quantity: "2000000.0000 BOID", memo: "for user rewards" },
    authorization: [{ actor: "vault.boid", permission: "active" }]
  }
]
const reqSignAccsJson = ref(JSON.stringify([
  { actor: "boid.animus", permission: "active" },
  { actor: "imjohnatboid", permission: "active" },
  { actor: "ticitelos113", permission: "active" }
], null, 2))

const createProposal = async() => {
  console.log("Creating proposal with action:", selectedActionDataJson.value)

  try {
    const parsedActionData = JSON.parse(selectedActionDataJson.value)
    const parsedReqSignAccsData = JSON.parse(reqSignAccsJson.value)

    // Actions array for the proposal
    const actionsForProposal = [parsedActionData]

    console.log("Actions for proposal:", actionsForProposal)

    // Attempt to create the proposal with the actions
    const result = await createAndExecuteMultiSignProposal(parsedReqSignAccsData, actionsForProposal)
    console.log("Proposal created:", result)
  } catch (error) {
    console.error("Error creating proposal:", error)
  }
}

onMounted(() => {
  if (actions.length > 0) {
    selectedActionDataJson.value = JSON.stringify(actions[0], null, 2)
  }
})

</script>

<style scoped>
.q-card {
  width: 600px;
  max-width: 90%;
}
</style>
