import { ContractKit, ActionDataType } from "@wharfkit/contract"
import { endpoints } from "./config"
import { APIClient, APIClientOptions, Action } from "@wharfkit/antelope"
import { useSessionStore } from "../stores/sessionStore"

const apiClientOptions:APIClientOptions = {
  url: endpoints[2]![1]!
}

const contractKit = new ContractKit({
  client: new APIClient(apiClientOptions)
})

const sessionStore = useSessionStore()

export async function getTableData(
  contractName:string,
  table:string,
  scope:string
) {
  try {
    const contract = await contractKit.load(contractName)
    const tableData = await contract.table(table, scope).query().all()
    return tableData
  } catch (error) {
    console.error("Error in getTableData:", error)
    throw error
  }
}

export async function createAction(
  contractName:string,
  actionName:string,
  action_data:ActionDataType
) {
  console.log("createAction called with", { contractName, actionName, action_data })

  try {
    console.log(`Loading contract: ${contractName}`)
    const contract = await contractKit.load(contractName)
    console.log("Contract loaded:", contract)

    console.log(`Creating action: ${actionName} with data:`, action_data)
    const action = contract.action(actionName, action_data)
    console.log("Action created:", action)

    if (!sessionStore.session) {
      console.error("Session is not defined")
      throw new Error("Session is not defined")
    }

    console.log("Transacting action...")
    const result = await sessionStore.session.transact({ action })
    console.log("Transaction result:", result)

    return result
  } catch (error) {
    console.error("Error in createAction:", error)
    throw error
  }
}
