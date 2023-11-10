import { ContractKit, Table } from "@wharfkit/contract"
import { endpoints } from "./config"
import { APIClient, APIClientOptions } from "@wharfkit/antelope"
import { Types } from "./boid-contract-structure"

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
