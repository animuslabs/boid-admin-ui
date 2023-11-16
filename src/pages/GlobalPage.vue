<template>
  <q-page class="flex flex-center">
    <q-card class="my-card">
      <q-card-section>
        <q-btn
          flat
          label="SAVE"
          color="secondary"
        />
        <div class="fit row wrap justify-center">
          <!-- Foldable Section -->
          <div
            cols="12"
            sm="6"
          >
            <q-expansion-item
              label="Account Settings"
              icon="settings"
              dense
              default-opened
            >
              <q-input
                filled
                v-model="invitePowerPrefixComputed"
                label="Invite Power Prefix"
                type="number"
              />
              <q-input
                filled
                v-model="premiumPurchasePriceComputed"
                label="Premium Purchase Price"
                type="number"
              />
              <q-input
                filled
                v-model="maxPremiumPrefixComputed"
                label="Max Premium Prefix"
                type="number"
              />
              <q-input
                filled
                v-model="maxOwnersComputed"
                label="Max Owners"
                type="number"
              />
              <q-input
                filled
                v-model="maxBoostersComputed"
                label="Max Boosters"
                type="number"
              />
              <q-input
                filled
                v-model="suffixWhitelistComputed"
                label="Suffix Whitelist"
                type="text"
              />
              <q-input
                filled
                v-model="removeSponsorPriceComputed"
                label="Remove Sponsor Price"
                type="number"
              />
              <q-input
                filled
                v-model="sponsorMaxInviteCodesComputed"
                label="Sponsor Max Invite Codes"
                type="number"
              />
              <q-input
                filled
                v-model="inviteCodeExpireRoundsComputed"
                label="Invite Code Expire Rounds"
                type="number"
              />
            </q-expansion-item>
          </div>
          <div
            cols="12"
            sm="6"
          >
            <q-expansion-item
              label="Power Settings"
              icon="settings"
              dense
              default-opened
            >
              <q-input
                filled
                v-model="sponsorTaxMultComputed"
                label="Sponsor Tax Multiplier"
                type="number"
              />
              <q-input
                filled
                v-model="poweredStakeMultComputed"
                label="Powered Stake Multiplier"
                type="number"
              />
              <q-input
                filled
                v-model="claimMaxElapsedRoundsComputed"
                label="Claim Max Elapsed Rounds"
                type="number"
              />
              <q-input
                filled
                v-model="softMaxPwrAdd"
                label="Soft Max Power Add"
                type="number"
              />
              <q-input
                filled
                v-model="historySlotsLengthComputed"
                label="History Slots Length"
                type="number"
              />
            </q-expansion-item>

            <!-- Mint Settings Section -->

            <q-expansion-item
              label="Mint Settings"
              icon="settings"
              dense
              default-opened
            >
              <q-input
                filled
                v-model="roundPoweredStakeMultComputed"
                label="Round Powered Stake Multiplier"
                type="number"
              />
              <q-input
                filled
                v-model="roundPowerMultComputed"
                label="Round Power Multiplier"
                type="number"
              />
            </q-expansion-item>
          </div>
          <div
            cols="12"
            sm="6"
          >
            <!-- Team Settings Section -->
            <q-expansion-item
              label="Team Settings"
              icon="settings"
              dense
              default-opened
            >
              <q-input
                filled
                v-model="changeMinRoundsComputed"
                label="Change Min Rounds"
                type="number"
              />
              <q-input
                filled
                v-model="editTeamMinRoundsComputed"
                label="Edit Team Min Rounds"
                type="number"
              />
              <q-input
                filled
                v-model="teamEditMaxPctChangeComputed"
                label="Team Edit Max Percent Change"
                type="number"
              />
              <q-input
                filled
                v-model="buyTeamCostComputed"
                label="Buy Team Cost"
                type="number"
              />
              <q-input
                filled
                v-model="ownerStakeRequiredComputed"
                label="Owner Stake Required"
                type="number"
              />
              <q-input
                filled
                v-model="ownerFutureStakeLockRoundsRequiredComputed"
                label="Owner Future Stake Lock Rounds Required"
                type="number"
              />
            </q-expansion-item>

            <!-- Stake Settings Section -->

            <q-expansion-item
              label="Stake Settings"
              icon="settings"
              dense
              default-opened
            >
              <q-input
                filled
                v-model="unstakeRoundsComputed"
                label="Unstake Rounds"
                type="number"
              />
              <q-input
                filled
                v-model="extraStakeMinLockedRoundsComputed"
                label="Extra Stake Min Locked Rounds"
                type="number"
              />
            </q-expansion-item>
          </div>

          <!-- Auth Settings Section -->
          <div
            cols="12"
            sm="6"
          >
            <q-expansion-item
              label="Auth Settings"
              icon="settings"
              dense
              default-opened
            >
              <q-input
                filled
                v-model="keyActionsWhitelistComputed"
                label="Key Actions Whitelist"
                type="text"
              />
              <q-input
                filled
                v-model="keyAccountMaxStakeComputed"
                label="Key Account Max Stake"
                type="number"
              />
              <q-input
                filled
                v-model="keyAccountMaxBalanceComputed"
                label="Key Account Max Balance"
                type="number"
              />
              <q-input
                filled
                v-model="accountMaxKeysComputed"
                label="Account Max Keys"
                type="number"
              />
              <q-input
                filled
                v-model="workerMaxBillPerActionComputed"
                label="Worker Max Bill Per Action"
                type="number"
              />
            </q-expansion-item>
          </div>

          <!-- Time Settings Section -->
          <div
            cols="12"
            sm="6"
          >
            <q-expansion-item
              label="Time Settings"
              icon="settings"
              dense
              default-opened
            >
              <q-input
                filled
                v-model="roundsStartSecSinceEpochComputed"
                label="Rounds Start Seconds Since Epoch"
                type="number"
              />
              <q-input
                filled
                v-model="roundLengthSecComputed"
                label="Round Length Seconds"
                type="number"
              />
            </q-expansion-item>

            <!-- NFT Settings Section -->
            <q-expansion-item
              label="NFT Settings"
              icon="settings"
              dense
              default-opened
            >
              <q-input
                filled
                v-model="boidIdMaxNFTsComputed"
                label="Boid ID Maximum NFTs"
                type="number"
              />
              <q-input
                filled
                v-model="whitelistCollectionsComputed"
                label="Whitelist Collections"
                type="text"
              />
            </q-expansion-item>
          </div>

          <!-- Other Settings Section -->
          <div
            cols="12"
            sm="6"
          >
            <q-expansion-item
              label="Other Settings"
              icon="settings"
              dense
              default-opened
            >
              <q-toggle
                v-model="pausedComputed"
                label="Paused"
              />
              <q-toggle
                v-model="allowDepositsComputed"
                label="Allow Deposits"
              />
              <q-toggle
                v-model="allowWithdrawalsComputed"
                label="Allow Withdrawals"
              />
            </q-expansion-item>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, computed } from "vue"
import { useGlobalStore } from "../stores/globalStore"
import { Types } from "src/lib/boid-contract-structure"
import { Name, UInt8, UInt32, Float32, UInt16 } from "@wharfkit/antelope"

export default defineComponent({
  name: "GlobalPage",
  setup() {
    const store = useGlobalStore()
    const config = reactive({
      account: {} as Types.ConfigAccount,
      power: {} as Types.ConfigPower,
      mint: {} as Types.ConfigMint,
      team: {} as Types.ConfigTeam,
      stake: {} as Types.ConfigStake,
      time: {} as Types.ConfigTime,
      auth: {} as Types.ConfigAuth,
      nft: {} as Types.ConfigNft,
      paused: false,
      allow_deposits: false,
      allow_withdrawals: false,
      recoveryaccount: {} as Name
    })

    // Config Account
    const invitePowerPrefixComputed = computed({
      get: () => config.account.invite_price?.value || 0,
      set: (newValue) => {
        config.account.invite_price = new UInt32(newValue)
      }
    })
    const premiumPurchasePriceComputed = computed({
      get: () => config.account.premium_purchase_price?.value || 0,
      set: (newValue) => {
        config.account.premium_purchase_price = new UInt32(newValue)
      }
    })
    const maxPremiumPrefixComputed = computed({
      get: () => config.account.max_premium_prefix?.value || 0,
      set: (newValue) => {
        config.account.max_premium_prefix = new UInt8(newValue)
      }
    })
    const maxOwnersComputed = computed({
      get: () => config.account.max_owners?.value || 0,
      set: (newValue) => {
        config.account.max_owners = new UInt8(newValue)
      }
    })
    const maxBoostersComputed = computed({
      get: () => config.account.max_boosters?.value || 0,
      set: (newValue) => {
        config.account.max_boosters = new UInt8(newValue)
      }
    })
    const suffixWhitelistComputed = computed({
      get: () => config.account.suffix_whitelist?.map(name => name.toString()).join(", ") || "",
      set: (newValue) => {
        config.account.suffix_whitelist = newValue.split(",").map(Name.from)
      }
    })
    const removeSponsorPriceComputed = computed({
      get: () => config.account.remove_sponsor_price?.value || 0,
      set: (newValue) => {
        config.account.remove_sponsor_price = new UInt32(newValue)
      }
    })
    const sponsorMaxInviteCodesComputed = computed({
      get: () => config.account.sponsor_max_invite_codes?.value || 0,
      set: (newValue) => {
        config.account.sponsor_max_invite_codes = new UInt8(newValue)
      }
    })
    const inviteCodeExpireRoundsComputed = computed({
      get: () => config.account.invite_code_expire_rounds?.value || 0,
      set: (newValue) => {
        config.account.invite_code_expire_rounds = new UInt16(newValue)
      }
    })

    // Config Power
    const sponsorTaxMultComputed = computed({
      get: () => config.power.sponsor_tax_mult?.value || 0,
      set: (newValue) => {
        config.power.sponsor_tax_mult = new Float32(newValue)
      }
    })
    const poweredStakeMultComputed = computed({
      get: () => config.power.powered_stake_mult?.value || 0,
      set: (newValue) => {
        config.power.powered_stake_mult = new Float32(newValue)
      }
    })
    const claimMaxElapsedRoundsComputed = computed({
      get: () => config.power.claim_maximum_elapsed_rounds?.value || 0,
      set: (newValue) => {
        config.power.claim_maximum_elapsed_rounds = new UInt16(newValue)
      }
    })
    const softMaxPwrAdd = computed({
      get: () => config.power.soft_max_pwr_add?.value || 0,
      set: (newValue) => {
        config.power.soft_max_pwr_add = new UInt16(newValue)
      }
    })
    const historySlotsLengthComputed = computed({
      get: () => config.power.history_slots_length?.value || 0,
      set: (newValue) => {
        config.power.history_slots_length = new UInt8(newValue)
      }
    })

    // Config Mint
    const roundPoweredStakeMultComputed = computed({
      get: () => config.mint.round_powered_stake_mult?.value || 0,
      set: (newValue) => {
        config.mint.round_powered_stake_mult = new Float32(newValue)
      }
    })
    const roundPowerMultComputed = computed({
      get: () => config.mint.round_power_mult?.value || 0,
      set: (newValue) => {
        config.mint.round_power_mult = new Float32(newValue)
      }
    })

    // Config Team
    const changeMinRoundsComputed = computed({
      get: () => config.team.change_min_rounds?.value || 0,
      set: (newValue) => {
        config.team.change_min_rounds = new UInt16(newValue)
      }
    })
    const editTeamMinRoundsComputed = computed({
      get: () => config.team.edit_team_min_rounds?.value || 0,
      set: (newValue) => {
        config.team.edit_team_min_rounds = new UInt16(newValue)
      }
    })
    const teamEditMaxPctChangeComputed = computed({
      get: () => config.team.team_edit_max_pct_change?.value || 0,
      set: (newValue) => {
        config.team.team_edit_max_pct_change = new UInt16(newValue)
      }
    })
    const buyTeamCostComputed = computed({
      get: () => config.team.buy_team_cost?.value || 0,
      set: (newValue) => {
        config.team.buy_team_cost = new UInt32(newValue)
      }
    })
    const ownerStakeRequiredComputed = computed({
      get: () => config.team.owner_stake_required?.value || 0,
      set: (newValue) => {
        config.team.owner_stake_required = new UInt32(newValue)
      }
    })
    const ownerFutureStakeLockRoundsRequiredComputed = computed({
      get: () => config.team.owner_future_stake_lock_rounds_required?.value || 0,
      set: (newValue) => {
        config.team.owner_future_stake_lock_rounds_required = new UInt16(newValue)
      }
    })

    // Config Stake
    const unstakeRoundsComputed = computed({
      get: () => config.stake.unstake_rounds?.value || 0,
      set: (newValue) => {
        config.stake.unstake_rounds = new UInt8(newValue)
      }
    })
    const extraStakeMinLockedRoundsComputed = computed({
      get: () => config.stake.extra_stake_min_locked_rounds?.value || 0,
      set: (newValue) => {
        config.stake.extra_stake_min_locked_rounds = new UInt8(newValue)
      }
    })

    // Config Time
    const roundsStartSecSinceEpochComputed = computed({
      get: () => config.time.rounds_start_sec_since_epoch?.value || 0,
      set: (newValue) => {
        config.time.rounds_start_sec_since_epoch = new UInt32(newValue)
      }
    })
    const roundLengthSecComputed = computed({
      get: () => config.time.round_length_sec?.value || 0,
      set: (newValue) => {
        config.time.round_length_sec = new UInt32(newValue)
      }
    })

    // Config Auth
    const keyActionsWhitelistComputed = computed({
      get: () => config.auth.key_actions_whitelist?.map(name => name.toString()).join(", ") || "",
      set: (newValue) => {
        config.auth.key_actions_whitelist = newValue.split(",").map(Name.from)
      }
    })
    const keyAccountMaxStakeComputed = computed({
      get: () => config.auth.key_account_max_stake?.value || 0,
      set: (newValue) => {
        config.auth.key_account_max_stake = new UInt32(newValue)
      }
    })
    const keyAccountMaxBalanceComputed = computed({
      get: () => config.auth.key_account_max_balance?.value || 0,
      set: (newValue) => {
        config.auth.key_account_max_balance = new UInt32(newValue)
      }
    })
    const accountMaxKeysComputed = computed({
      get: () => config.auth.account_max_keys?.value || 0,
      set: (newValue) => {
        config.auth.account_max_keys = new UInt8(newValue)
      }
    })
    const workerMaxBillPerActionComputed = computed({
      get: () => config.auth.worker_max_bill_per_action?.value || 0,
      set: (newValue) => {
        config.auth.worker_max_bill_per_action = new UInt32(newValue)
      }
    })

    // Config NFT
    const boidIdMaxNFTsComputed = computed({
      get: () => config.nft.boid_id_maximum_nfts?.value || 0,
      set: (newValue) => {
        config.nft.boid_id_maximum_nfts = new UInt16(newValue)
      }
    })
    const whitelistCollectionsComputed = computed({
      get: () => config.nft.whitelist_collections?.map(name => name.toString()).join(", ") || "",
      set: (newValue) => {
        config.nft.whitelist_collections = newValue.split(",").map(Name.from)
      }
    })

    // Config Other
    const pausedComputed = computed({
      get: () => config.paused,
      set: (newValue) => {
        config.paused = newValue
      }
    })

    const allowDepositsComputed = computed({
      get: () => config.allow_deposits,
      set: (newValue) => {
        config.allow_deposits = newValue
      }
    })

    const allowWithdrawalsComputed = computed({
      get: () => config.allow_withdrawals,
      set: (newValue) => {
        config.allow_withdrawals = newValue
      }
    })

    onMounted(async() => {
      const fetchedConfig = await store.fetchConfig()
      if (fetchedConfig) {
        const fetchedConfigData = fetchedConfig[0]
        if (fetchedConfigData) {
          Object.assign(config, fetchedConfigData)
        }
      }
    })

    return {
      maxPremiumPrefixComputed,
      invitePowerPrefixComputed,
      sponsorTaxMultComputed,
      poweredStakeMultComputed,
      premiumPurchasePriceComputed,
      maxOwnersComputed,
      maxBoostersComputed,
      suffixWhitelistComputed,
      removeSponsorPriceComputed,
      sponsorMaxInviteCodesComputed,
      inviteCodeExpireRoundsComputed,
      claimMaxElapsedRoundsComputed,
      softMaxPwrAdd,
      historySlotsLengthComputed,
      roundPoweredStakeMultComputed,
      roundPowerMultComputed,
      changeMinRoundsComputed,
      editTeamMinRoundsComputed,
      teamEditMaxPctChangeComputed,
      buyTeamCostComputed,
      ownerStakeRequiredComputed,
      ownerFutureStakeLockRoundsRequiredComputed,
      unstakeRoundsComputed,
      extraStakeMinLockedRoundsComputed,
      roundsStartSecSinceEpochComputed,
      roundLengthSecComputed,
      keyActionsWhitelistComputed,
      keyAccountMaxStakeComputed,
      keyAccountMaxBalanceComputed,
      accountMaxKeysComputed,
      workerMaxBillPerActionComputed,
      boidIdMaxNFTsComputed,
      whitelistCollectionsComputed,
      pausedComputed,
      allowDepositsComputed,
      allowWithdrawalsComputed
    }
  }
})
</script>
<style>
.my-card {
  min-width: 400px;
  max-width: 800px;
}
</style>
