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
import { computed, ref, reactive, onMounted } from "vue"
import { multiSignStore } from "src/stores/multiSignStore"
import { Types } from "src/lib/eosio-msig-contract-telos-mainnet"
import { Serializer, ABI } from "@wharfkit/antelope"
import { wtboidTransferabi } from "src/lib/contracts"

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

const createProposal = async() => {
  console.log("Creating proposal with action:", selectedActionDataJson.value)

  try {
    const parsedActionData = JSON.parse(selectedActionDataJson.value)
    const parsedReqSignAccsData = JSON.parse(reqSignAccsJson.value)
    console.log("Data before serialization:", parsedActionData.data)

    // Ensure data is not undefined or null
    if (!parsedActionData.data) {
      throw new Error("Data is undefined or null, cannot serialize")
    }
    // Attempt to serialize the data field
    const serializedData = Serializer.encode({ object: parsedActionData.data, abi: wtboidTransferabi, type: "transfer" })
    console.log("Serialized data:", serializedData)

    // Update the actions data with serialized data
    const actionsData = [
      Types.action.from({
        ...parsedActionData,
        data: serializedData
      })
    ]

    console.log("actionsData:", actionsData)

    // Attempt to create the proposal with the serialized data
    const result = await store.createProposalAction(parsedReqSignAccsData, actionsData)
    console.log("Proposal created:", result)
  } catch (error) {
    console.error("Error serializing data or creating proposal:", error)
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
