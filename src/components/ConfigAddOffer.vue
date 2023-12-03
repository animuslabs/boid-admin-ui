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
            <q-btn icon="add" label="NFT Action" @click="addNftActionDialog" />
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
            <q-btn icon="add" label="NFT Reward" @click="addNftMintDialog" />
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
            <br>
            <q-input v-model="newOffer.total_claimed" label="Total Claimed" class="input-number" dense />
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
          <div>
            <!-- Input fields for NFT Action details -->
            <q-input v-model="newOffer.actions.nft_actions.collection_name" label="Collection Name" dense />
            <q-input v-model="newOffer.actions.nft_actions.schema_name" label="Schema Name" dense />
            <q-input v-model="newOffer.actions.nft_actions.template_id" label="Template ID" dense />
            <!-- Immutable Attributes -->
            <div v-for="(attr, index) in newOffer.actions.nft_actions.match_immutable_attributes" :key="index">
              <q-input v-model="attr.key" label="Key" dense />
              <q-input v-model="attr.value" label="Value" dense />
              <q-btn icon="delete" @click="removeImmutableAttribute(index)" />
            </div>
            <q-btn icon="add" label="Add Immutable Attribute" @click="addImmutableAttribute" />

            <!-- Mutable Attributes -->
            <div v-for="(attr, index) in newOffer.actions.nft_actions.match_mutable_attributes" :key="index">
              <q-input v-model="attr.key" label="Key" dense />
              <q-input v-model="attr.value" label="Value" dense />
              <q-btn icon="delete" @click="removeMutableAttribute(index)" />
            </div>
            <q-btn icon="add" label="Add Mutable Attribute" @click="addMutableAttribute" />
          </div>
          <q-toggle v-model="newOffer.actions.nft_actions.burn" label="Burn" dense />
          <q-input v-model="newOffer.actions.nft_actions.lock_rounds" label="Lock Rounds" dense />
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
          <div>
            <!-- Input fields for NFT Mint details -->
            <!-- Example: -->
            <q-input v-model="nftMint.mint_template_id" label="Mint Template ID" dense />
            <!-- Add more fields as needed -->
          </div>
        </q-card-section>
        <q-card-section>
          <q-btn label="Save" color="green" @click="saveNftMint" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue"
import { Types } from "lib/boid-contract-structure"
import { offerStore } from "src/stores/offerStore"
import { QTable, QTableColumn } from "quasar"
import { Name, Int32 } from "@wharfkit/antelope"
import { useRouter } from "vue-router"

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
    nft_actions: [
      {
        collection_name: "",
        schema_name: "",
        template_id: 0,
        match_immutable_attributes: [] as { key:string, value:any }[],
        match_mutable_attributes: [] as { key:string, value:any }[],
        burn: false, // Assuming a default boolean value
        lock_rounds: 0 // Assuming a default UInt16 value
      }
    ],
    balance_payment: 0 // Default UInt32 value
  },
  rewards: {
    nft_mints: [
      {
        mint_template_id: 0,
        mint_schema_name: "",
        mint_collection_name: "",
        match_immutable_attributes: [] as { key:string, value:any }[],
        match_mutable_attributes: [] as { key:string, value:any }[],
        quantity: 0
      }
    ],
    balance_deposit: 0, // Default UInt32 value
    delegated_stake: 0, // Default UInt16 value
    stake_locked_additional_rounds: 0, // Default UInt16 value
    activate_powermod_ids: [] as number[] // array of numbers | default bytes
  },
  limits: {
    offer_quantity_remaining: 0, // Default UInt32 value
    available_until_round: 0 // Default UInt16 value
  },
  total_claimed: 0 // Default UInt32 value
})

const activatePowermodErrorMessage = "Please enter a comma separated list of numbers."
const teamIdErrorMessage = "Please enter a comma separated list of numbers."
const addDialog = ref(false)
const isInvalidInput = ref(false)
const isInvalidTeamId = ref(false)
const showNftActionDialog = ref(false)
const showNftMintDialog = ref(false)

const navigateBackToOffer = () => {
  router.push({ path: "/config", query: { tab: "offers" } })
    .then(() => {
      // Navigation succeeded
    })
    .catch((error) => {
      console.error("Failed to navigate:", error)
    })
}


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

const addImmutableAttribute = () => {
  newOffer.actions.nft_actions.match_immutable_attributes.push({ key: "", value: "" })
}
const addMutableAttribute = () => {
  newOffer.actions.nft_actions.match_mutable_attributes.push({ key: "", value: "" })
}
const removeImmutableAttribute = (index:number) => {
  newOffer.actions.nft_actions.match_immutable_attributes.splice(index, 1)
}
const removeMutableAttribute = (index:number) => {
  newOffer.actions.nft_actions.match_mutable_attributes.splice(index, 1)
}

const addNftActionDialog = () => {
  // Reset nftAction to default values if needed
  showNftActionDialog.value = true
}

const saveNftAction = () => {
  // Perform validation and save logic
  newOffer.actions.nft_actions.push({ ...newOffer })
  showNftActionDialog.value = false
}

const addNftMintDialog = () => {
  // Reset nftMint to default values if needed
  showNftMintDialog.value = true
}

const saveNftMint = () => {
  // Perform validation and save logic
  newOffer.actions.nft_actions.rewards.nft_mints.push({ ...newOffer })
  showNftMintDialog.value = false
}

const handleAddOffer = async() => {
  try {
    // Convert user inputs to complex types
    const formattedNftActions = newOffer.actions.nft_actions.map(action => {
      return Types.NftAction.from({
        collection_name: Name.from(action.collection_name),
        schema_name: Name.from(action.schema_name),
        template_id: Int32.from(action.template_id),
        match_immutable_attributes: action.match_immutable_attributes,
        match_mutable_attributes: action.match_mutable_attributes,
        burn: action.burn,
        lock_rounds: Int32.from(action.lock_rounds)
      })
    })
    const formattedNftMints = newOffer.rewards.nft_mints.map(mint => {
      return Types.NftMint.from({
        mint_template_id: Int32.from(mint.mint_template_id),
        mint_schema_name: Name.from(mint.mint_schema_name),
        mint_collection_name: Name.from(mint.mint_collection_name),
        immutable_data: mint.immutable_data,
        mutable_data: mint.mutable_data,
        quantity: Int32.from(mint.quantity)
      })
    })

    let offer = Types.Offer.from({
      ...newOffer,
      actions: {
        ...newOffer.actions,
        nft_actions: formattedNftActions
      },
      rewards: {
        ...newOffer.rewards,
        nft_mints: formattedNftMints
      }
    })

    const result = await store.addOfferAction(offer)
    // Rest of the code remains same
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
