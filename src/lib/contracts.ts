import { ContractKit } from "@wharfkit/contract"
import { endpoints } from "./config"
import { APIClient, APIClientOptions, Name } from "@wharfkit/antelope"
import { useSessionStore } from "src/stores/sessionStore"
import { ActionNameParams, Contract, TableNames, RowType, ActionNames } from "src/lib/boid-contract-structure"
import { Action, TransactResult } from "@wharfkit/session"

const apiClientOptions:APIClientOptions = {
  url: endpoints[2]![1]!
}

const contractKit = new ContractKit({
  client: new APIClient(apiClientOptions)
})

const sessionStore = useSessionStore()
export const boid = new Contract(contractKit) // boid contract instance

export async function fetchDataFromTable<T extends TableNames>(tableName:T):Promise<RowType<T>[] | undefined> {
  try {
    const tableData:RowType<T>[] = await boid.table(tableName).query().all()
    console.log(`Data fetched from ${tableName}:`, tableData)
    return tableData
  } catch (error:any) {
    console.error(`Error fetching data from ${tableName}:`, error)
    throw error
  }
}

export async function createAction<A extends ActionNames>(
  actionName:A,
  action_data:ActionNameParams[A]
):Promise<TransactResult | undefined> {
  console.log("createAction called with", { actionName, action_data })

  try {
    console.log(`Creating action: ${String(actionName)} with data:`, action_data)
    const session = sessionStore.session
    if (!session) throw new Error("Session not loaded")
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

export async function createAction2<A extends ActionNames>(
  actionName:A,
  action_data:ActionNameParams[A]
):Promise<TransactResult | undefined> {
  console.log("createAction called with", { actionName, action_data })

  try {
    console.log(`Creating action: ${String(actionName)} with data:`, action_data)
    const session = sessionStore.session
    if (!session) throw new Error("Session not loaded")
    const authorization = [sessionStore.authorization]
    // Ensure that account and name are Name instances
    const accountName = Name.from(sessionStore.username)
    const actionNameName = Name.from(actionName)

    // Create the action object
    const action = Action.from({
      account: accountName,
      name: actionNameName,
      authorization,
      data: action_data
    })
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
