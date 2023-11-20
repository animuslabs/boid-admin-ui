<template>
  <q-page class="flex flex-center">
    <q-card class="my-card">
      <q-card-section>
        <q-btn
          flat
          label="SAVE"
          color="secondary"
          @click="handleSave"
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
              <q-input
                filled
                v-model="recoveryaccountComputed"
                label="Recovery Account"
                type="text"
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
import { Name } from "@wharfkit/antelope"

export default defineComponent({
  name: "GlobalPage",
  setup() {
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

    // Config Account
    const invitePowerPrefixComputed = computed({
      get: () => config.account.invite_price,
      set: (newValue) => {
        config.account.invite_price = newValue
      }
    })
    const premiumPurchasePriceComputed = computed({
      get: () => config.account.premium_purchase_price,
      set: (newValue) => {
        config.account.premium_purchase_price = newValue
      }
    })
    const maxPremiumPrefixComputed = computed({
      get: () => config.account.max_premium_prefix,
      set: (newValue) => {
        config.account.max_premium_prefix = newValue
      }
    })
    const maxOwnersComputed = computed({
      get: () => config.account.max_owners,
      set: (newValue) => {
        config.account.max_owners = newValue
      }
    })
    const maxBoostersComputed = computed({
      get: () => config.account.max_boosters,
      set: (newValue) => {
        config.account.max_boosters = newValue
      }
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

    const removeSponsorPriceComputed = computed({
      get: () => config.account.remove_sponsor_price,
      set: (newValue) => {
        config.account.remove_sponsor_price = newValue
      }
    })
    const sponsorMaxInviteCodesComputed = computed({
      get: () => config.account.sponsor_max_invite_codes,
      set: (newValue) => {
        config.account.sponsor_max_invite_codes = newValue
      }
    })
    const inviteCodeExpireRoundsComputed = computed({
      get: () => config.account.invite_code_expire_rounds,
      set: (newValue) => {
        config.account.invite_code_expire_rounds = newValue
      }
    })

    // Config Power
    const sponsorTaxMultComputed = computed({
      get: () => {
        let value:any = config.power.sponsor_tax_mult
        value = value && typeof value === "object" && "value" in value ? value.value : value
        return value
      },
      set: (newValue) => {
        config.power.sponsor_tax_mult = newValue
      }
    })

    const poweredStakeMultComputed = computed({
      get: () => {
        let value:any = config.power.powered_stake_mult
        value = value && typeof value === "object" && "value" in value ? value.value : value
        return value
      },
      set: (newValue) => {
        config.power.powered_stake_mult = newValue
      }
    })

    const claimMaxElapsedRoundsComputed = computed({
      get: () => config.power.claim_maximum_elapsed_rounds,
      set: (newValue) => {
        config.power.claim_maximum_elapsed_rounds = newValue
      }
    })
    const softMaxPwrAdd = computed({
      get: () => config.power.soft_max_pwr_add,
      set: (newValue) => {
        config.power.soft_max_pwr_add = newValue
      }
    })
    const historySlotsLengthComputed = computed({
      get: () => config.power.history_slots_length,
      set: (newValue) => {
        config.power.history_slots_length = newValue
      }
    })

    // Config Mint
    const roundPoweredStakeMultComputed = computed({
      get: () => {
        let value:any = config.mint.round_powered_stake_mult
        value = value && typeof value === "object" && "value" in value ? value.value : value
        return value
      },
      set: (newValue) => {
        config.mint.round_powered_stake_mult = parseFloat(newValue)
      }
    })

    const roundPowerMultComputed = computed({
      get: () => {
        let value:any = config.mint.round_power_mult
        value = value && typeof value === "object" && "value" in value ? value.value : value
        return value
      },
      set: (newValue) => {
        config.mint.round_power_mult = parseFloat(newValue)
      }
    })

    // Config Team
    const changeMinRoundsComputed = computed({
      get: () => config.team.change_min_rounds,
      set: (newValue) => {
        config.team.change_min_rounds = newValue
      }
    })
    const editTeamMinRoundsComputed = computed({
      get: () => config.team.edit_team_min_rounds,
      set: (newValue) => {
        config.team.edit_team_min_rounds = newValue
      }
    })
    const teamEditMaxPctChangeComputed = computed({
      get: () => config.team.team_edit_max_pct_change,
      set: (newValue) => {
        config.team.team_edit_max_pct_change = newValue
      }
    })
    const buyTeamCostComputed = computed({
      get: () => config.team.buy_team_cost,
      set: (newValue) => {
        config.team.buy_team_cost = newValue
      }
    })
    const ownerStakeRequiredComputed = computed({
      get: () => config.team.owner_stake_required,
      set: (newValue) => {
        config.team.owner_stake_required = newValue
      }
    })
    const ownerFutureStakeLockRoundsRequiredComputed = computed({
      get: () => config.team.owner_future_stake_lock_rounds_required,
      set: (newValue) => {
        config.team.owner_future_stake_lock_rounds_required = newValue
      }
    })

    // Config Stake
    const unstakeRoundsComputed = computed({
      get: () => config.stake.unstake_rounds,
      set: (newValue) => {
        config.stake.unstake_rounds = newValue
      }
    })
    const extraStakeMinLockedRoundsComputed = computed({
      get: () => config.stake.extra_stake_min_locked_rounds,
      set: (newValue) => {
        config.stake.extra_stake_min_locked_rounds = newValue
      }
    })

    // Config Time
    const roundsStartSecSinceEpochComputed = computed({
      get: () => config.time.rounds_start_sec_since_epoch,
      set: (newValue) => {
        config.time.rounds_start_sec_since_epoch = newValue
      }
    })
    const roundLengthSecComputed = computed({
      get: () => config.time.round_length_sec,
      set: (newValue) => {
        config.time.round_length_sec = newValue
      }
    })

    // Config Auth
    const keyActionsWhitelistComputed = computed({
      get: () => {
        return config.auth.key_actions_whitelist.join(", ")
      },
      set: (newValue) => {
        config.auth.key_actions_whitelist = newValue.split(",").map(str => str.trim())
      }
    })

    const keyAccountMaxStakeComputed = computed({
      get: () => config.auth.key_account_max_stake,
      set: (newValue) => {
        config.auth.key_account_max_stake = newValue
      }
    })
    const keyAccountMaxBalanceComputed = computed({
      get: () => config.auth.key_account_max_balance,
      set: (newValue) => {
        config.auth.key_account_max_balance = newValue
      }
    })
    const accountMaxKeysComputed = computed({
      get: () => config.auth.account_max_keys,
      set: (newValue) => {
        config.auth.account_max_keys = newValue
      }
    })
    const workerMaxBillPerActionComputed = computed({
      get: () => config.auth.worker_max_bill_per_action,
      set: (newValue) => {
        config.auth.worker_max_bill_per_action = newValue
      }
    })

    // Config NFT
    const boidIdMaxNFTsComputed = computed({
      get: () => config.nft.boid_id_maximum_nfts,
      set: (newValue) => {
        config.nft.boid_id_maximum_nfts = newValue
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
    const recoveryaccountComputed = computed({
      get: () => config.recoveryaccount,
      set: (newValue) => {
        config.recoveryaccount = newValue
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
    const configInstance = computed(() => {
      return Types.Config.from({
        account: Types.ConfigAccount.from(config.account),
        power: Types.ConfigPower.from(config.power),
        mint: Types.ConfigMint.from(config.mint),
        team: Types.ConfigTeam.from(config.team),
        stake: Types.ConfigStake.from(config.stake),
        time: Types.ConfigTime.from(config.time),
        auth: Types.ConfigAuth.from(config.auth),
        nft: Types.ConfigNft.from(config.nft),
        paused: Boolean(config.paused),
        allow_deposits: Boolean(config.allow_deposits),
        allow_withdrawals: Boolean(config.allow_withdrawals),
        recoveryaccount: Name.from(config.recoveryaccount)
      })
    })

    const handleSave = async() => {
      try {
        // Convert reactive config to Types.Config type
        console.log("Saving configuration config:", config)
        console.log("Saving configuration configInstance:", configInstance.value)
        // Call store action
        await store.createConfigSetAction(configInstance.value)
        console.log("Configuration saved successfully")
      } catch (error) {
        console.error("Error saving configuration:", error)
      }
    }

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
      allowWithdrawalsComputed,
      handleSave,
      recoveryaccountComputed
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
