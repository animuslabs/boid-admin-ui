// Importing necessary libraries and functions
import { defineStore } from "pinia"
import { getTableData } from "../lib/contracts"
import { Types, Team } from "../lib/boid-contract-structure"
import { Ref, ref } from "vue"
import { contractName, tables } from "../lib/config"
import { Bytes } from "@wharfkit/antelope"
import { ParsedAccountMeta, AccountRowData, TeamMeta, AccountMeta } from "../lib/types"

async function bytesToJson<T>(bytes:Bytes):Promise<T> {
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
export const useTeamStore = defineStore({
  id: "teamStore",

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
        const dataTeams:Types.Team[] = await getTableData(contractName, tables[2] as string, contractName)
        console.log("dataTeams:", dataTeams)

        return
      } catch (error:any) {
        console.error("Error fetching account table data:", error)
        this.$patch({ error: error.message })
      } finally {
        this.$patch({ loading: false })
      }
    }
  }

})
