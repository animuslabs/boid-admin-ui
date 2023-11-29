import { defineStore } from "pinia"
import { fetchDataFromTable } from "../lib/contracts"
import { Types } from "../lib/boid-contract-structure"
import { ref } from "vue"

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
    }
  }

})
