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
        flat
        label="SAVE"
        color="green"
        icon="save"
        @click="handleSave"
      />
      <q-btn
        outline
        label="Documentation"
        color="primary"
        icon="help"
        type="a"
        href="https://new.docs.boid.com/boidcore/telos/tables/config.html"
        target="_blank"
      />
      <div class="fit row wrap justify-center">
        <!-- Foldable Section -->
        <q-expansion-item
          label="Account"
          icon="manage_accounts"
        >
          <q-input
            filled
            v-model="config.account.invite_price"
            label="Invite price"
            type="number"
            suffix="BOID"
            :hint="configHints.account.invite_price"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.account.premium_purchase_price"
            label="Premium Purchase Price"
            type="number"
            suffix="BOID"
            :hint="configHints.account.premium_purchase_price"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.account.max_premium_prefix"
            label="Max Premium Prefix"
            type="number"
            :hint="configHints.account.max_premium_prefix"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.account.max_owners"
            label="Max Owners"
            type="number"
            :hint="configHints.account.max_owners"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.account.max_boosters"
            label="Max Boosters"
            type="number"
            hide-bottom-space
            :hint="configHints.account.max_boosters"
          />
          <q-input
            filled
            v-model="suffixWhitelistComputed"
            label="Suffix Whitelist"
            type="text"
            hide-bottom-space
            :hint="configHints.account.suffix_whitelist"
          />
          <q-input
            filled
            v-model="config.account.remove_sponsor_price"
            label="Remove Sponsor Price"
            type="number"
            suffix="BOID"
            hide-bottom-space
            :hint="configHints.account.remove_sponsor_price"
          />
          <q-input
            filled
            v-model="config.account.sponsor_max_invite_codes"
            label="Sponsor Max Invite Codes"
            type="number"
            hide-bottom-space
            :hint="configHints.account.sponsor_max_invite_codes"
          />
          <q-input
            filled
            v-model="config.account.invite_code_expire_rounds"
            label="Invite Code Expire Rounds"
            :hint="configHints.account.invite_code_expire_rounds"
            type="number"
            hide-bottom-space
          />
        </q-expansion-item>
        <q-expansion-item
          label="Boid Power"
          icon="bolt"
        >
          <q-input
            filled
            v-model="config.power.sponsor_tax_mult"
            label="Sponsor Tax Multiplier"
            :hint="configHints.power.sponsor_tax_mult"
            type="number"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.power.powered_stake_mult"
            label="Powered Stake Multiplier"
            :hint="configHints.power.powered_stake_mult"
            type="number"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.power.claim_maximum_elapsed_rounds"
            label="Claim Max Elapsed Rounds"
            :hint="configHints.power.claim_maximum_elapsed_rounds"
            type="number"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.power.soft_max_pwr_add"
            label="Soft Max Power Add"
            :hint="configHints.power.soft_max_pwr_add"
            type="number"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.power.history_slots_length"
            label="History Slots Length"
            :hint="configHints.power.history_slots_length"
            type="number"
            hide-bottom-space
          />
        </q-expansion-item>

        <!-- Mint Settings Section -->

        <q-expansion-item
          label="Mint"
          icon="account_balance"
        >
          <q-input
            filled
            v-model="config.mint.round_powered_stake_mult"
            label="Round Powered Stake Multiplier"
            type="number"
            :hint="configHints.mint.round_powered_stake_mult"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.mint.round_power_mult"
            label="Round Power Multiplier"
            type="number"
            :hint="configHints.mint.round_power_mult"
            hide-bottom-space
          />
        </q-expansion-item>
        <!-- Team Settings Section -->
        <q-expansion-item
          label="Team"
          icon="groups"
        >
          <q-input
            filled
            v-model="config.team.change_min_rounds"
            label="Change Min Rounds"
            type="number"
            :hint="configHints.team.change_min_rounds"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.team.edit_team_min_rounds"
            label="Edit Team Min Rounds"
            type="number"
            :hint="configHints.team.edit_team_min_rounds"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.team.team_edit_max_pct_change"
            label="Team Edit Max Percent Change"
            type="number"
            :hint="configHints.team.team_edit_max_pct_change"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.team.buy_team_cost"
            label="Buy Team Cost"
            type="number"
            :hint="configHints.team.buy_team_cost"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.team.owner_stake_required"
            label="Owner Stake Required"
            type="number"
            :hint="configHints.team.owner_stake_required"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.team.owner_future_stake_lock_rounds_required"
            label="Owner Future Stake Lock Rounds Required"
            type="number"
            :hint="configHints.team.owner_future_stake_lock_rounds_required"
            hide-bottom-space
          />
        </q-expansion-item>

        <!-- Stake Settings Section -->

        <q-expansion-item
          label="Stake"
          icon="lock_clock"
        >
          <q-input
            filled
            v-model="config.stake.unstake_rounds"
            label="Unstake Rounds"
            type="number"
            :hint="configHints.stake.unstake_rounds"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.stake.extra_stake_min_locked_rounds"
            label="Extra Stake Min Locked Rounds"
            type="number"
            :hint="configHints.stake.extra_stake_min_locked_rounds"
            hide-bottom-space
          />
        </q-expansion-item>
        <q-expansion-item label="Auth" icon="key">
          <q-input
            filled
            v-model="keyActionsWhitelistComputed"
            label="Key Actions Whitelist"
            type="text"
            :hint="configHints.auth.key_actions_whitelist"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.auth.key_account_max_stake"
            label="Key Account Max Stake"
            type="number"
            :hint="configHints.auth.key_account_max_stake"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.auth.key_account_max_balance"
            label="Key Account Max Balance"
            type="number"
            :hint="configHints.auth.key_account_max_balance"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.auth.account_max_keys"
            label="Account Max Keys"
            type="number"
            :hint="configHints.auth.account_max_keys"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.auth.worker_max_bill_per_action"
            label="Worker Max Bill Per Action"
            type="number"
            :hint="configHints.auth.worker_max_bill_per_action"
            hide-bottom-space
          />
        </q-expansion-item>

        <!-- Time Settings Section -->
        <q-expansion-item
          label="Time"
          icon="schedule"
        >
          <q-input
            filled
            v-model="config.time.rounds_start_sec_since_epoch"
            label="Rounds Start Seconds Since Epoch"
            type="number"
            :hint="configHints.time.rounds_start"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="config.time.round_length_sec"
            label="Round Length Seconds"
            type="number"
            :hint="configHints.time.round_length_sec"
            hide-bottom-space
          />
        </q-expansion-item>

        <!-- NFT Settings Section -->
        <q-expansion-item
          label="NFT"
          icon="image"
        >
          <q-input
            filled
            v-model="config.nft.boid_id_maximum_nfts"
            label="Boid ID Maximum NFTs"
            type="number"
            :hint="configHints.nft.boid_id_maximum_nfts"
            hide-bottom-space
          />
          <q-input
            filled
            v-model="whitelistCollectionsComputed"
            label="Whitelist Collections"
            type="text"
            :hint="configHints.nft.boid_id_maximum_nfts"
            hide-bottom-space
          />
        </q-expansion-item>
        <q-expansion-item
          label="Other Settings"
          icon="settings"
        >
          <q-toggle
            v-model="config.paused"
            label="Paused"
            :hint="configHints.paused"
          >
            <q-tooltip>
              {{ configHints.paused }}
            </q-tooltip>
          </q-toggle>
          <q-toggle
            v-model="config.allow_deposits"
            label="Allow Deposits"
            :hint="configHints.allow_deposits"
          >
            <q-tooltip>
              {{ configHints.allow_deposits }}
            </q-tooltip>
          </q-toggle>
          <q-toggle
            v-model="config.allow_withdrawals"
            label="Allow Withdrawals"
          >
            <q-tooltip>
              {{ configHints.allow_withdrawals }}
            </q-tooltip>
          </q-toggle>

          <q-input
            filled
            v-model="config.recoveryaccount"
            label="Recovery Account"
            type="text"
            :hint="configHints.recoveryaccount"
            hide-bottom-space
          />
        </q-expansion-item>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { onMounted, reactive, computed } from "vue"
import { useGlobalStore } from "stores/globalStore"
import { Types } from "lib/boid-contract-structure"
import { configHints } from "lib/hints"
import { toObject } from "src/lib/util"

const store = useGlobalStore()
const config = reactive({
  account: {
    invite_price: 0,
    premium_purchase_price: 0,
    max_premium_prefix: 0,
    max_owners: 0,
    max_boosters: 0,
    suffix_whitelist: [""],
    remove_sponsor_price: 0,
    sponsor_max_invite_codes: 0,
    invite_code_expire_rounds: 0
  },
  power: {
    sponsor_tax_mult: 0,
    powered_stake_mult: 0,
    claim_maximum_elapsed_rounds: 0,
    soft_max_pwr_add: 0,
    history_slots_length: 0
  },
  mint: {
    round_powered_stake_mult: 0,
    round_power_mult: 0
  },
  team: {
    change_min_rounds: 0,
    edit_team_min_rounds: 0,
    team_edit_max_pct_change: 0,
    buy_team_cost: 0,
    owner_stake_required: 0,
    owner_future_stake_lock_rounds_required: 0
  },
  stake: {
    unstake_rounds: 0,
    extra_stake_min_locked_rounds: 0
  },
  time: {
    rounds_start_sec_since_epoch: 0,
    round_length_sec: 0
  },
  auth: {
    key_actions_whitelist: [""],
    key_account_max_stake: 0,
    key_account_max_balance: 0,
    account_max_keys: 0,
    worker_max_bill_per_action: 0
  },
  nft: {
    boid_id_maximum_nfts: 0,
    whitelist_collections: [""]
  },
  paused: false,
  allow_deposits: false,
  allow_withdrawals: false,
  recoveryaccount: ""
})


const suffixWhitelistComputed = computed({
  get: () => {
    // Joins the array elements into a comma-separated string for display
    return config.account.suffix_whitelist.join(", ")
  },
  set: (newValue) => {
    // Splits the string by commas and trims whitespace for each element
    config.account.suffix_whitelist = newValue.split(",").map(str => str.trim())
  }
})
const keyActionsWhitelistComputed = computed({
  get: () => {
    return config.auth.key_actions_whitelist.join(", ")
  },
  set: (newValue) => {
    config.auth.key_actions_whitelist = newValue.split(",").map(str => str.trim())
  }
})

const whitelistCollectionsComputed = computed({
  get: () => {
    return config.nft.whitelist_collections.join(", ")
  },
  set: (newValue) => {
    config.nft.whitelist_collections = newValue.split(",").map(str => str.trim())
  }
})

onMounted(async() => {
  const fetchedConfig = await store.fetchConfig()
  if (!fetchedConfig || !fetchedConfig[0]) return
  if (fetchedConfig[0]) Object.assign(config, toObject(fetchedConfig[0]))
})

const handleSave = async() => {
  try {
    let configToSave = Types.configset.from({ config })

    console.log("Saving configuration:", configToSave)
    await store.createConfigSetAction(configToSave)
    console.log("Configuration saved successfully")
  } catch (error) {
    console.error("Error saving configuration:", error)
  }
}


</script>
<style>
.my-card {
  min-width: 400px;
  max-width: 800px;
}
</style>
