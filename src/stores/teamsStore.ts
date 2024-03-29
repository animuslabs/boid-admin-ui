// Importing necessary libraries and functions
import { defineStore } from "pinia"
import { createAction, fetchDataFromTable } from "src/lib/contracts"
import { Ref, ref } from "vue"
import { Bytes } from "@wharfkit/antelope"
import { TransactResult } from "@wharfkit/session"
import { DeserializedTeam, TeamMeta } from "src/types/types-stores"
import { useSessionStore } from "src/stores/sessionStore"
import { bytesToJson } from "src/lib/reuseFunctions"
import { ActionParams, Types, Contract as BoidContract } from "src/lib/boid-contract-structure"
import { useApiStore } from "src/stores/apiStore"

const sessionStore = useSessionStore()
const apiStore = useApiStore()

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
      const contract = apiStore.boidContractInitialized
      try {
        const dataTeamsResult = await fetchDataFromTable(contract as BoidContract, "teams")
        if (!dataTeamsResult) {
          console.error("Failed to fetch data")
          this.$patch({ error: "Failed to fetch data" })
          return
        }

        // Cast the result to the specific array type
        const dataTeams:Types.Team[] = dataTeamsResult as unknown as Types.Team[]
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
        const action_data:ActionParams.teamcreate = {
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
        const result = await createAction(actionName, action_data)
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
        const action_data:ActionParams.teamedit = {
          team_id,
          owner,
          managers,
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
        const result = await createAction(actionName, action_data)
        console.log("Team edited successfully:", result)

        return result
      } catch (error:any) {
        console.error("Error editing team:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    },
    async removeTeamAction(team_id:number):Promise<TransactResult | undefined> {
      console.log("createTeamAction called with", { team_id })

      try {
        const actionName = "team.rm"
        console.log(`Preparing to remove team with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.teamrm = {
          team_id
        }
        console.log("Action data prepared:", action_data)

        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }

        console.log("Calling createAction...")
        const result = await createAction(actionName, action_data)
        console.log("Team created successfully:", result)

        return result
      } catch (error:any) {
        console.error("Error creating team:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    }
  }

})
