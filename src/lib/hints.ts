export const configHints = {
  account: {
    invite_price: "The cost to purchase an account directly or to create an invite code which can be claimed to create one account.",
    max_owners: "The max number of owners that can be registered on an account.",
    max_sponsors: "The max number of sponsors an account can hold.",
    max_boosters: "The max number of PowerMods an account can hold.",
    suffix_whitelist: "When creating an account the new boid_id must have a suffix on this whitelist",
    remove_sponsor_price: "The cost to \"upgrade\" an account which removes the sponsor from the account and may unlock other things",
    invite_code_expire_rounds: "Invite codes expire this many rounds after they are created.",
    premium_purchase_price: "The price to purchase a premium account",
    max_premium_prefix: "the max lenth of premiun account prefix, names with prefixes longer than this are not premium",
    sponsor_max_invite_codes: "the max number of invite codes allowed for a sponsor, the codes can be claimed to create an account or deleted and recreated until claimed."
  },
  power: {
    round_decay_constant: "A static constant amount of power that decays each round. Subtracted from an account power during `power.claim`.",
    round_decay_mult: "The multiplier on the amount of power that decays for an account during `power.claim`. Ex: an account with 100 power would lose 10 power after one round.",
    sponsor_tax_mult: "Multiplier on power that is diverted to an account sponsor when an invited account earns power. Ex: 0.1 means 10% of power would be diverted to the sponsor.",
    powered_stake_mult: "Multiplied by power to determine an account's `max_powered_stake`.",
    soft_max_pwr_add: "The maximum amount of power that can be added to an account in a single round. This is to prevent edge cases where an account could add a large amount of power in a single round.",
    history_slots_length: "The number of slots to keep in the power history table. This is used to calculate the average power of an account over a period of time.",
    claim_maximum_elapsed_rounds: "When claiming the maximum amount of rounds that can be counted. Ex: if max is 10 and you claim after 15 rounds, you only get paid/decayed for 10 rounds. This is to help prevent edge cases where an account goes for a long period of time without being claimed."
  },
  mint: {
    round_powered_stake_mult: "Inflation from powered stake. The calculation for poweredStakePayout is: config.mint.round_powered_stake_mult * poweredStake * elapsedRounds.",
    round_power_mult: "Determines inflation from Boid power. The calculation for boidPowerPayout is: config.mint.round_power_mult * decayedPower * elapsedRounds."
  },
  team: {
    change_min_rounds: "Minimum rounds an account must wait before changing teams. This helps maintain team stability and prevents frequent hopping.",
    edit_team_min_rounds: "Minimum rounds a team owner must wait before editing teams. This enforces a cooling-off period for team modifications.",
    team_edit_max_pct_change: "Maximum percentage that team tax and owner cut can be adjusted (up or down) with each edit. This limits drastic changes in team policies.",
    buy_team_cost: "The amount of BOID required to create a new team. This is a one-time cost for team formation.",
    owner_stake_required: "The amount of BOID stake required to create a team. This stake acts as a commitment from the team owner.",
    owner_future_stake_lock_rounds_required: "The number of rounds for which the owner must have some BOID stake locked. This ensures long-term commitment from the team owner."
  },
  stake: {
    unstake_rounds: "Defines how many rounds the user must wait before staked BOID can become liquid. For example, if unstake_rounds is 4, and the user initiates unstaking, they can complete the unstaking process after 4 rounds to receive liquid BOID.",
    extra_stake_min_locked_rounds: "Specifies the minimum number of rounds for which extra stake (delegated stake) must be locked. After the lock period, the delegated stake can be cancelled and returned to the owner's normal self-staked bucket."
  },
  time: {
    rounds_start: "Marks the start time of round 0, which should coincide with the contract deployment on the mainnet. This value is critical for timekeeping within the system and should never be changed after being set initially.",
    round_length_sec: "Defines the duration of each round in seconds. Given the maximum of 65000 rounds possible before an overflow, rounds should be at least 4 hours long. As all Boid power calculations and accounting are done in intervals of rounds, this value should remain constant after initial setup on the mainnet."
  },
  auth: {
    key_actions_whitelist: "Actions that must be whitelisted for key authentication to be used. This ensures only authorized actions are permitted for accounts using key-based authentication.",
    key_account_max_stake: "NOT IMPLEMENTED: In the future, this will define the maximum stake limit for accounts that only have key-based authentication (without an attached owner account).",
    key_account_max_balance: "NOT IMPLEMENTED: In the future, this will set the maximum balance limit for key-only accounts, restricting the stake/balance of accounts without an owner account.",
    account_max_keys: "The maximum number of keys that can be registered for authentication on a Boid account, enforcing a limit to the number of authentication keys per account.",
    worker_max_bill_per_action: "NOT IMPLEMENTED: Proposed feature where workers that process actions for key accounts could bill the account to prevent spam. This would set the maximum billing amount per action."
  },
  nft: {
    boid_id_maximum_nfts: "Defines the maximum number of NFTs a single boid_id can hold. This limit is set to prevent potential abuse of RAM resources within the system, ensuring fair and efficient usage."
  },
  autoAdjust: {
    target_inflation_per_round: "Defines the target inflation rate per round for the auto-adjustment mechanism. This sets the desired level of inflation the system aims to achieve in each round.",
    power_mult_max_adjust: "Specifies the maximum adjustment allowed for the round_power_mult in each auto-adjustment action. This limits how drastically the power multiplier can change, ensuring stability.",
    powered_stake_mult_max_adjust: "Sets the maximum percentage by which the round_powered_stake_mult can be adjusted in each auto-adjustment action. This helps control the rate of change and maintains a balanced inflation rate.",
    adjustment_interval_rounds: "Determines the frequency at which the auto-adjust action can be called to update inflation parameters. This interval defines how often the system can adapt to changing economic conditions."
  },
  paused: "Pauses the entire contract so all actions will fail unless authenticated by the contract auth",
  allow_deposits: "Used to disable deposits, this could be used during beta testing to prevent abuse.",
  allow_withdrawals: "Used to disable withdrawals, this could be used during beta testing to prevent abuse.",
  recoveryaccount: "The account that can recover an account if the owner key is lost."
}

export const boostersHints = {
  booster_id: "next unique booster id number",
  pwr_multiplier: "The multiplier on the power of the account. Unit range 0-200 | Ex. 100 = 50% of the account's power is added to the account each round",
  pwr_add_per_round: "The amount of power to add to the account each round. One round eq 13h.",
  expire_after_elapsed_rounds: "The number of rounds after which the booster expires. 1 month = 55 rounds | 6 months = 332 rounds | 1 year = 664 rounds",
  aggregate_pwr_capacity: "The maximum amount of power that can be added to an account by this booster.",
  booster_index: "Remove more than one booster at a time by specifying indexes. Ex. 0, 2"
}

export const teamHints = {
  name: "no uppercase letters, no spaces, no special characters, only hyphens allowed",
  owner: "boid account that owns the team",
  managers: "boid accounts that can manage the team (not implemented)",
  team_tax: "% tax on your power as a team member. Unit range 0-200, 100 = 50%",
  owner_cut: "% of team tax given to the owner. Unit range 0-200, 100 = 50%"
}
