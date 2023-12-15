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
            <q-select
              v-model="attr.type"
              :options="atomicAttributeVariants"
              label="Select Attribute Type"
              dense
            /><q-input v-model="attr.key" label="Immutable Key" dense />
            <q-input v-model="attr.value" label="Value" dense />
            <q-btn icon="delete" @click="removeImmutableAttribute(currentActionIndex, attrIndex)" />
          </div>
          <q-btn icon="add" label="Add Immutable Attribute" @click="addImmutableAttribute(currentActionIndex)" />

          <div v-for="(attr, attrIndex) in currentAction.match_mutable_attributes" :key="attrIndex">
            <q-select
              v-model="attr.type"
              :options="atomicAttributeVariants"
              label="Select Attribute Type"
              dense
            />
            <q-input v-model="attr.key" label="Mutable Key" dense />
            <q-input v-model="attr.value" label="Value" dense />
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
            <q-select
              v-model="attr.type"
              :options="atomicAttributeVariants"
              label="Select Attribute Type"
              dense
            />
            <q-input v-model="attr.key" label="Immutable Key" dense />
            <q-input v-model="attr.value" label="Value" dense />
            <q-btn icon="delete" @click="removeImmutableAttributeFromMint(currentNftMintIndex, attrIndex)" />
          </div>
          <q-btn icon="add" label="Add Immutable Attribute" @click="addImmutableAttributeToMint(currentNftMintIndex)" />
          <!-- Loop over mutable attributes of the mint -->
          <div v-for="(attr, attrIndex) in currentNftMint.match_mutable_attributes" :key="attrIndex">
            <q-select
              v-model="attr.type"
              :options="atomicAttributeVariants"
              label="Select Attribute Type"
              dense
            />
            <q-input v-model="attr.key" label="Mutable Key" dense />
            <q-input v-model="attr.value" label="Value" dense />
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
import { computed } from "vue"
import { Types } from "lib/boid-contract-structure"
import { offerStore } from "src/stores/offerStore"
import { useRouter } from "vue-router"
import {
  atomicAttributeVariants, newOffer, currentNftMint,
  currentNftMintIndex, addNftMint, editNftMint,
  saveNftMint, removeNftMint, addImmutableAttributeToMint, removeImmutableAttributeFromMint,
  addMutableAttributeToMint, removeMutableAttributeFromMint, showNftMintDialog,
  currentAction, currentActionIndex, addNftAction, editNftAction, saveNftAction,
  removeNftAction, showNftActionDialog, addImmutableAttribute,
  removeImmutableAttribute, addMutableAttribute, removeMutableAttribute,
  isInvalidInput, isInvalidTeamId, activatePowermodErrorMessage, teamIdErrorMessage, parseAttributeValue
} from "src/lib/offerAdd"

const store = offerStore()
const router = useRouter()

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

const handleAddOffer = async() => {
  try {
    // Transform NFT Actions and Rewards
    const transformedNftActions = newOffer.actions.nft_actions.map(action => {
      return {
        ...action,
        match_immutable_attributes: action.match_immutable_attributes.map(attr => {
          return {
            key: attr.key,
            value: parseAttributeValue(attr.type, attr.value)
          }
        }),
        match_mutable_attributes: action.match_mutable_attributes.map(attr => {
          return {
            key: attr.key,
            value: parseAttributeValue(attr.type, attr.value)
          }
        })
      }
    })
    // Transform NFT Rewards
    const transformedNftRewards = newOffer.rewards.nft_mints.map(mint => {
      return {
        mint_template_id: parseInt(mint.mint_template_id), // Convert to Int32
        mint_schema_name: mint.mint_schema_name, // Name type, no conversion needed
        mint_collection_name: mint.mint_collection_name, // Name type, no conversion needed
        immutable_data: mint.match_immutable_attributes.map(attr => {
          return {
            key: attr.key,
            value: parseAttributeValue(attr.type, attr.value)
          }
        }),
        mutable_data: mint.match_mutable_attributes.map(attr => {
          return {
            key: attr.key,
            value: parseAttributeValue(attr.type, attr.value)
          }
        }),
        quantity: parseInt(mint.quantity) // Convert to UInt8
      }
    })
    console.log("newoffer:", newOffer)
    console.log("actions:", newOffer.actions)
    console.log("rewards:", newOffer.rewards)
    console.log("Transformed actions:", transformedNftActions)
    console.log("Transformed rewards:", transformedNftRewards)
    // Create the final offer object
    let offer = Types.offeradd.from({
      ...newOffer,
      actions: {
        ...newOffer.actions,
        nft_actions: transformedNftActions
      },
      rewards: {
        ...newOffer.rewards,
        nft_mints: transformedNftRewards
      }
    })
    console.log("Formatted offer:", offer)

    // Submit the offer
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
