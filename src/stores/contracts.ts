import { ContractKit, Table } from "@wharfkit/contract"
import { endpoints, networks } from "./config"
import { SessionKit } from "@wharfkit/session"
import { WebRenderer } from "@wharfkit/web-renderer"
import { WalletPluginAnchor } from "@wharfkit/wallet-plugin-anchor"
import { APIClient, APIClientOptions } from "@wharfkit/antelope"
import { Types } from "../lib/boid-contract-structure"

// const webRenderer = new WebRenderer()

// const sessionKit = new SessionKit({
//   appName: "boidadmin",
//   chains: [
//     {
//       id: networks[1]!.chainId,
//       url: endpoints[2]![1]!
//     }
//   ],
//   ui: webRenderer,
//   walletPlugins: [new WalletPluginAnchor()]
// })

// const { session } = await sessionKit.login()

const apiClientOptions:APIClientOptions = {
  url: endpoints[2]![1]!
}

const contractKit = new ContractKit({
  client: new APIClient(apiClientOptions)
})

export async function getTableData(
  contractName:string,
  table:string,
  scope:string
) {
  const contract = await contractKit.load(contractName)
  // console.log("this is contract data:", contract)
  const tableData = await contract.table(table, scope).query().all()
  // console.log("this is table data:", tableData)
  return tableData
}
