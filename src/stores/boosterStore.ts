import { defineStore } from "pinia"
import { ref } from "vue"
import { createAction, fetchDataFromTable } from "src/lib/contracts"
import { TransactResult } from "@wharfkit/session"
import { useSessionStore } from "src/stores/sessionStore"
import { ActionParams, Types, Contract as BoidContract } from "src/lib/boid-contract-structure"
import { useApiStore } from "src/stores/apiStore"

const sessionStore = useSessionStore()
const apiStore = useApiStore()

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
      const contract = apiStore.boidContractInitialized
      try {
        const dataBoostersResult = await fetchDataFromTable(contract as BoidContract, "boosters")
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
    },
    async removeBoosterAction(boid_id:string, booster_index:number[]):Promise<TransactResult | undefined> {
      console.log("removeBoosterAction called with", { booster_index })

      try {
        const actionName = "booster.rm"
        console.log(`Preparing to remove booster with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.boosterrm = { boid_id, booster_index }
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
        console.error("Error removing the booster:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    },
    async addBoosterAction(boid_id:string, booster_id:number):Promise<TransactResult | undefined> {
      console.log("addBoosterAction called with", { booster_id })

      try {
        const actionName = "booster.add"
        console.log(`Preparing to add booster to ${boid_id} with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.boosteradd = { boid_id, booster_id }
        console.log("Action data prepared:", action_data)

        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }

        console.log("Calling createAction...")
        const result = await createAction(actionName, action_data)
        console.log("Booster added successfully:", result)

        return result
      } catch (error:any) {
        console.error("Error removing the booster:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    },
    async newBoosterAction(booster:Types.Booster):Promise<TransactResult | undefined> {
      console.log("newBoosterAction called with", { booster })

      try {
        const actionName = "booster.new"
        console.log(`Preparing to create new booster with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.boosternew = { booster }
        console.log("Action data prepared:", action_data)

        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }

        console.log("Calling createAction...")
        const result = await createAction(actionName, action_data)
        console.log("Booster created successfully:", result)

        return result
      } catch (error:any) {
        console.error("Error removing the booster:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    }
  }

})
