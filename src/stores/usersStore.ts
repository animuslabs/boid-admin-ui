// Importing necessary libraries and functions
import { defineStore } from "pinia"
import { getTableData } from "../lib/contracts"
import { Types } from "../lib/boid-contract-structure"
import { Ref, ref } from "vue"
import { contractName, tables } from "../lib/config"
import { Bytes } from "@wharfkit/antelope"
import { ParsedAccountMeta, AccountRowData, TeamMeta, AccountMeta } from "../lib/types"

export async function bytesToJson<T>(bytes:Bytes):Promise<T> {
  try {
    // Step 1: Decode bytes to string
    const decoder = new TextDecoder() // Assumes UTF-8 encoding
    const jsonString = decoder.decode(bytes.array)

    // Step 2: Parse string to JSON
    const data = JSON.parse(jsonString)

    return data
  } catch (error) {
    console.error("Error converting bytes to JSON:", error)
    throw new Error("Error converting bytes to JSON" + error)
  }
}

const normalizeArr = (arr:[string, string][] | undefined) => {
  let obj:Record<string, string> = {}
  if (arr) { // Check if arr is defined before calling forEach
    arr.forEach(el => {
      obj[el[0]] = el[1]
    })
  }
  return obj
}

function parseAccountMeta(meta:AccountMeta | undefined):ParsedAccountMeta {
  let parsed = new ParsedAccountMeta()

  // Check if meta is defined before accessing its properties
  if (meta) {
    parsed.text = Object.assign(parsed.text, normalizeArr(meta.text))
    parsed.media = Object.assign(parsed.media, normalizeArr(meta.media))
  }

  return parsed
}

// Defining the store
export const userStore = defineStore({
  id: "usersStore",

  // Reactive state of the store
  state: () => ({
    organizedDataRaw: ref([]) as Ref<AccountRowData[]>,
    loading: false,
    error: ref<string | null>(null)
  }),

  // Getters for computed values based on state
  getters: {
    organizedData(state) {
      return state.organizedDataRaw
    },
    isLoading(state) {
      return state.loading
    },
    error(state) {
      return state.error
    }
  },

  actions: {
    async fetchAccTableData():Promise<AccountRowData[] | undefined> {
      console.log("fetchAccTableData called")
      this.$patch({ loading: true, error: null })
      try {
        const dataAcc:Types.Account[] = await getTableData(contractName, tables[0] as string, contractName)
        console.log("dataAcc:", dataAcc)
        const dataAccMeta:Types.AcctMeta[] = await getTableData(contractName, tables[1] as string, contractName)
        console.log("dataAccMeta:", dataAccMeta)

        // Create a map to link boid_id with its meta data
        const metaMap = new Map<string, Types.AcctMeta>()
        dataAccMeta.forEach(acctMeta => {
          metaMap.set(acctMeta.boid_id.toString(), acctMeta)
        })
        async function convertAcctMetaToAccountMeta(acctMeta:Types.AcctMeta | undefined):Promise<AccountMeta | undefined> {
          if (!acctMeta?.meta) return undefined
          try {
            // Use the bytesToJson function to convert Bytes to JSON
            const json = await bytesToJson<any>(acctMeta.meta)

            // Now json should be in the format that AccountMeta expects
            // You need to make sure that the JSON has the correct structure
            return {
              links: json.links || [],
              media: json.media || [],
              text: json.text || [],
              extra: json.extra || []
            }
          } catch (error) {
            console.error("Error parsing AcctMeta data:", error)
            return undefined
          }
        }
        const organizedDataRaw:AccountRowData[] = await Promise.all(dataAcc.map(async(account) => {
          try {
            const boidIdStr = account.boid_id.toString()
            // Retrieve the meta data from the map using boid_id
            const acctMeta = metaMap.get(boidIdStr)
            // If there is a corresponding meta data, convert and parse it; otherwise, set to null or default
            const meta = acctMeta ? await convertAcctMetaToAccountMeta(acctMeta) : null
            const parsedMeta = meta ? parseAccountMeta(meta) : new ParsedAccountMeta() // Handle null meta by providing a default

            const authKeysString = account.auth.keys.join(", ")

            return {
              boid_id: boidIdStr,
              owners: Array.isArray(account.owners) ? account.owners.join(", ") : "",
              auth_keys: authKeysString,
              meta: parsedMeta // Use the parsed meta or the default if meta was null
            }
          } catch (error) {
            console.error(`Error processing account ${account.boid_id}:`, error)
            return {
              boid_id: account.boid_id.toString(),
              owners: Array.isArray(account.owners) ? account.owners.join(", ") : "",
              auth_keys: account.auth.keys.join(", "),
              meta: new ParsedAccountMeta() // Provide a default ParsedAccountMeta in case of error
            }
          }
        }))

        this.$patch({
          organizedDataRaw
        })
        console.log("Organized Data:", organizedDataRaw)
        return organizedDataRaw
      } catch (error:any) {
        console.error("Error fetching account table data:", error)
        this.$patch({ error: error.message })
      } finally {
        this.$patch({ loading: false })
      }
    }
  }

})
