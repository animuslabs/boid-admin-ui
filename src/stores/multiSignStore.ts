// Importing necessary libraries and functions
import { defineStore } from "pinia"
import { Name } from "@wharfkit/antelope"
import { ref } from "vue"
import { TransactResult, TimePointSec } from "@wharfkit/session"
import { Types } from "src/lib/eosio-msig-contract-telos-mainnet"
import { useSessionStore } from "src/stores/sessionStore"
import { generateRandomName, expDate } from "src/lib/reuseFunctions"
import { createMultiSignAction } from "src/lib/contracts"

const sessionStore = useSessionStore()

// Defining the store
export const multiSignStore = defineStore({
  id: "multiSignStore",

  // Reactive state of the store
  state: () => ({
    loading: false,
    error: ref<string | null>(null)
  }),

  actions: {
    async createProposalAction(
      reqSignAccs:Types.permission_level[], actions:Types.action[]
    ):Promise<TransactResult | undefined> {
      try {
        console.log("Creating action propose with data:", actions)
        const session = sessionStore.session
        if (!session) throw new Error("Session not loaded")
        const proposerAcc = Name.from(sessionStore.username)
        const propName = generateRandomName()
        const expiration = TimePointSec.from(expDate)
        const action_data = Types.propose.from({
          proposer: proposerAcc,
          proposal_name: propName,
          requested: reqSignAccs,
          trx: {
            expiration,
            ref_block_num: 0,
            ref_block_prefix: 0,
            max_net_usage_words: 0,
            max_cpu_usage_ms: 0,
            delay_sec: 0,
            context_free_actions: [],
            actions,
            transaction_extensions: []
          }
        })
        console.log("Expire date:", expDate)
        console.log("Action data prepared:", action_data)
        const result = await createMultiSignAction(action_data)
        console.log("Action created:", result)

        if (!sessionStore.session) {
          console.error("Session is not defined")
          throw new Error("Session is not defined")
        }

        return result
      } catch (error) {
        console.error("Error in createAction:", error)
        throw error
      }
    }

  }

})
