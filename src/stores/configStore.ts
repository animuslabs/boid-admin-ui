
import { acceptHMRUpdate, defineStore } from "pinia"
import { createAction, fetchDataFromTable } from "src/lib/contracts"
import { ActionParams, Contract as BoidContract } from "src/lib/boid-contract-structure"
import { Ref, ref } from "vue"
import { TransactResult } from "@wharfkit/session"
import { DeserializedTeam } from "src/types/types-stores"
import { useSessionStore } from "src/stores/sessionStore"
import { useApiStore } from "src/stores/apiStore"

const sessionStore = useSessionStore()
const apiStore = useApiStore()
// Defining the store
export const useConfigStore = defineStore({
  id: "cofigStore",

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
        const contract = apiStore.boidContractInitialized
        const configData = await fetchDataFromTable(contract as BoidContract, "config")
        console.log("Config data fetched:", configData)
        return configData
      } catch (error:any) {
        console.error("Error fetching config data:", error)
        this.$patch({ error: error.message })
      } finally {
        this.$patch({ loading: false })
      }
    },
    async createConfigSetAction(configData:ActionParams.configset):Promise<TransactResult | undefined> {
      try {
        console.log("Session Data Username:", sessionStore.username)
        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }
        const result = await createAction("config.set", configData)
        console.log("Action Sent:", result)
      } catch (error:any) {
        console.error("createConfigSetAction Error:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    }

  }
}
)
// this will make the store hot reload during development
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
}
