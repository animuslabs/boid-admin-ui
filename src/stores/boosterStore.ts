import { defineStore } from "pinia"
import { fetchDataFromTable } from "../lib/contracts"
import { Types } from "../lib/boid-contract-structure"
import { Ref, ref } from "vue"
import { ParsedAccountMeta, AccountRowData, AccountMeta } from "../lib/types"

export const boosterStore = defineStore({
  id: "boosterStore",

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
    async fetchBoostersTableData():Promise<Types.Booster[] | undefined> {
      console.log("fetchBoostersTableData called")
      this.$patch({ loading: true, error: null })
      try {
        const dataBoostersResult = await fetchDataFromTable("boosters")
        if (!dataBoostersResult) {
          // Handle the case when one of the fetches returns undefined
          console.error("Failed to fetch data")
          this.$patch({ error: "Failed to fetch data" })
          return
        }

        const dataBoosters:Types.Booster[] = dataBoostersResult as unknown as Types.Booster[]
        console.log("BoostersData", dataBoosters)

        return dataBoosters
      } catch (error:any) {
        console.error("Error fetching account table data:", error)
        this.$patch({ error: error.message })
      } finally {
        this.$patch({ loading: false })
      }
    }
  }

})
