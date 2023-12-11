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
import { computed, ref, reactive, watch, onMounted } from "vue"
import { multiSignStore } from "src/stores/multiSignStore"
import { Types } from "src/lib/eosio-msig-contract-structure"

const store = multiSignStore()
const selectedActionDataJson = ref("")
const reqSignAccs = reactive(
  [
    {
      actor: "boid.animus",
      permission: "active"
    },
    {
      actor: "imjohnatboid",
      permission: "active"
    },
    {
      actor: "ticitelos113",
      permission: "active"
    }
  ]
)
const actions = reactive(
  [
    {
      account: "wt.boid",
      name: "transfer",
      data: { from: "vault.boid", to: "service.boid", quantity: "2000000.0000 BOID", memo: "for user rewards" },
      authorization: [{ actor: "vault.boid", permission: "active" }]
    }
  ]
)

// Computed property for JSON representation of reqSignAccs
const reqSignAccsJson = computed({
  get: () => JSON.stringify(reqSignAccs, null, 2),
  set: (newValue) => {
    try {
      Object.assign(reqSignAccs, JSON.parse(newValue))
    } catch (e) {
      console.error("Invalid JSON format")
    }
  }
})
// Function to initialize form fields
const initializeFormFields = () => {
  if (actions.length > 0) {
    selectedActionDataJson.value = JSON.stringify(actions[0], null, 2)
  }
}

// Handle create proposal
// Handle create proposal
const createProposal = async() => {
  console.log("Creating proposal with action:", selectedActionDataJson.value)

  // Parse JSON data back to object format
  const parsedActionData = JSON.parse(selectedActionDataJson.value)
  const parsedReqSignAccsData = JSON.parse(reqSignAccsJson.value)

  // Format data according to your Types structure
  const reqSignAccsData = parsedReqSignAccsData.map((acc:Types.permission_level) => Types.permission_level.from(acc))
  console.log("reqSignAccsData:", reqSignAccsData)

  // You might need to adjust this if your actions structure is different
  const actionsData = [Types.action.from(parsedActionData)]
  console.log("actionsData:", actionsData)

  try {
    const result = await store.createProposalAction(reqSignAccsData, actionsData)
    console.log("Proposal created:", result)
  } catch (error) {
    console.error("Error creating proposal:", error)
  }
}


// Populate the action data when the component is mounted
onMounted(initializeFormFields)

</script>

<style scoped>
.q-card {
  width: 600px;
  max-width: 90%;
}
</style>
