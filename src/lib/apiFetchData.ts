import { useApiStore } from "src/stores/apiStore"

export async function fetchDataFromEndpoints(endpointsArray:string[][], chainName:string):Promise<void> {
  const store = useApiStore()
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
