import { ContractKit, ActionDataType } from "@wharfkit/contract"
import { endpoints } from "./config"
import { APIClient, APIClientOptions } from "@wharfkit/antelope"
import { useSessionStore } from "src/stores/sessionStore"
import { ActionNameParams, Contract, TableMap } from "src/lib/boid-contract-structure"
import { TransactResult } from "@wharfkit/session"

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

export async function createAction<T extends keyof ActionNameParams>(
  actionName:T,
  action_data:ActionNameParams[T]
):Promise<TransactResult | undefined> {
  console.log("createAction called with", { actionName, action_data })

  try {
    console.log(`Creating action: ${actionName} with data:`, action_data)
    const action = boid.action(actionName, action_data)
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
