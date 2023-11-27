
import { acceptHMRUpdate, defineStore } from "pinia"
import { createAction2, createAction, fetchDataFromTable } from "src/lib/contracts"
import { ActionParams, Types } from "lib/boid-contract-structure"
import { Ref, ref } from "vue"
import { Action, TransactResult } from "@wharfkit/session"
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
    async createConfigSetAction(configData:ActionParams.ConfigSet):Promise<TransactResult | undefined> {
      try {
        console.log("Session Data Username:", sessionStore.username)
        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }
        const result = await createAction2("config.set", configData)
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
  import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot))
}
