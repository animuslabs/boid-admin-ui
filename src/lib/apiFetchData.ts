import { useApiStore } from "src/stores/apiStore"
const store = useApiStore()

export async function fetchDataFromEndpoints(endpointsArray:string[][], chainName:string):Promise<void> {
  const apiPath = "/v1/chain/get_info"
  const timeoutDuration = 3000 //  3 seconds

  for (const endpoint of endpointsArray) {
    const [nodeName, baseUrl] = endpoint
    if (!baseUrl || typeof nodeName !== "string") continue

    const fullUrl = baseUrl + apiPath
    console.log(`Fetching data from: ${fullUrl}`)
    const startTime = performance.now()

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeoutDuration)
      )
      const fetchPromise = fetch(fullUrl).then(response => response.json())

      const data = await Promise.race([fetchPromise, timeoutPromise])
      const endTime = performance.now()

      store.setResponse(nodeName, {
        chain: chainName,
        node_name: nodeName,
        url: baseUrl,
        chain_id: data.chain_id,
        server_version_string: data.server_version_string,
        head_block_time: data.head_block_time,
        duration: endTime - startTime,
        success: true
      })
    } catch (error) {
      const endTime = performance.now()
      console.error(`Error fetching data from ${baseUrl} (${nodeName}):`, error)

      // Storing only basic information with success as false
      store.setResponse(nodeName, {
        chain: chainName,
        node_name: nodeName,
        url: baseUrl,
        duration: endTime - startTime,
        success: false
      })
    } console.log(`Completed fetching from: ${baseUrl}`)
  }
}

export const getAccInfo = async(accountName:string) => {
  if (!store.clientAPI) {
    throw new Error("API client is not initialized")
  }

  const accInfo = await store.clientAPI.v1.chain.get_account(accountName)
  console.log("Account info:", accInfo)
  return accInfo
}

export const getTokenBalance = async(accountName:string, tokenContractName:string, tokenSymbol:string) => {
  if (!store.clientAPI) {
    throw new Error("API client is not initialized")
  }

  const balance = await store.clientAPI.v1.chain.get_currency_balance(tokenContractName, accountName, tokenSymbol)
  console.log(`Account ${accountName} balance: ${balance} ${tokenSymbol}`)
  return balance
}
