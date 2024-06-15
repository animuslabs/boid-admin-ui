// Importing necessary libraries and functions
import { defineStore } from "pinia"
import { createAction } from "src/lib/contracts"
import { ref } from "vue"
import { TransactResult } from "@wharfkit/session"
import { useSessionStore } from "src/stores/sessionStore"
import { ActionParams } from "src/lib/boid-contract-structure"

const sessionStore = useSessionStore()

// Defining the store
export const walletStore = defineStore({
  id: "walletStore",

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
    stateError(state) {
      return state.error
    }
  },

  actions: {
    async stakeAction(boid_id:string, quantity:number):Promise<TransactResult | undefined> {
      const actionName = "stake"
      console.log(`${{ actionName }} called with`, { boid_id, quantity })
      try {
        console.log(`Preparing to create team with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.stake = {
          boid_id,
          quantity
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
    async unstakeInitAction(boid_id:string, quantity:number):Promise<TransactResult | undefined> {
      const actionName = "unstake.init"
      console.log(`${{ actionName }} called with`, { boid_id, quantity })
      try {
        console.log(`Preparing to create team with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.unstakeinit = {
          boid_id,
          quantity
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
    async unstakeStopAction(boid_id:string):Promise<TransactResult | undefined> {
      const actionName = "unstake.stop"
      console.log(`${{ actionName }} called with`, { boid_id })
      try {
        console.log(`Preparing to create team with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.unstakestop = {
          boid_id
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
    async unstakeEndAction(boid_id:string):Promise<TransactResult | undefined> {
      const actionName = "unstake.end"
      console.log(`${{ actionName }} called with`, { boid_id })
      try {
        console.log(`Preparing to create team with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.unstakestop = {
          boid_id
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
    async withdrawAction(boid_id:string, quantity:number, to:string):Promise<TransactResult | undefined> {
      const actionName = "withdraw"
      console.log(`${{ actionName }} called with`, { boid_id })
      try {
        console.log(`Preparing to create team with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.withdraw = {
          boid_id,
          quantity,
          to
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
    async internalXferAction(boid_id:string, to:string, quantity:number, memo:string):Promise<TransactResult | undefined> {
      const actionName = "internalxfer"
      console.log(`${{ actionName }} called with`, { boid_id })
      try {
        console.log(`Preparing to create team with actionName: ${actionName}`)
        console.log("Session Data Username:", sessionStore.username)
        const action_data:ActionParams.internalxfer = {
          from_boid_id: boid_id,
          to_boid_id: to,
          quantity,
          memo
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
