import { defineStore } from "pinia"
import { TelosEndpoints, EOSendpoints, TelosTestnetEndpoints, ipfsEndpoints, trpcEndpoints } from "src/lib/config"
import { APIClient } from "@wharfkit/antelope"
import { Contract as BoidContract } from "src/lib/boid-contract-structure"
import { Contract as EosioMsigContract } from "src/lib/eosio-msig-contract-telos-mainnet"
import { Contract as PayrollContract } from "src/lib/payroll.boid"
import { ContractFactory } from "src/types/types-stores"
import { createTRPCProxyClient, httpLink } from "@trpc/client"
import HRouter from "src/lib/trpc/trpcAPIimport"


type ApiResponse = {
  chain:string;
  node_name:string;
  url:string;
  chain_id?:string;
  server_version_string?:string;
  head_block_time?:string;
  duration:number;
  success:boolean;
  error?:string;
};

type ApiResponses = Record<string, ApiResponse>;


export const useApiStore = defineStore("apiStore", {
  state: () => ({
    responses: {} as ApiResponses,
    chainUrls: {
      Telos: TelosEndpoints[0]?.[1] || "",
      EOS: EOSendpoints[0]?.[1] || "",
      "Telos Testnet": TelosTestnetEndpoints[0]?.[1] || ""
    } as Record<string, string>,
    clientAPI: new APIClient({ url: TelosEndpoints[0]?.[1] }),
    boidContract: new BoidContract({ client: new APIClient({ url: TelosEndpoints[0]?.[1] }) }),
    eosioMsigContract: new EosioMsigContract({ client: new APIClient({ url: TelosEndpoints[0]?.[1] }) }),
    payrollContract: new PayrollContract({ client: new APIClient({ url: TelosEndpoints[0]?.[1] }) }),
    ipfsURL: ipfsEndpoints[0]?.[1] || "",
    trpcURL: trpcEndpoints[0]?.[1] || "",
    trpcClient: null as any
  }),
  getters: {
    getResponsesByChain: (state) => {
      return (chainName:string) => {
        const filteredResponses:ApiResponses = {}
        Object.entries(state.responses).forEach(([endpoint, data]) => {
          if (data.chain === chainName) {
            filteredResponses[endpoint] = data
          }
        })
        return filteredResponses
      }
    },
    getUrlForChain: (state) => {
      return (chainName:string) => {
        return state.chainUrls[chainName] || ""
      }
    },
    getIPFSurl: (state) => {
      return state.ipfsURL || ""
    },
    getTRPCurl: (state) => {
      return state.trpcURL || ""
    },
    // Getter for boidContract
    boidContractInitialized: (state) => {
      return state.boidContract ?? null
    }
  },
  actions: {
    updateChainUrl(chainName:string, newUrl:string) {
      // Update the URL for the given chain
      if (Object.keys(this.chainUrls).includes(chainName)) {
        this.chainUrls[chainName] = newUrl
        console.log(`Updated URL for ${chainName} to: ${newUrl}`)

        // Reinitialize the contracts with the new URL if needed
        this.initializeContracts(chainName)
      } else {
        console.error(`Chain name ${chainName} is not valid`)
      }
    },
    updateIPFSUrl(newUrl:string) {
      if (ipfsEndpoints.some(endpoint => endpoint[1] === newUrl)) {
        this.ipfsURL = newUrl
        console.log(`Updated IPFS URL to: ${newUrl}`)
      } else {
        console.error(`IPFS URL ${newUrl} is not valid`)
      }
    },
    initializeTRPCClient() {
      this.trpcClient = createTRPCProxyClient<HRouter.AppRouter>({
        links: [
          httpLink({
            url: this.trpcURL
          })
        ]
      })
    },
    updateTRPCUrl(newUrl:string) {
      if (trpcEndpoints.some(endpoint => endpoint[1] === newUrl)) {
        this.trpcURL = newUrl
        console.log(`Updated TRPC URL to: ${newUrl}`)
        // Reinitialize the TRPC client
        this.initializeTRPCClient()
      } else {
        console.error(`TRPC URL ${newUrl} is not valid`)
      }
    },
    initializeContracts(chainName:string) {
      const url = this.chainUrls[chainName] // Get the URL for the selected chain
      if (!url) {
        console.error(`URL for chain ${chainName} is not defined`)
        return
      }
      const factory = new ContractFactory(url)

      // Initialize contracts
      this.boidContract = factory.createBoidContract()
      this.eosioMsigContract = factory.createEosioMsigContract()
    },
    setResponse(endpoint:string, data:ApiResponse) {
      this.responses[endpoint] = data
    }
  }
})

// Initialize TRPC client immediately
const apiStoreInstance = useApiStore()
apiStoreInstance.initializeTRPCClient()
