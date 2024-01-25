<style lang="sass">
.q-expansion-item
  padding: 8px
  margin:4px
  width:300px
  background: $grey-1
.q-input
  padding-bottom:10px
</style>

<template>
  <q-card class="my-card">
    <q-card-section>
      <q-btn
        outline
        label="Offers Docs"
        color="primary"
        icon="help"
        type="a"
        href="https://docs.boid.com/boidcore/telos/actions/offers.html"
        target="_blank"
      />
      <q-btn flat label="ADD" color="green" icon="add" @click="navigateToAddOffer" />
      <q-btn
        flat
        label="Clear ALL"
        color="red"
        @click="cleanAllaction"
      />
      <div class="fit row wrap justify-center offers-container">
        <!-- Offers Table -->
        <q-table
          title="Offers"
          :rows="offers.list"
          :columns="offerColData"
          row-key="offer_id"
          dense
          flat
          virtual-scroll
          selection="single"
          :pagination="pagination"
        >
          <template #header="props">
            <q-tr>
              <q-th
                v-for="col in props.cols"
                :key="col.name"
              >
                <span> {{ getShortLabel(col) }}</span>
                <q-tooltip>{{ col.label }}</q-tooltip>
              </q-th>
            </q-tr>
          </template>
          <template #body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props" @click="handleRowClick(props.row)">
                {{ getNestedData(props.row, col.field) }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-card-section>
  </q-card>
  <q-dialog v-model="dialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-space />
        <q-btn icon="close" flat round @click="dialog = false" />
      </q-card-section>
      <q-card-section>
        <div v-if="selectedOffer">
          <div><strong>Offer ID:</strong> {{ selectedOffer.offer_id }}</div>
          <div><strong>Requirements</strong></div>
          <div>Team ID: {{ selectedOffer.requirements.team_id.array.toString() }}</div>
          <div>Minimum Power: {{ selectedOffer.requirements.min_power }}</div>
          <div>Minimum Balance: {{ selectedOffer.requirements.min_balance }}</div>
          <div>Minimum Stake: {{ selectedOffer.requirements.min_stake }}</div>
          <div>Minimum Cumulative Team Contribution: {{ selectedOffer.requirements.min_cumulative_team_contribution }}</div>
          <div><strong>Actions</strong></div>
          <div>Delegated Stake: {{ selectedOffer.actions.delegated_stake }}</div>
          <div>Stake Locked Additional Rounds: {{ selectedOffer.actions.stake_locked_additional_rounds }}</div>
          <div>NFT Actions: {{ selectedOffer.actions.nft_actions }}</div>
          <div>Balance Payment: {{ selectedOffer.actions.balance_payment }}</div>
          <div><strong>Rewards</strong></div>
          <div>NFT Mints: {{ selectedOffer.rewards.nft_mints }}</div>
          <div>Balance Deposit: {{ selectedOffer.rewards.balance_deposit }}</div>
          <div>Delegated Stake: {{ selectedOffer.rewards.delegated_stake }}</div>
          <div>Stake Locked Additional Rounds: {{ selectedOffer.rewards.stake_locked_additional_rounds }}</div>
          <div>Activate Boosters IDs: {{ selectedOffer.rewards.activate_booster_ids.array.toString() }}</div>
          <div><strong>Limits</strong></div>
          <div>Offer Quantity Remaining: {{ selectedOffer.limits.offer_quantity_remaining }}</div>
          <div>Available Until Round: {{ selectedOffer.limits.available_until_round }}</div>
          <div><strong>Total Claimed</strong></div>
          <div>{{ selectedOffer.total_claimed }}</div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-btn label="Remove" color="red" @click="handleRemoveOffer" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { Types } from "lib/boid-contract-structure"
import { offerStore } from "src/stores/offerStore"
import { QTable, QTableColumn } from "quasar"
import { arrayToString } from "src/lib/reuseFunctions"
import { useRouter } from "vue-router"

const router = useRouter()

const navigateToAddOffer = () => {
  router.push("config/add-offer")
    .then(() => {
      // Navigation succeeded
    })
    .catch((error) => {
      console.error("Failed to navigate:", error)
    })
}


interface ExtendedQTableColumn extends QTableColumn {
  shortLabel?:string;
}

const store = offerStore()
const dialog = ref(false)
const selectedOffer = ref(null as Types.Offer | null)
const pagination = ref({
  sortBy: "id",
  descending: false, // Set to true if you want descending order by default
  page: 1,
  rowsPerPage: 10
})
const offers = reactive({
  list: [] as Types.Offer[] | undefined
})

const handleRowClick = (offer:Types.Offer) => {
  selectedOffer.value = offer
  dialog.value = true
}
const handleRemoveOffer = async() => {
  if (selectedOffer.value && selectedOffer.value.offer_id) {
    try {
      const offerRm = { offer_id: selectedOffer.value.offer_id }
      const result = await store.deleteOfferAction(offerRm)
      if (result) {
        console.log("Offer removed successfully:", result)
        // Refresh the offers list to reflect the removal
        offers.list = await store.fetchOffersTableData()
        dialog.value = false // Close the dialog after successful removal
      } else {
        console.log("Failed to remove the offer.")
      }
    } catch (error) {
      console.error("Error removing offer:", error)
    }
  } else {
    console.error("No offer selected or offer ID is missing.")
  }
}



const cleanAllaction = async() => {
  try {
    const result = await store.cleanOfferAction()
    if (result) {
      console.log("All offers removed successfully:", result)
      // Refresh the offers list to reflect the removal
      offers.list = await store.fetchOffersTableData()
    } else {
      console.log("Failed to remove all offers.")
    }
  } catch (error) {
    console.error("Error removing all offers:", error)
  }
}
function getShortLabel(column:ExtendedQTableColumn) {
  return column.shortLabel || column.label
}
function getNestedData(row:Record<string, any>, fieldPath:string):any {
  const value = fieldPath.split(".").reduce((obj:Record<string, any> | undefined, key:string) => obj && obj[key], row)

  // Special handling for NFT actions and mints
  if (fieldPath === "actions.nft_actions" || fieldPath === "rewards.nft_mints") {
    return value && value.length > 0 ? "YES" : "NO"
  }
  // Check if value is not undefined before proceeding
  if (value && (fieldPath === "requirements.team_id" || fieldPath === "rewards.activate_booster_ids")) {
    // Access the Uint8Array inside the Proxy object, if it exists
    const arrayValue = value.array

    // Check if the arrayValue is a Uint8Array and convert it to a string
    if (arrayValue instanceof Uint8Array) {
      return arrayToString(arrayValue)
    }
  }

  return value
}

const offerColData:ExtendedQTableColumn[] = [
  { name: "offer_id", required: true, label: "Offer ID", shortLabel: "Id", align: "left", field: "offer_id", sortable: true },
  // requirements
  { name: "team_id", required: true, label: "Requirement: Team ID", shortLabel: "TId", align: "left", field: "requirements.team_id", sortable: true },
  { name: "min_power", required: true, label: "Requirement: Minimum Power", shortLabel: "MinPw", align: "left", field: "requirements.min_power", sortable: true },
  { name: "min_balance", required: true, label: "Requirement: Minimum Balance", shortLabel: "MinBal", align: "left", field: "requirements.min_balance", sortable: true },
  { name: "min_stake", required: true, label: "Requirement: Minimum Stake", shortLabel: "MinSt", align: "left", field: "requirements.min_stake", sortable: true },
  { name: "min_cumulative_team_contribution", required: true, label: "Requirement: Min Cumulative Team Contribution", shortLabel: "MinCulTCon", align: "left", field: "requirements.min_cumulative_team_contribution", sortable: true },
  // actions
  { name: "delegated_stake", required: true, label: "Action: Delegated Stake", shortLabel: "DelSt", align: "left", field: "actions.delegated_stake", sortable: true },
  { name: "stake_locked_additional_rounds", required: true, label: "Act Stake Locked Additional Rounds", shortLabel: "StLcAR", align: "left", field: "actions.stake_locked_additional_rounds", sortable: true },
  { name: "nft_actions", required: true, label: "Action: NFT Actions", shortLabel: "NFTact", align: "left", field: "actions.nft_actions", sortable: true },
  { name: "balance_payment", required: true, label: "Action: Balance Payment", shortLabel: "BalPay", align: "left", field: "actions.balance_payment", sortable: true },
  // rewards
  { name: "nft_mints", required: true, label: "Rewards: NFT Mints", shortLabel: "NFTMint", align: "left", field: "rewards.nft_mints", sortable: true },
  { name: "balance_deposit", required: true, label: "Rewards: Balance Deposit", shortLabel: "BalDep", align: "left", field: "rewards.balance_deposit", sortable: true },
  { name: "delegated_stake", required: true, label: "Rewards: Delegated Stake", shortLabel: "DelSt", align: "left", field: "rewards.delegated_stake", sortable: true },
  { name: "stake_locked_additional_rounds", required: true, label: "Rewards: Stake Locked Additional Rounds", shortLabel: "StLAddR", align: "left", field: "rewards.stake_locked_additional_rounds", sortable: true },
  { name: "activate_booster_ids", required: true, label: "Rewards: Activate Boosters IDs", shortLabel: "ActPwrId", align: "left", field: "rewards.activate_booster_ids", sortable: true },
  // limits
  { name: "offer_quantity_remaining", required: true, label: "Limits: Offer Quantity Remaining", shortLabel: "QnRem", align: "left", field: "limits.offer_quantity_remaining", sortable: true },
  { name: "available_until_round", required: true, label: "Limits: Available Until Round", shortLabel: "AvUnR", align: "left", field: "limits.available_until_round", sortable: true },
  // Total Claimed
  { name: "total_claimed", required: true, label: "Total Claimed", shortLabel: "TotCl", align: "left", field: "total_claimed", sortable: true }
]

onMounted(async() => {
  try {
    const fetchedOffers = await store.fetchOffersTableData()
    offers.list = fetchedOffers // Replace current offers list with fetched ones
    console.log("Fetched offers:", fetchedOffers)
  } catch (error) {
    console.error("Error fetching offers:", error)
  }
})

</script>
<style>
.my-card {
  min-width: 400px;
  max-width: 1200px;
}
.offers-container{
  max-height: 600px;
  overflow-y: auto;
}

</style>
