export interface DistributeForm {
  game_id: string
  cycle_number: string
  stat_name: string
  total_reward: string
  token_contract: string
  reward_percentages: string
}

export interface ConfigForm {
  start_time: string
  cycle_length_sec: string
  max_cycle_length_sec: string
  max_reward_tiers: string
  min_reward_percentage: string
}
