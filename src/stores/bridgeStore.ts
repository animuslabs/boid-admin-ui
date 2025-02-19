import { acceptHMRUpdate, defineStore } from "pinia"
import { createEvmBoidActions } from "src/lib/contracts"
import { ActionParams as ActionParamsEvmBoid } from "src/lib/evm.boid"
import { Ref, ref } from "vue"
import { TransactResult } from "@wharfkit/session"
import { useSessionStore } from "src/stores/sessionStore"
import { useApiStore } from "src/stores/apiStore"

const sessionStore = useSessionStore()
const apiStore = useApiStore()
// Defining the store
export const useBridgeStore = defineStore({
  id: "bridgeStore",

  // Reactive state of the store
  state: () => ({
    loading: false,
    error: ref<string | null>(null)
  }),

  getters: {},

  actions: {
    async createRemoveRequestAction(data:ActionParamsEvmBoid.rmreq):Promise<TransactResult | undefined> {
      try {
        console.log("Session Data Username:", sessionStore.username)
        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }
        const result = await createEvmBoidActions([{ actionName: "rmreq", action_data: data }])
        console.log("Action Sent:", result)
      } catch (error:any) {
        console.error("createRemoveRequestAction Error:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    },
    async createRefundStuckRequestAction():Promise<TransactResult | undefined> {
      try {
        console.log("Session Data Username:", sessionStore.username)
        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }
        const result = await createEvmBoidActions([{ actionName: "refstuckreq", action_data: {} }])
        console.log("Action Sent:", result)
      } catch (error:any) {
        console.error("createRefundStuckRequestAction Error:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    },
    async createClearFailReqAction():Promise<TransactResult | undefined> {
      try {
        console.log("Session Data Username:", sessionStore.username)
        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }
        const result = await createEvmBoidActions([{ actionName: "clrfailedreq", action_data: {} }])
        console.log("Action Sent:", result)
      } catch (error:any) {
        console.error("createClearFailReqAction Error:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    },
    async createRemoveRequestEVMAction(data:ActionParamsEvmBoid.rmreqonevm):Promise<TransactResult | undefined> {
      try {
        console.log("Session Data Username:", sessionStore.username)
        if (!sessionStore || !sessionStore.username) {
          console.error("Session or session actor is not defined")
          throw new Error("Session or session actor is not defined")
        }
        const result = await createEvmBoidActions([{ actionName: "rmreqonevm", action_data: data }])
        console.log("Action Sent:", result)
      } catch (error:any) {
        console.error("createRemoveRequestEVMAction Error:", error)
        this.$patch({ error: error.message })
        return undefined
      }
    }
  }
}
)
// this will make the store hot reload during development
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBridgeStore, import.meta.hot))
}
