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
      <!-- <q-btn
        flat
        label="SAVE"
        color="secondary"
        @click="handleSave"
      /> -->
      <q-btn
        outline
        label="Offers Docs"
        color="primary"
        icon="help"
        type="a"
        href="https://new.docs.boid.com/boidcore/telos/tables/offers.html"
        target="_blank"
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
        >
          <template #header="props">
            <q-tr>
              <q-th v-for="col in props.cols" :key="col.name">
                <span> {{ getShortLabel(col) }}</span>
                <q-tooltip>{{ col.label }}</q-tooltip>
              </q-th>
            </q-tr>
          </template>
          <template #body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ getNestedData(props.row, col.field) }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { onMounted, reactive, computed } from "vue"
import { Types } from "lib/boid-contract-structure"
import { toObject } from "src/lib/util"
import { offerStore } from "src/stores/offerStore"
import { QTable, QTableColumn } from "quasar"

interface ExtendedQTableColumn extends QTableColumn {
  shortLabel?:string;
}

const store = offerStore()

const offers = reactive({
  list: [] as Types.Offer[] | undefined,
  current: {
    offer_id: 0, // Assuming UInt64 can be represented as a number here
    requirements: {
      team_id: 0,
      min_power: 0, // UInt16
      min_balance: 0, // UInt32
      min_stake: 0, // UInt32
      min_cumulative_team_contribution: 0 // UInt32
    },
    actions: {
      delegated_stake: 0, // UInt16
      stake_locked_additional_rounds: 0, // UInt16
      nft_actions: [], // Array of NftAction, provide default values as needed
      balance_payment: 0 // UInt32
    },
    rewards: {
      nft_mints: [], // Array of NftMint, provide default values as needed
      balance_deposit: 0, // UInt32
      delegated_stake: 0, // UInt16
      stake_locked_additional_rounds: 0, // UInt16
      activate_powermod_ids: new Uint8Array(0) // Bytes type, adjust if different
    },
    limits: {
      offer_quantity_remaining: 0, // UInt32
      available_until_round: 0 // UInt16
    },
    total_claimed: 0 // UInt32
  }
})

function getShortLabel(column:ExtendedQTableColumn) {
  return column.shortLabel || column.label
}
function getNestedData(row:Record<string, any>, fieldPath:string):any {
  return fieldPath.split(".").reduce((obj:Record<string, any> | undefined, key:string) => obj && obj[key], row)
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
  { name: "activate_powermod_ids", required: true, label: "Rewards: Activate Powermod IDs", shortLabel: "ActPwrId", align: "left", field: "rewards.activate_powermod_ids", sortable: true },
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
