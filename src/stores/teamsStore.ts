// Importing necessary libraries and functions
import { defineStore } from "pinia"
import { getTableData } from "../lib/contracts"
import { Types } from "../lib/boid-contract-structure"
import { Ref, ref } from "vue"
import { contractName, tables } from "../lib/config"
import { Bytes } from "@wharfkit/antelope"
import { DeserializedTeam } from "../lib/types"

async function bytesToJson<T>(bytes:Bytes):Promise<T> {
  try {
    // Step 1: Decode bytes to string
    const decoder = new TextDecoder() // Assumes UTF-8 encoding
    const jsonString = decoder.decode(bytes.array)

    // Step 2: Parse string to JSON
    const data = JSON.parse(jsonString)

    return data
  } catch (error) {
    console.error("Error converting bytes to JSON:", error)
    throw new Error("Error converting bytes to JSON" + error)
  }
}

async function deserializeTeam(team:Types.Team):Promise<DeserializedTeam> {
  return {
    team_id: team.team_id.toNumber(),
    balance: team.balance.toNumber(),
    stake: {
      unstaking: team.stake.unstaking.map(unstake => ({
        redeemable_after_round: unstake.redeemable_after_round.toNumber(),
        quantity: unstake.quantity.toNumber()
      })),
      self_staked: team.stake.self_staked.toNumber(),
      received_delegated_stake: team.stake.received_delegated_stake.toNumber()
    },
    owner: team.owner.toString(),
    managers: team.managers.map(name => name.toString()),
    min_pwr_tax_mult: team.min_pwr_tax_mult.toNumber(),
    owner_cut_mult: team.owner_cut_mult.toNumber(),
    url_safe_name: team.url_safe_name,
    power: team.power.toNumber(),
    members: team.members.toNumber(),
    last_edit_round: team.last_edit_round.toNumber(),
    meta: team.meta ? await bytesToJson(team.meta) : null
  }
}

// Defining the store
export const useTeamStore = defineStore({
  id: "teamStore",

  // Reactive state of the store
  state: () => ({
    organizedDataRaw: ref([]) as Ref<DeserializedTeam[]>,
    loading: false,
    error: ref<string | null>(null)
  }),

  // Getters for computed values based on state
  getters: {
    organizedData(state) {
      return state.organizedDataRaw
    },
    isLoading(state) {
      return state.loading
    },
    error(state) {
      return state.error
    }
  },

  actions: {
    async fetchAccTableData():Promise<DeserializedTeam[] | undefined> {
      this.$patch({ loading: true, error: null })
      try {
        const dataTeams:Types.Team[] = await getTableData(contractName, tables[2] as string, contractName)
        const deserializedTeams = await Promise.all(dataTeams.map(deserializeTeam))
        console.log("Deserialized Teams:", deserializedTeams)
        this.organizedDataRaw = deserializedTeams // Store deserialized data
        return deserializedTeams
      } catch (error:any) {
        console.error("Error fetching account table data:", error)
        this.$patch({ error: error.message })
      } finally {
        this.$patch({ loading: false })
      }
    }

  }

})
