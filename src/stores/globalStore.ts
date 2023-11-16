import { defineStore } from "pinia"
import { createAction, fetchDataFromTable } from "src/lib/contracts"
import { ActionParams, Types } from "src/lib/boid-contract-structure"
import { Ref, ref } from "vue"
import { contractName } from "src/lib/config"
import { TransactResult } from "@wharfkit/session"
import { DeserializedTeam } from "src/lib/types"
import { useSessionStore } from "src/stores/sessionStore"

const sessionStore = useSessionStore()

// Defining the store
export const useGlobalStore = defineStore({
  id: "globalStore",

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
    async fetchConfig() {
      this.$patch({ loading: true, error: null })
      try {
        const configData = await fetchDataFromTable("config")
        console.log("Config data fetched:", configData)
        return configData
      } catch (error:any) {
        console.error("Error fetching config data:", error)
        this.$patch({ error: error.message })
      } finally {
        this.$patch({ loading: false })
      }
    },
    async createConfigSetAction(config:Types.Config
    ):Promise<TransactResult | undefined> {
      try {
        const actionName = "config.set"
        console.log(`Preparing to create team with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.ConfigSet = { config }

        console.log("Action data prepared:", action_data)

        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }

        console.log("Calling Action...")
        const result = await createAction(contractName, actionName, action_data)
        console.log("Transfer successful:", result)

        return result
      } catch (error:any) {
        console.error("Error creating team:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    }

  }
}
)
