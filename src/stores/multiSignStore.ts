// Importing necessary libraries and functions
import { defineStore } from "pinia"
import { APIClient, APIClientOptions, Name } from "@wharfkit/antelope"
import { ref } from "vue"
import { TransactResult } from "@wharfkit/session"
import { ContractKit } from "@wharfkit/contract"
import { Contract, Types } from "src/lib/eosio-msig-contract-structure"
import { endpoints } from "src/lib/config"
import { useSessionStore } from "src/stores/sessionStore"
import { generateRandomName, expDate } from "src/lib/reuseFunctions"

// const sessionStore = useSessionStore()
// const contractKit = sessionStore.contractKit
// const multiSignContract = new Contract(contractKit) // boid contract instance

// export const accountInfo = await contractKit.client.v1.chain.get_account(Name.from("eosio.msig"))


// // Defining the store
// export const multiSignStore = defineStore({
//   id: "multiSignStore",

//   // Reactive state of the store
//   state: () => ({
//     loading: false,
//     error: ref<string | null>(null)
//   }),

//   // Getters for computed values based on state
//   getters: {
//     isLoading(state) {
//       return state.loading
//     },
//     stateError(state) {
//       return state.error
//     }
//   },

//   actions: {
//     async createMultiSignAction(
//       reqSignAccs:Types.permission_level[], serialized_action_data:Types.action[]
//     ):Promise<TransactResult | undefined> {
//       try {
//         console.log("Creating action propose with data:", serialized_action_data)
//         const session = sessionStore.session
//         if (!session) throw new Error("Session not loaded")
//         const proposerAcc = Name.from(sessionStore.username)
//         const propName = generateRandomName()
//         // eslint-disable-next-line new-cap
//         const trx = new Types.transaction({
//           context_free_actions: [],
//           actions: serialized_action_data,
//           transaction_extensions: []
//         })

//         const action = multiSignContract.action("propose", {
//           proposer: proposerAcc,
//           proposal_name: propName,
//           requested: reqSignAccs,
//           trx
//         })
//         console.log("Action created:", action)

//         if (!sessionStore.session) {
//           console.error("Session is not defined")
//           throw new Error("Session is not defined")
//         }

//         console.log("Transacting action...")
//         const result = await sessionStore.session.transact({ action })
//         console.log("Transaction result:", result)

//         return result
//       } catch (error) {
//         console.error("Error in createAction:", error)
//         throw error
//       }
//     }

//   }

// })
