import { defineStore } from "pinia"
import { ref } from "vue"
import { fetchDataFromPayrollTable, createPayrollActions, ActionDescriptor } from "src/lib/contracts"
import { TransactResult } from "@wharfkit/session"
import { useSessionStore } from "src/stores/sessionStore"
import { Types as TypesPayroll, Contract as PayrollContract, ActionParams as ActionParamsPayroll } from "src/lib/payroll.boid"
import { useApiStore } from "src/stores/apiStore"
import { UInt64Type, UInt32Type, NameType, BytesType, Asset } from "@wharfkit/antelope"

const sessionStore = useSessionStore()
const apiStore = useApiStore()

export const usePayrollStore = defineStore({
  id: "payrollStore",

  // Reactive state of the store
  state: () => ({
    loading: false,
    error: ref<string | null>(null),
    actionDescriptors: ref<ActionDescriptor[]>([]),
    tokenswlData: ref<TypesPayroll.TokensWhitelist[]>([])
  }),

  // Getters for computed values based on state
  getters: {
    isLoading(state) {
      return state.loading
    },
    getDescriptors(state) {
      console.log("getDescriptors called", state.actionDescriptors)
      return state.actionDescriptors
    },
    getTokenSymbolList(state) {
      if (state.tokenswlData) {
        const symbolsList = state.tokenswlData.map(token => token.sym.code.toString())
        console.log("tokensData: ", symbolsList)
        return symbolsList
      } else {
        console.error("No token data found")
        return []
      }
    },
    errors(state) {
      return state.error
    }
  },

  actions: {
    async fetchPayrollsTableData():Promise<TypesPayroll.Payroll[] | undefined> {
      console.log("fetchPayrollsTableData called")
      this.$patch({ loading: true, error: null })
      const contract = apiStore.payrollContract
      try {
        const payrollsResult = await fetchDataFromPayrollTable(contract as PayrollContract, "payrolls")
        if (!payrollsResult) {
          // Handle the case when one of the fetches returns undefined
          console.error("Failed to fetch data")
          this.$patch({ error: "Failed to fetch data" })
          return
        }

        const dataBoosters:TypesPayroll.Payroll[] = payrollsResult as unknown as TypesPayroll.Payroll[]
        console.log("BoostersData", dataBoosters)

        return dataBoosters
      } catch (error:any) {
        console.error("Error fetching payroll table data:", error)
        this.$patch({ error: error.message })
      } finally {
        this.$patch({ loading: false })
      }
    },
    async fetchtokenwlTableData():Promise<TypesPayroll.TokensWhitelist[] | undefined> {
      console.log("fetchPayrollsTableData called")
      this.$patch({ loading: true, error: null })
      const contract = apiStore.payrollContract
      try {
        const payrollsResult = await fetchDataFromPayrollTable(contract as PayrollContract, "tokenwl")
        if (!payrollsResult) {
          // Handle the case when one of the fetches returns undefined
          console.error("Failed to fetch data")
          this.$patch({ error: "Failed to fetch data" })
          return
        }

        const tokenwlData:TypesPayroll.TokensWhitelist[] = payrollsResult as unknown as TypesPayroll.TokensWhitelist[]
        this.tokenswlData = tokenwlData
        console.log("tokenwlData", tokenwlData)

        return tokenwlData
      } catch (error:any) {
        console.error("Error fetching tokenwl table data:", error)
        this.$patch({ error: error.message })
      } finally {
        this.$patch({ loading: false })
      }
    },
    addDescriptor(descriptor:ActionDescriptor) {
      this.actionDescriptors.push(descriptor)
    },
    editDescriptor(index:number, descriptor:ActionDescriptor) {
      // Check if the index is within the bounds of the array
      if (index >= 0 && index < this.actionDescriptors.length) {
        // Update the descriptor at the specified index
        this.actionDescriptors[index] = descriptor
      } else {
        console.error("Descriptor at the specified index does not exist.")
      }
    },
    removeDescriptor(index:number) {
      // Check if the index is within the bounds of the array
      if (index >= 0 && index < this.actionDescriptors.length) {
        // Remove the descriptor at the specified index
        this.actionDescriptors.splice(index, 1)
      } else {
        console.error("Descriptor at the specified index does not exist.")
      }
    },
    addPayrollAction(payrollConfig:ActionParamsPayroll.Type.PayrollConfig) {
      const descriptor:ActionDescriptor = {
        actionName: "payroll.add",
        action_data: { payrollConfig }
      }
      this.actionDescriptors.push(descriptor)
    },

    editPayrollAction(payrollId:UInt64Type, pause:boolean, minClaimFrequencySec:UInt32Type, receiverAccount:NameType, treasuryAccount:NameType, meta:BytesType) {
      const descriptor:ActionDescriptor = {
        actionName: "payroll.edit",
        action_data: { payrollId, pause, minClaimFrequencySec, receiverAccount, treasuryAccount, meta }
      }
      this.actionDescriptors.push(descriptor)
    },

    payPayrollAction(payrollId:UInt64Type) {
      const descriptor:ActionDescriptor = {
        actionName: "payroll.pay",
        action_data: { payrollId }
      }
      this.actionDescriptors.push(descriptor)
    },

    removePayrollAction(payrollId:UInt64Type) {
      const descriptor:ActionDescriptor = {
        actionName: "payroll.rm",
        action_data: { payrollId }
      }
      this.actionDescriptors.push(descriptor)
    },

    addTokenWlAction(sym:Asset.SymbolType, contract:NameType) {
      const descriptor:ActionDescriptor = {
        actionName: "tokenwl.add",
        action_data: { sym, contract }
      }
      this.actionDescriptors.push(descriptor)
    },

    removeTokenWlAction(sym:Asset.SymbolCode) {
      const descriptor:ActionDescriptor = {
        actionName: "tokenwl.rm",
        action_data: { sym }
      }
      this.actionDescriptors.push(descriptor)
    },
    async executeAllActions():Promise<TransactResult | undefined> {
      if (!sessionStore || !sessionStore.username) {
        console.error("Session or session actor is not defined")
        throw new Error("Session or session actor is not defined")
      }
      if (this.actionDescriptors.length > 0) {
        try {
          const result = await createPayrollActions(this.actionDescriptors as ActionDescriptor[])
          console.log("Executed all actions with result:", result)
          this.actionDescriptors = [] // Clear the actions after execution
          return result
        } catch (error:any) {
          console.error("Error executing actions:", error)
          // Handle the error, e.g., by updating the store's error state
          this.$patch({ error: error.message || "An error occurred during action execution." })
          return undefined
        }
      } else {
        console.log("No actions to execute.")
        return undefined
      }
    }


  }

})
