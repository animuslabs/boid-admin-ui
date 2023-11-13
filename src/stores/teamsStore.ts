// Importing necessary libraries and functions
import { defineStore } from "pinia"
import { getTableData, createAction } from "../lib/contracts"
import { ActionParams, Types } from "../lib/boid-contract-structure"
import { Ref, ref } from "vue"
import { contractName, tables } from "../lib/config"
import { Bytes } from "@wharfkit/antelope"
import { TransactResult } from "@wharfkit/session"
import { DeserializedTeam, TeamMeta } from "../lib/types"
import { useSessionStore } from "../stores/sessionStore"

const sessionStore = useSessionStore()

async function bytesToJson<T>(bytes:Bytes):Promise<T> {
  try {
    // Check if bytes are empty
    if (bytes.length === 0) {
      console.warn("Empty bytes, returning default value.")
      return {} as T // Return an empty object (or a more appropriate default value)
    }

    // Decode bytes to string
    const decoder = new TextDecoder() // Assumes UTF-8 encoding
    const jsonString = decoder.decode(bytes.array)

    // Parse string to JSON
    const data = JSON.parse(jsonString)

    return data
  } catch (error:any) {
    console.error("Error converting bytes to JSON:", error)
    throw new Error("Error converting bytes to JSON: " + error.message)
  }
}
export function stringToBytes(str:string):Bytes {
  return Bytes.fromString(str, "utf8")
}

async function deserializeTeam(team:Types.Team):Promise<DeserializedTeam> {
  let deserializedMeta:TeamMeta = new TeamMeta()

  // Additional logging and handling for 'meta'
  if (team.meta) {
    try {
      deserializedMeta = await bytesToJson(team.meta) as TeamMeta
    } catch (error) {
      console.error("Error deserializing 'meta':", error)
      // Handle error or set a default value for 'deserializedMeta' if necessary
    }
  }
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
    meta: deserializedMeta
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
    stateError(state) {
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
    },
    async createTeamAction(min_pwr_tax_mult:number, owner_cut_mult:number, url_safe_name:string):Promise<TransactResult | undefined> {
      console.log("createTeamAction called with", { min_pwr_tax_mult, owner_cut_mult, url_safe_name })

      try {
        const actionName = "team.create"
        console.log(`Preparing to create team with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.TeamCreate = {
          owner: sessionStore.username.toString() || "",
          min_pwr_tax_mult,
          owner_cut_mult,
          url_safe_name
        }
        console.log("Action data prepared:", action_data)

        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }

        console.log("Calling createAction...")
        const result = await createAction(contractName, actionName, action_data)
        console.log("Team created successfully:", result)

        return result
      } catch (error:any) {
        console.error("Error creating team:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    },
    async editTeamAction(team_id:number, owner:string, managers:string[], min_pwr_tax_mult:number, owner_cut_mult:number, url_safe_name:string, meta:Bytes):Promise<TransactResult | undefined> {
      console.log("editTeamAction called with", { team_id, owner, managers, min_pwr_tax_mult, owner_cut_mult, url_safe_name })
      try {
        const actionName = "team.edit"
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.TeamEdit = {
          team_id,
          owner,
          managers,
          min_pwr_tax_mult,
          owner_cut_mult,
          url_safe_name,
          meta
        }
        console.log("Action data prepared:", action_data)

        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }

        console.log("Calling createAction...")
        const result = await createAction(contractName, actionName, action_data)
        console.log("Team edited successfully:", result)

        return result
      } catch (error:any) {
        console.error("Error editing team:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    },
    // Transfer action NOT USED atm (just an example)
    async createTransferAction():Promise<TransactResult | undefined> {
      try {
        const actionName = "transfer"
        console.log(`Preparing to create team with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data = {
          from: sessionStore.username.toString() || "",
          to: "3boidanimus3",
          quantity: "100.0000 BOID",
          memo: "test"
        }
        console.log("Action data prepared:", action_data)

        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }

        console.log("Calling createAction...")
        const result = await createAction("token.boid", actionName, action_data)
        console.log("Transfer successfull:", result)

        return result
      } catch (error:any) {
        console.error("Error creating team:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    }
  }

})
