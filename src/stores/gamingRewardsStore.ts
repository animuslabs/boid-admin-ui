import { acceptHMRUpdate, defineStore } from "pinia"
import { createScoresBoidActions, fetchDataFromScoresBoidTable } from "src/lib/contracts"
import { Types, ActionParams, Contract as ScoresBoidContract } from "src/lib/gaming/scores.boid"
import { Ref, ref } from "vue"
import { TransactResult } from "@wharfkit/session"
import { useSessionStore } from "src/stores/sessionStore"
import { useApiStore } from "src/stores/apiStore"

const sessionStore = useSessionStore()
const apiStore = useApiStore()
// Defining the store
export const useGamingRewardsStore = defineStore({
  id: "gamingRewardsStore",

  // Reactive state of the store
  state: () => ({
    loading: false,
    error: ref<string | null>(null),
    rewardsRecorded: ref([]) as Ref<Types.rewardsrecorded[] | null>,
    gameRecords: ref([]) as Ref<Types.gamerecords[] | null>,
    config: ref(null) as Ref<{
      gameConfig: Types.gameconfig[] | null;
      globalConfig: Types.globalconfig[] | null;
      rewardDist: Types.rewarddistconfig[] | null;
      tokenConfig: Types.tokenconfig[] | null;
    } | null>
  }),

  // Getters for computed values based on state
  getters: {},

  actions: {
    async fetchConfig() {
      this.$patch({ loading: true, error: null })
      try {
        const contract = apiStore.scoresBoidContract
        const gameConfigData = await fetchDataFromScoresBoidTable(contract as ScoresBoidContract, "gameconfig")
        const globalConfigData = await fetchDataFromScoresBoidTable(contract as ScoresBoidContract, "globalconfig")
        const rewardDistData = await fetchDataFromScoresBoidTable(contract as ScoresBoidContract, "rewarddist")
        const tokenConfigData = await fetchDataFromScoresBoidTable(contract as ScoresBoidContract, "tokenconfig")
        const configData = {
          gameConfig: gameConfigData || null,
          globalConfig: globalConfigData || null,
          rewardDist: rewardDistData || null,
          tokenConfig: tokenConfigData || null
        }
        this.config = configData
        console.log("Config data fetched:", configData)
        return configData
      } catch (error:any) {
        console.error("Error fetching config data:", error)
        this.$patch({ error: error.message })
      } finally {
        this.$patch({ loading: false })
      }
    },
    async fetchGameRecords() {
      this.$patch({ loading: true, error: null })
      try {
        const contract = apiStore.scoresBoidContract
        const gameRecordsData = await fetchDataFromScoresBoidTable(contract as ScoresBoidContract, "gamerecords")
        console.log("Game Records data fetched:", gameRecordsData)
        this.gameRecords = gameRecordsData || null
      } catch (error:any) {
        console.error("Error fetching config data:", error)
        this.$patch({ error: error.message })
      } finally {
        this.$patch({ loading: false })
      }
    },
    async fetchRewardsRecorded() {
      this.$patch({ loading: true, error: null })
      try {
        const contract = apiStore.scoresBoidContract
        const rewardRecData = await fetchDataFromScoresBoidTable(contract as ScoresBoidContract, "rewardsrec")
        console.log("Rewards Recorded data fetched:", rewardRecData)
        this.rewardsRecorded = rewardRecData || null
      } catch (error:any) {
        console.error("Error fetching config data:", error)
        this.$patch({ error: error.message })
      } finally {
        this.$patch({ loading: false })
      }
    },
      async createInitiateContractAction(data:ActionParams.initcontract):Promise<TransactResult | undefined> {
        try {
          console.log("Session Data Username:", sessionStore.username)
          if (!sessionStore || !sessionStore.username) {
            console.error("Session or session actor is not defined")
            throw new Error("Session or session actor is not defined")
          }
          const result = await createScoresBoidActions([{ actionName: "initcontract", action_data: data }])
          console.log("Action Sent:", result)
        } catch (error:any) {
          console.error("createConfigSetAction Error:", error)
          this.$patch({ error: error.message })
          return undefined
        }
      },
      async createSetGameAction(data:ActionParams.setgame):Promise<TransactResult | undefined> {
        try {
          console.log("Session Data Username:", sessionStore.username)
          if (!sessionStore || !sessionStore.username) {
            console.error("Session or session actor is not defined")
            throw new Error("Session or session actor is not defined")
          }
          const result = await createScoresBoidActions([{ actionName: "setgame", action_data: data }])
          console.log("Action Sent:", result)
        } catch (error:any) {
          console.error("createConfigSetAction Error:", error)
          this.$patch({ error: error.message })
          return undefined
        }
      },
      async createRemoveGameAction(data:ActionParams.removegame):Promise<TransactResult | undefined> {
        try {
          console.log("Session Data Username:", sessionStore.username)
          if (!sessionStore || !sessionStore.username) {
            console.error("Session or session actor is not defined")
            throw new Error("Session or session actor is not defined")
          }
          const result = await createScoresBoidActions([{ actionName: "removegame", action_data: data }])
          console.log("Action Sent:", result)
        } catch (error:any) {
          console.error("createConfigSetAction Error:", error)
          this.$patch({ error: error.message })
          return undefined
        }
      },
      async createSetTokenAction(data:ActionParams.settoken):Promise<TransactResult | undefined> {
        try {
          console.log("Session Data Username:", sessionStore.username)
          if (!sessionStore || !sessionStore.username) {
            console.error("Session or session actor is not defined")
            throw new Error("Session or session actor is not defined")
          }
          const result = await createScoresBoidActions([{ actionName: "settoken", action_data: data }])
          console.log("Action Sent:", result)
        } catch (error:any) {
          console.error("createConfigSetAction Error:", error)
          this.$patch({ error: error.message })
          return undefined
        }
      },
      async createRecordGameAction(data:ActionParams.recordgame):Promise<TransactResult | undefined> {
        try {
          console.log("Session Data Username:", sessionStore.username)
          if (!sessionStore || !sessionStore.username) {
            console.error("Session or session actor is not defined")
            throw new Error("Session or session actor is not defined")
          }
          const result = await createScoresBoidActions([{ actionName: "recordgame", action_data: data }])
          console.log("Action Sent:", result)
        } catch (error:any) {
          console.error("createConfigSetAction Error:", error)
          this.$patch({ error: error.message })
          return undefined
        }
      },
      async createRemoveTokenAction(data:ActionParams.removetoken):Promise<TransactResult | undefined> {
        try {
          console.log("Session Data Username:", sessionStore.username)
          if (!sessionStore || !sessionStore.username) {
            console.error("Session or session actor is not defined")
            throw new Error("Session or session actor is not defined")
          }
          const result = await createScoresBoidActions([{ actionName: "removetoken", action_data: data }])
          console.log("Action Sent:", result)
        } catch (error:any) {
          console.error("createConfigSetAction Error:", error)
          this.$patch({ error: error.message })
          return undefined
        }
      },
      async createClearRecordAction(data:ActionParams.clearrecord):Promise<TransactResult | undefined> {
        try {
          console.log("Session Data Username:", sessionStore.username)
          if (!sessionStore || !sessionStore.username) {
            console.error("Session or session actor is not defined")
            throw new Error("Session or session actor is not defined")
          }
          const result = await createScoresBoidActions([{ actionName: "clearrecord", action_data: data }])
          console.log("Action Sent:", result)
        } catch (error:any) {
          console.error("createConfigSetAction Error:", error)
          this.$patch({ error: error.message })
          return undefined
        }
      },
      async createSetDistConfigAction(data:ActionParams.setdistconf):Promise<TransactResult | undefined> {
        try {
          console.log("Session Data Username:", sessionStore.username)
          if (!sessionStore || !sessionStore.username) {
            console.error("Session or session actor is not defined")
            throw new Error("Session or session actor is not defined")
          }
          const result = await createScoresBoidActions([{ actionName: "setdistconf", action_data: data }])
          console.log("Action Sent:", result)
        } catch (error:any) {
          console.error("createConfigSetAction Error:", error)
          this.$patch({ error: error.message })
          return undefined
        }
      },
      async createRemoveDistConfigAction(data:ActionParams.rmdistconf):Promise<TransactResult | undefined> {
        try {
          console.log("Session Data Username:", sessionStore.username)
          if (!sessionStore || !sessionStore.username) {
            console.error("Session or session actor is not defined")
            throw new Error("Session or session actor is not defined")
          }
          const result = await createScoresBoidActions([{ actionName: "rmdistconf", action_data: data }])
          console.log("Action Sent:", result)
        } catch (error:any) {
          console.error("createConfigSetAction Error:", error)
          this.$patch({ error: error.message })
          return undefined
        }
      },
      async createDistributeAction(data:ActionParams.distribute):Promise<TransactResult | undefined> {
        try {
          console.log("Session Data Username:", sessionStore.username)
          if (!sessionStore || !sessionStore.username) {
            console.error("Session or session actor is not defined")
            throw new Error("Session or session actor is not defined")
          }
          const result = await createScoresBoidActions([{ actionName: "distribute", action_data: data }])
          console.log("Action Sent:", result)
        } catch (error:any) {
          console.error("createConfigSetAction Error:", error)
          this.$patch({ error: error.message })
          return undefined
        }
      }
  }
}
)
// this will make the store hot reload during development
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGamingRewardsStore, import.meta.hot))
}
