import { defineStore } from "pinia"
import { createAction, fetchDataFromTable } from "../lib/contracts"
import { Types, ActionParams } from "../lib/boid-contract-structure"
import { ref } from "vue"
import { TransactResult } from "@wharfkit/session"
import { useSessionStore } from "src/stores/sessionStore"

const sessionStore = useSessionStore()
export const offerStore = defineStore({
  id: "offerStore",

  // Reactive state of the store
  state: () => ({
    loading: false,
    error: ref<string | null>(null)
  }),

  // Getters for computed values based on state
  getters: {
    isLoading(state) {
      return state.loading
    },
    errors(state) {
      return state.error
    }
  },

  actions: {
    async fetchOffersTableData():Promise<Types.Offer[] | undefined> {
      console.log("fetchBoostersTableData called")
      this.$patch({ loading: true, error: null })
      try {
        const dataOffersResult = await fetchDataFromTable("offers")
        if (!dataOffersResult) {
          // Handle the case when one of the fetches returns undefined
          console.error("Failed to fetch data")
          this.$patch({ error: "Failed to fetch data" })
          return
        }

        const dataOffers:Types.Offer[] = dataOffersResult as unknown as Types.Offer[]
        console.log("OffersData: ", dataOffers)

        return dataOffers
      } catch (error:any) {
        console.error("Error fetching account table data:", error)
        this.$patch({ error: error.message })
      } finally {
        this.$patch({ loading: false })
      }
    },
    async deleteOfferAction(configData:ActionParams.offerrm):Promise<TransactResult | undefined> {
      try {
        console.log("Session Data Username:", sessionStore.username)
        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }
        const result = await createAction("offer.rm", configData)
        console.log("Action Sent:", result)
      } catch (error:any) {
        console.error("createConfigSetAction Error:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    },
    async cleanOfferAction():Promise<TransactResult | undefined> {
      try {
        console.log("Session Data Username:", sessionStore.username)
        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }
        const configData:ActionParams.offerclean = {}
        const result = await createAction("offer.clean", configData)
        console.log("Action Sent:", result)
      } catch (error:any) {
        console.error("createConfigSetAction Error:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    },
    async addOfferAction(configData:ActionParams.offeradd):Promise<TransactResult | undefined> {
      try {
        console.log("Session Data Username:", sessionStore.username)
        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }
        const result = await createAction("offer.add", configData)
        console.log("Action Sent:", result)
      } catch (error:any) {
        console.error("createConfigSetAction Error:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    }
  }
})
