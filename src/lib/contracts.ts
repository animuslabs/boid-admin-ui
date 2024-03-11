import { Name } from "@wharfkit/antelope"
import { useSessionStore } from "src/stores/sessionStore"
import { ActionNameParams, Contract as BoidContract, TableNames, RowType, ActionNames, abi as boidABI } from "src/lib/boid-contract-structure"
import {
  Contract as PayrollContract,
  RowType as RowTypePayroll,
  TableNames as TableNamesPayroll,
  ActionNameParams as ActionNamePayrollParams,
  ActionNames as ActionPayrollNames
} from "src/lib/payroll.boid"
import { Types as TypesMultiSign } from "src/lib/eosio-msig-contract-telos-mainnet"
import { TransactResult, ABI, TimePointSec } from "@wharfkit/session"
import { useSignersStore } from "src/stores/useSignersStore"
import { generateRandomName, expDate, serializeActionData } from "src/lib/reuseFunctions"
import { useApiStore } from "src/stores/apiStore"
import { EventEmitter } from "events"
import { Notify } from "quasar"
import { endpoints } from "src/lib/config"
import { computed } from "vue"

export const notifyEvent = new EventEmitter()

const sessionStore = useSessionStore()
const apiStore = useApiStore()
const signersStore = useSignersStore()

const reqSignAccsConverted = computed(() => signersStore.signers.map(
  (signer) =>
  // eslint-disable-next-line new-cap
    new TypesMultiSign.permission_level({
      actor: Name.from(signer.actor),
      permission: Name.from(signer.permission)
    })
))
// gets the ABI for a given account
const getABI = async(accountName:string) => {
  if (!apiStore.clientAPI) {
    throw new Error("API client is not initialized")
  }
  const abi = await apiStore.clientAPI.v1.chain.get_abi(accountName)
  return abi
}

// custom ABI for wt.boid::transfer
const wtboidTransferabi = ABI.from({
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

export async function fetchDataFromTable<T extends TableNames>(contract:BoidContract, tableName:T):Promise<RowType<T>[] | undefined> {
  try {
    const tableData:RowType<T>[] = await contract.table(tableName).query().all()
    console.log(`Data fetched from ${tableName}:`, tableData)
    return tableData
  } catch (error:any) {
    console.error(`Error fetching data from ${tableName}:`, error)
    throw error
  }
}

export const getAccInfo = async(accountName:string) => {
  if (!apiStore.clientAPI) {
    throw new Error("API client is not initialized")
  }

  const accInfo = await apiStore.clientAPI.v1.chain.get_account(accountName)
  console.log("Account info:", accInfo)
  return accInfo
}

export async function fetchDataFromPayrollTable<T extends TableNamesPayroll>(contract:PayrollContract, tableName:T):Promise<RowTypePayroll<T>[] | undefined> {
  try {
    const tableData:RowTypePayroll<T>[] = await contract.table(tableName).query().all()
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
  let isItMultiSignMode = sessionStore.multiSignState
  try {
    console.log(`Creating action: ${String(actionName)} with data:`, action_data)
    const session = sessionStore.session
    if (!session) throw new Error("Session not loaded")
    const action = apiStore.boidContract.action(actionName, action_data)
    console.log("Action created:", action)

    if (!sessionStore.session) {
      console.error("Session is not defined")
      throw new Error("Session is not defined")
    }
    let result
    if (isItMultiSignMode) {
      // Construct the complete action object
    // eslint-disable-next-line new-cap
      const action = new TypesMultiSign.action({
        account: "boid",
        name: actionName,
        // eslint-disable-next-line new-cap
        authorization: [new TypesMultiSign.permission_level({
          actor: Name.from("boid"),
          permission: Name.from("active")
        })],
        data: action_data
      })
      // If multi-sign mode is enabled, create and execute a multi-sign proposal
      console.log("Executing action in multi-sign mode...")
      result = await createAndExecuteMultiSignProposal(reqSignAccsConverted.value, [action])
    } else {
      // Otherwise, execute a regular transaction
      console.log("Transacting action...")
      result = await session.transact({ action })
    }
    console.log("Transaction result:", result)
    notifyEvent.emit("TrxResult", result)
    return result
  } catch (error) {
    console.error("Error in createAction:", error)
    throw error
  }
}

// Define a type for action descriptors
export type ActionDescriptor = {
  actionName:ActionPayrollNames;
  action_data:ActionNamePayrollParams[ActionPayrollNames];
};

export async function createPayrollActions(
  actionDescriptors:ActionDescriptor[]
):Promise<TransactResult | undefined> {
  console.log("createActions called with", actionDescriptors)
  let isItMultiSignMode = sessionStore.multiSignState

  try {
    const session = sessionStore.session
    if (!session) throw new Error("Session not loaded")

    // Construct actions for session.transact or multi-sign
    const actions = actionDescriptors.map(descriptor => {
      return apiStore.payrollContract.action(descriptor.actionName, descriptor.action_data)
    })

    let result
    if (isItMultiSignMode) {
      // Prepare actions for multi-signature transaction
      const multiSignActions = actionDescriptors.map(descriptor => {
        // eslint-disable-next-line new-cap
        return new TypesMultiSign.action({
          account: "payroll.boid",
          name: descriptor.actionName,
          authorization: [{
            actor: Name.from("payroll.boid"),
            permission: Name.from("owner")
          }],
          data: descriptor.action_data
        })
      })

      console.log("Executing actions in multi-sign mode...")
      result = await createAndExecuteMultiSignProposal(reqSignAccsConverted.value, multiSignActions)
    } else {
      // Execute a regular transaction with the prepared actions
      console.log("Transacting actions...")
      result = await session.transact({ actions })
    }

    console.log("Transaction result:", result)
    notifyEvent.emit("TrxResult", result)
    return result
  } catch (error) {
    console.error("Error in createActions:", error)
    throw error
  }
}


export async function createAndExecuteMultiSignProposal(
  reqSignAccs:TypesMultiSign.permission_level[],
  actions:TypesMultiSign.action[]
):Promise<TransactResult | undefined> {
  try {
    console.log("Creating proposal with data:", actions)

    // Serialize actions if needed
    const serializedActions = await Promise.all(actions.map(async action => {
      let abi
      switch (Name.from(action.account).toString()) {
        case "wt.boid":
          abi = wtboidTransferabi
          break
        case "boid":
          abi = boidABI
          break
        // Add cases for other accounts and their ABIs
        default: {
          // Fetch ABI dynamically for accounts not pre-configured
          const abiAcc = action.account.toString()
          const abiResponse = await getABI(abiAcc)
          if (!abiResponse.abi) {
            throw new Error(`ABI not found for account: ${action.account}`)
          }
          abi = ABI.from(abiResponse.abi)
          if (!abi) {
            throw new Error(`ABI not found for account: ${action.account}`)
          }
          break
        }
      }
      const serializedData = serializeActionData(action, abi)
      return TypesMultiSign.action.from({ ...action, data: serializedData })
    }))

    // Prepare the proposal data
    const session = sessionStore.session
    if (!session) throw new Error("Session not loaded")

    const proposerAcc = Name.from(sessionStore.username)
    const propName = generateRandomName()
    const expiration = TimePointSec.from(expDate)
    const proposalData = TypesMultiSign.propose.from({
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
        actions: serializedActions,
        transaction_extensions: []
      }
    })

    console.log("Proposal data prepared:", proposalData)

    // Execute the transaction
    const action = apiStore.eosioMsigContract.action("propose", proposalData)
    const result = await session.transact({ action })
    console.log("Transaction result:", result)
    return result
  } catch (error) {
    console.error("Error in createAndExecuteProposal:", error)
    throw error
  }
}

export function showNotification(result:TransactResult):void {
  const transactionId = result.response?.transaction_id ?? "unknown"

  if (transactionId === "unknown") {
    // Notification for error case
    Notify.create({
      message: "Failed to process transaction. Transaction ID is unavailable.",
      color: "negative", // Red color for errors
      icon: "mdi-alert-circle",
      position: "bottom",
      timeout: 20000
    })
  } else {
    // Transaction URL
    const transactionUrl = endpoints?.[8]?.[1] + "/transaction/" + transactionId

    // Notification for success case
    Notify.create({
      message: "Trx went through successfully!",
      color: "positive", // Green color for success
      icon: "mdi-check-circle",
      position: "bottom",
      timeout: 20000,
      actions: [
        {
          icon: "link",
          label: "View Transaction",
          handler: () => {
            window.open(transactionUrl, "_blank")
          }
        }
      ]
    })
  }
}


