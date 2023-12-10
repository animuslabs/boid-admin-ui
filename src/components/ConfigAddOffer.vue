<template>
  <div class="add-offer">
    <div class="q-px-md col-6" style="background-color: white;">
      <div class="q-ma-md">
        <q-btn icon="arrow_back_ios" label="BACK TO LIST" color="orange" @click="navigateBackToOffer" class="q-mr-sm" />
        <q-btn icon="add" label="Add Offer" color="green" @click="handleAddOffer" class="items-end" />
      </div>
      <div class="fit row wrap offer-add-dialog">
        <q-card class="q-ma-sm">
          <q-card-section>
            <div>
              Requirements
            </div>
          </q-card-section>
          <q-card-section>
            <q-input v-model="teamIdString" :error="isInvalidTeamId" :error-message="teamIdErrorMessage" label="Team ID" class="input-number" dense />
            <q-input v-model="newOffer.requirements.min_power" label="Minimum Power" class="input-number" dense />
            <q-input v-model="newOffer.requirements.min_balance" label="Minimum Balance" class="input-number" dense />
            <q-input v-model="newOffer.requirements.min_stake" label="Minimum Stake" class="input-number" dense />
            <q-input v-model="newOffer.requirements.min_cumulative_team_contribution" label="Minimum Cumulative Team Contribution" class="input-number" dense />
          </q-card-section>
        </q-card>
        <q-card class="q-ma-sm">
          <q-card-section>
            <div>
              Actions
            </div>
          </q-card-section>
          <q-card-section>
            <q-input v-model="newOffer.actions.delegated_stake" label="Delegated Stake" class="input-number" dense />
            <q-input v-model="newOffer.actions.stake_locked_additional_rounds" label="Stake Locked Additional Rounds" class="input-number" dense />
            <!-- List of NFT Actions -->
            <div class="nft-actions-list">
              <div v-for="(action, index) in newOffer.actions.nft_actions" :key="index" class="nft-action-item">
                <div> Action #{{ index + 1 }}: {{ action.collection_name }}</div>
                <q-btn label="Edit" @click="editNftAction(index)" />
                <q-btn label="Delete" color="red" @click="removeNftAction(index)" />
              </div>
            </div>
            <q-btn icon="add" label="NFT Action" @click="addNftAction" />
            <q-input v-model="newOffer.actions.balance_payment" label="Balance Payment" class="input-number" dense />
          </q-card-section>
        </q-card>
        <q-card class="q-ma-sm">
          <q-card-section>
            <div>
              Rewards
            </div>
          </q-card-section>
          <q-card-section>
            <div class="nft-mint-list">
              <div v-for="(mint, index) in newOffer.rewards.nft_mints" :key="index" class="nft-mint-item">
                <div> Mint #{{ index + 1 }}: {{ mint.mint_template_id }}</div>
                <q-btn label="Edit" @click="editNftMint(index)" />
                <q-btn label="Delete" color="red" @click="removeNftMint(index)" />
              </div>
            </div>
            <q-btn icon="add" label="NFT Reward" @click="addNftMint" />
            <q-input v-model="newOffer.rewards.balance_deposit" label="Balance Deposit" class="input-number" dense />
            <q-input v-model="newOffer.rewards.delegated_stake" label="Delegated Stake" class="input-number" />
            <q-input v-model="newOffer.rewards.stake_locked_additional_rounds" label="Stake Locked Additional Rounds" class="input-number" dense />
            <q-input v-model="activatePowermodIdsString" :error="isInvalidInput" :error-message="activatePowermodErrorMessage" label="Activate Powermod IDs" class="input-number" dense />
          </q-card-section>
        </q-card>
        <q-card class="q-ma-sm">
          <q-card-section>
            <div>
              Limits
            </div>
          </q-card-section>
          <q-card-section>
            <q-input v-model="newOffer.limits.offer_quantity_remaining" label="Offer Quantity Remaining" class="input-number" dense />
            <q-input v-model="newOffer.limits.available_until_round" label="Available Until Round" class="input-number" dense />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="showNftActionDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-space />
          <q-btn icon="close" flat round @click="showNftActionDialog = false" />
        </q-card-section>
        <q-card-section>
          <q-input v-model="currentAction.collection_name" label="Collection Name" dense />
          <q-input v-model="currentAction.schema_name" label="Schema Name" dense />
          <q-input v-model="currentAction.template_id" label="Template ID" dense />
          <q-toggle v-model="currentAction.burn" label="Burn" dense />
          <q-input v-model="currentAction.lock_rounds" label="Lock Rounds" dense />

          <div v-for="(attr, attrIndex) in currentAction.match_immutable_attributes" :key="attrIndex">
            <q-input v-model="attr.key" label="Immutable Key" dense />
            <q-input v-model="attr.value" label="Immutable Value" dense />
            <q-btn icon="delete" @click="removeImmutableAttribute(currentActionIndex, attrIndex)" />
          </div>
          <q-btn icon="add" label="Add Immutable Attribute" @click="addImmutableAttribute(currentActionIndex)" />

          <div v-for="(attr, attrIndex) in currentAction.match_mutable_attributes" :key="attrIndex">
            <q-input v-model="attr.key" label="Mutable Key" dense />
            <q-input v-model="attr.value" label="Mutable Value" dense />
            <q-btn icon="delete" @click="removeMutableAttribute(currentActionIndex, attrIndex)" />
          </div>
          <q-btn icon="add" label="Add Mutable Attribute" @click="addMutableAttribute(currentActionIndex)" />
        </q-card-section>
        <q-card-section>
          <q-btn label="Save" color="green" @click="saveNftAction" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showNftMintDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-space />
          <q-btn icon="close" flat round @click="showNftMintDialog = false" />
        </q-card-section>
        <q-card-section>
          <!-- Input fields for NFT Mint details -->
          <q-input v-model="currentNftMint.mint_template_id" label="Mint Template ID" dense />
          <q-input v-model="currentNftMint.mint_schema_name" label="Mint Schema Name" dense />
          <q-input v-model="currentNftMint.mint_collection_name" label="Mint Collection Name" dense />
          <q-input v-model="currentNftMint.quantity" label="Quantity" dense />
          <!-- Loop over immutable attributes of the mint -->
          <div v-for="(attr, attrIndex) in currentNftMint.match_immutable_attributes" :key="attrIndex">
            <q-input v-model="attr.key" label="Immutable Key" dense />
            <q-input v-model="attr.value" label="Immutable Value" dense />
            <q-btn icon="delete" @click="removeImmutableAttributeFromMint(currentNftMintIndex, attrIndex)" />
          </div>
          <q-btn icon="add" label="Add Immutable Attribute" @click="addImmutableAttributeToMint(currentNftMintIndex)" />
          <!-- Loop over mutable attributes of the mint -->
          <div v-for="(attr, attrIndex) in currentNftMint.match_mutable_attributes" :key="attrIndex">
            <q-input v-model="attr.key" label="Mutable Key" dense />
            <q-input v-model="attr.value" label="Mutable Value" dense />
            <q-btn icon="delete" @click="removeMutableAttributeFromMint(currentNftMintIndex, attrIndex)" />
          </div>
          <q-btn icon="add" label="Add Mutable Attribute" @click="addMutableAttributeToMint(currentNftMintIndex)" />
        </q-card-section>

        <q-card-section>
          <q-btn label="Save" color="green" @click="saveNftMint" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue"
import { Types } from "lib/boid-contract-structure"
import { offerStore } from "src/stores/offerStore"
import { useRouter } from "vue-router"


interface NftAction {
  collection_name:string;
  schema_name:string;
  template_id:number;
  match_immutable_attributes:{ key:string; value:any }[];
  match_mutable_attributes:{ key:string; value:any }[];
  burn:boolean;
  lock_rounds:number;
}

interface NftMint {
  mint_template_id:number;
  mint_schema_name:string;
  mint_collection_name:string;
  match_immutable_attributes:{ key:string, value:any }[];
  match_mutable_attributes:{ key:string, value:any }[];
  quantity:number;
}


const store = offerStore()
const router = useRouter()
const newOffer = reactive({
  requirements: {
    team_id: [] as number[], // array of numbers | default bytes
    min_power: 0, // Default UInt16 value
    min_balance: 0, // Default UInt32 value
    min_stake: 0, // Default UInt32 value
    min_cumulative_team_contribution: 0 // Default UInt32 value
  },
  actions: {
    delegated_stake: 0, // Default UInt16 value
    stake_locked_additional_rounds: 0, // Default UInt16 value
    nft_actions: [] as NftAction[],
    balance_payment: 0 // Default UInt32 value
  },
  rewards: {
    nft_mints: [] as NftMint[],
    balance_deposit: 0, // Default UInt32 value
    delegated_stake: 0, // Default UInt16 value
    stake_locked_additional_rounds: 0, // Default UInt16 value
    activate_powermod_ids: [] as number[] // array of numbers | default bytes
  },
  limits: {
    offer_quantity_remaining: 0, // Default UInt32 value
    available_until_round: 0 // Default UInt16 value
  }
})
const navigateBackToOffer = () => {
  router.push({ path: "/config", query: { tab: "offers" } })
    .then(() => {
      // Navigation succeeded
    })
    .catch((error) => {
      console.error("Failed to navigate:", error)
    })
}
const activatePowermodErrorMessage = "Please enter a comma separated list of numbers."
const teamIdErrorMessage = "Please enter a comma separated list of numbers."
const isInvalidInput = ref(false)
const isInvalidTeamId = ref(false)
const showNftActionDialog = ref(false)
const showNftMintDialog = ref(false)

// Define reactive properties for current action
const currentActionIndex = ref(-1)
const currentAction = ref({
  collection_name: "",
  schema_name: "",
  template_id: 0,
  match_immutable_attributes: [] as { key:string, value:any }[],
  match_mutable_attributes: [] as { key:string, value:any }[],
  burn: false,
  lock_rounds: 0
})


const activatePowermodIdsString = computed({
  get: () => newOffer.rewards.activate_powermod_ids.join(", "),
  set: (value) => {
    const numbers = value.split(",")
      .map((num) => num.trim())
      .filter((num) => num !== "" && !isNaN(Number(num)))

    isInvalidInput.value = numbers.length !== value.split(",").length

    if (!isInvalidInput.value) {
      newOffer.rewards.activate_powermod_ids = numbers.map(Number)
    }
  }
})
const teamIdString = computed({
  get: () => newOffer.requirements.team_id.join(", "),
  set: (value) => {
    const numbers = value.split(",")
      .map((num) => num.trim())
      .filter((num) => num !== "" && !isNaN(Number(num)))

    isInvalidTeamId.value = numbers.length !== value.split(",").length

    if (!isInvalidTeamId.value) {
      newOffer.requirements.team_id = numbers.map(Number)
    }
  }
})


// NFT Action Dialog related functions
const addImmutableAttribute = (actionIndex:number) => {
  if (actionIndex >= 0 && actionIndex < newOffer.actions.nft_actions.length) {
    const action = newOffer.actions.nft_actions[actionIndex]
    if (action) {
      action.match_immutable_attributes.push({ key: "", value: "" })
    }
  }
}
const removeImmutableAttribute = (actionIndex:number, attrIndex:number) => {
  const action = newOffer.actions.nft_actions[actionIndex]
  if (action && attrIndex >= 0 && attrIndex < action.match_immutable_attributes.length) {
    action.match_immutable_attributes.splice(attrIndex, 1)
  }
}
const addMutableAttribute = (actionIndex:number) => {
  if (actionIndex >= 0 && actionIndex < newOffer.actions.nft_actions.length) {
    const action = newOffer.actions.nft_actions[actionIndex]
    if (action) {
      action.match_mutable_attributes.push({ key: "", value: "" })
    }
  }
}
const removeMutableAttribute = (actionIndex:number, attrIndex:number) => {
  const action = newOffer.actions.nft_actions[actionIndex]
  if (action && attrIndex >= 0 && attrIndex < action.match_mutable_attributes.length) {
    action.match_mutable_attributes.splice(attrIndex, 1)
  }
}

const resetCurrentAction = () => {
  currentAction.value = {
    collection_name: "",
    schema_name: "",
    template_id: 0,
    match_immutable_attributes: [],
    match_mutable_attributes: [],
    burn: false,
    lock_rounds: 0
  }
  currentActionIndex.value = -1
}

const editNftAction = (index:number) => {
  if (index >= 0 && index < newOffer.actions.nft_actions.length) {
    const actionToEdit = newOffer.actions.nft_actions[index]
    if (actionToEdit) {
      currentActionIndex.value = index
      currentAction.value = {
        collection_name: actionToEdit.collection_name ?? "",
        schema_name: actionToEdit.schema_name ?? "",
        template_id: actionToEdit.template_id ?? 0,
        match_immutable_attributes: actionToEdit.match_immutable_attributes ?? [],
        match_mutable_attributes: actionToEdit.match_mutable_attributes ?? [],
        burn: actionToEdit.burn ?? false,
        lock_rounds: actionToEdit.lock_rounds ?? 0
      }
      showNftActionDialog.value = true
    } else {
      console.error("No action found at the specified index")
    }
  } else {
    console.error("Invalid action index for editing")
  }
}
const addNftAction = () => {
  const newAction = {
    collection_name: "",
    schema_name: "",
    template_id: 0,
    match_immutable_attributes: [],
    match_mutable_attributes: [],
    burn: false,
    lock_rounds: 0
  }

  newOffer.actions.nft_actions.push(newAction)
  currentActionIndex.value = newOffer.actions.nft_actions.length - 1
  currentAction.value = { ...newAction }
  showNftActionDialog.value = true
}
const removeNftAction = (actionIndex:number) => {
  if (actionIndex >= 0 && actionIndex < newOffer.actions.nft_actions.length) {
    newOffer.actions.nft_actions.splice(actionIndex, 1)
  }
}
const saveNftAction = () => {
  if (currentActionIndex.value === -1) {
    // Add new action
    newOffer.actions.nft_actions.push({ ...currentAction.value })
  } else if (currentActionIndex.value >= 0 && currentActionIndex.value < newOffer.actions.nft_actions.length) {
    // Update existing action
    newOffer.actions.nft_actions[currentActionIndex.value] = { ...currentAction.value }
  } else {
    console.error("Invalid action index")
    return
  }

  showNftActionDialog.value = false
  resetCurrentAction() // Reset current action after saving
}

const currentNftMintIndex = ref(-1)
const currentNftMint = ref({
  mint_template_id: 0,
  mint_schema_name: "",
  mint_collection_name: "",
  match_immutable_attributes: [] as { key:string, value:any }[],
  match_mutable_attributes: [] as { key:string, value:any }[],
  quantity: 0
})
const addNftMint = () => {
  const newMint = {
    mint_template_id: 0,
    mint_schema_name: "",
    mint_collection_name: "",
    match_immutable_attributes: [],
    match_mutable_attributes: [],
    quantity: 0
  }

  newOffer.rewards.nft_mints.push(newMint)
  currentNftMintIndex.value = newOffer.rewards.nft_mints.length - 1
  currentNftMint.value = { ...newMint }
  showNftMintDialog.value = true
}
const editNftMint = (index:number) => {
  if (index >= 0 && index < newOffer.rewards.nft_mints.length) {
    const mintToEdit = newOffer.rewards.nft_mints[index]
    if (mintToEdit) {
      currentNftMintIndex.value = index
      currentNftMint.value = { ...mintToEdit }
      showNftMintDialog.value = true
    } else {
      console.error("No mint found at the specified index")
    }
  } else {
    console.error("Invalid mint index for editing")
  }
}
const saveNftMint = () => {
  if (currentNftMintIndex.value === -1) {
    newOffer.rewards.nft_mints.push({ ...currentNftMint.value })
  } else if (currentNftMintIndex.value >= 0 && currentNftMintIndex.value < newOffer.rewards.nft_mints.length) {
    newOffer.rewards.nft_mints[currentNftMintIndex.value] = { ...currentNftMint.value }
  } else {
    console.error("Invalid mint index")
    return
  }
  showNftMintDialog.value = false
  resetNftMint() // Reset current NFT mint after saving
}
const resetNftMint = () => {
  currentNftMint.value = {
    mint_template_id: 0,
    mint_schema_name: "",
    mint_collection_name: "",
    match_immutable_attributes: [],
    match_mutable_attributes: [],
    quantity: 0
  }
  currentNftMintIndex.value = -1
}
const removeNftMint = (index:number) => {
  if (index >= 0 && index < newOffer.rewards.nft_mints.length) {
    newOffer.rewards.nft_mints.splice(index, 1)
  } else {
    console.error("Invalid mint index for removal")
  }
}
const addImmutableAttributeToMint = (mintIndex:number) => {
  const mint = newOffer.rewards.nft_mints[mintIndex]
  if (mint) {
    mint.match_immutable_attributes.push({ key: "", value: "" })
  }
}
const removeImmutableAttributeFromMint = (mintIndex:number, attrIndex:number) => {
  const mint = newOffer.rewards.nft_mints[mintIndex]
  if (mint && attrIndex >= 0 && attrIndex < mint.match_immutable_attributes.length) {
    mint.match_immutable_attributes.splice(attrIndex, 1)
  }
}
const addMutableAttributeToMint = (mintIndex:number) => {
  const mint = newOffer.rewards.nft_mints[mintIndex]
  if (mint) {
    mint.match_mutable_attributes.push({ key: "", value: "" })
  }
}
const removeMutableAttributeFromMint = (mintIndex:number, attrIndex:number) => {
  const mint = newOffer.rewards.nft_mints[mintIndex]
  if (mint && attrIndex >= 0 && attrIndex < mint.match_mutable_attributes.length) {
    mint.match_mutable_attributes.splice(attrIndex, 1)
  }
}

// testing only
// const downloadJsonAsFile = (data:any, filename:string) => {
//   const jsonString = JSON.stringify(data, null, 2) // Beautify the JSON
//   const blob = new Blob([jsonString], { type: "text/json" })
//   const url = URL.createObjectURL(blob)

//   const link = document.createElement("a")
//   link.href = url
//   link.download = `${filename}.json`
//   document.body.appendChild(link) // Required for Firefox
//   link.click()
//   document.body.removeChild(link)

//   URL.revokeObjectURL(url)
// }

const handleAddOffer = async() => {
  try {
    console.log("New offer:", newOffer)
    let offer = Types.offeradd.from(newOffer)
    console.log("Formatted offer:", offer)

    // Downloading newOffer and offer as JSON files
    // downloadJsonAsFile(newOffer, "newOffer")
    // downloadJsonAsFile(offer, "formattedOffer")

    const result = await store.addOfferAction(offer)
    return result
  } catch (error) {
    console.error("Error adding offer:", error)
  }
}



</script>

<style scoped>
.add-offer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}
</style>
