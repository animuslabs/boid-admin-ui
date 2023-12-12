import { ContractKit } from "@wharfkit/contract"
import { APIClient, APIClientOptions, Name } from "@wharfkit/antelope"
import { useSessionStore } from "src/stores/sessionStore"
import { ActionNameParams, Contract as BoidContract, TableNames, RowType, ActionNames } from "src/lib/boid-contract-structure"
import { Contract as EosioMsigContract, Types as TypesMultiSign } from "src/lib/eosio-msig-contract-telos-mainnet"
import { Action, TransactResult, ABI } from "@wharfkit/session"

const sessionStore = useSessionStore()
// this gets the chain API URL from the active session from the sessionStore
const url = sessionStore.chainUrl
const apiClientOptions:APIClientOptions = { url }
console.log("chain API URL:", apiClientOptions.url)
const contractKit = new ContractKit({
  client: new APIClient(apiClientOptions)
})


export const boid = new BoidContract(contractKit)

export const eosioMsig = new EosioMsigContract(contractKit)

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


export async function createMultiSignAction(
  action_data:TypesMultiSign.propose
):Promise<TransactResult | undefined> {
  console.log("createAction called with propose", { action_data })

  try {
    console.log("Creating action: propose with data:", action_data)
    const session = sessionStore.session
    if (!session) throw new Error("Session not loaded")
    const authorization = [sessionStore.authorization]
    const action = eosioMsig.action("propose", action_data)
    // const action = Action.from({
    //   account: "eosio.msig",
    //   name: "propose",
    //   authorization,
    //   data: action_data
    // })
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

export const wtboidTransferabi = ABI.from({
  structs: [
    {
      name: "transfer",
      base: "",
      fields: [
        {
          name: "from",
          type: "name"
        },
        {
          name: "to",
          type: "name"
        },
        {
          name: "quantity",
          type: "asset"
        },
        {
          name: "memo",
          type: "string"
        }
      ]
    }]
})
