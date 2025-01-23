import {
    Asset,
    Name,
    TimePointSec,
    UInt32,
    UInt64,
    UInt8,
    Bytes
} from '@wharfkit/antelope'

export const gameRecordsColumns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    format: (val: number) => val.toString(),
    sortable: true
  },
  {
    name: 'player',
    label: 'Player',
    field: 'player',
    format: (val: Name) => val.toString(),
    sortable: true
  },
  {
    name: 'game_id',
    label: 'Game',
    field: 'game_id',
    format: (val: UInt8) => val.toString(),
    sortable: true
  },
  {
    name: 'rewards_distributed',
    label: 'Distributed?',
    field: 'rewards_distributed',
    format: (val: boolean) => (val ? 'Yes' : 'No'),
    sortable: true
  },
  {
    name: 'stats_names',
    label: 'Stats Names',
    field: 'stats_names',
    format: (val: Name[]) => val.map(name => name.toString()).join(', ')
  },
  {
    name: 'stats_values',
    label: 'Stats Values',
    field: 'stats_values',
    format: (val: UInt64[]) => val.map(value => value.toString()).join(', ')
  },
  {
    name: 'cycle_number',
    label: 'Cycle',
    field: 'cycle_number',
    format: (val: UInt32) => val.toString(),
    sortable: true
  },
  {
    name: 'game_completion_time',
    label: 'Completion Time',
    field: 'game_completion_time',
    format: (val: TimePointSec) => val.toString(),
    sortable: true
  },
  {
    name: 'last_updated',
    label: 'Last Updated',
    field: 'last_updated',
    format: (val: TimePointSec) => val.toString(),
    sortable: true
  }
]

export const gameRewardsColumns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    format: (val: number) => val.toString(),
    sortable: true
  },
  {
    name: 'game_id',
    label: 'Game',
    field: 'game_id',
    format: (val: UInt8) => val.toString(),
    sortable: true
  },
  {
    name: 'cycle_number',
    label: 'Cycle',
    field: 'cycle_number',
    format: (val: UInt32) => val.toString(),
    sortable: true
  },
  {
    name: 'stat_name',
    label: 'Stat Name',
    field: 'stat_name',
    format: (val: Name) => val.toString(),
    sortable: true
  },
  {
    name: 'total_reward',
    label: 'Total Reward',
    field: 'total_reward',
    format: (val: Asset) => val.toString(),
    sortable: true
  },
  {
    name: 'rewarded_players',
    label: 'Rewarded Players',
    field: 'rewarded_players',
    format: (val: Name[]) => val.map(name => name.toString()).join(', '),
    sortable: true
  },
  {
    name: 'player_rewards',
    label: 'Player Rewards',
    field: 'player_rewards',
    format: (val: Asset[]) => val.map(asset => asset.toString()).join(', '),
    sortable: true
  },
  {
    name: 'distribution_time',
    label: 'Distribution Time',
    field: 'distribution_time',
    format: (val: TimePointSec) => val.toString(),
    sortable: true
  }
]
