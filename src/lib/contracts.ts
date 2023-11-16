import { ContractKit, ActionDataType } from "@wharfkit/contract"
import { endpoints } from "./config"
import { APIClient, APIClientOptions } from "@wharfkit/antelope"
import { useSessionStore } from "src/stores/sessionStore"
import { Contract, TableMap } from "src/lib/boid-contract-structure"

const apiClientOptions:APIClientOptions = {
  url: endpoints[2]![1]!
}

const contractKit = new ContractKit({
  client: new APIClient(apiClientOptions)
})

const sessionStore = useSessionStore()
export const boid = new Contract(contractKit) // boid contract instance

export async function fetchDataFromTable<T extends keyof typeof TableMap>(tableName:T):Promise<typeof TableMap[T][] | undefined> {
  try {
    const tableData:typeof TableMap[T][] = await boid.table(tableName).query().all()
    console.log(`Data fetched from ${tableName}:`, tableData)
    return tableData
  } catch (error:any) {
    console.error(`Error fetching data from ${tableName}:`, error)
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
