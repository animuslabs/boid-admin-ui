import { networks } from "./config"
import { SessionKit, Session } from "@wharfkit/session"
import { WebRenderer } from "@wharfkit/web-renderer"
import { WalletPluginAnchor } from "@wharfkit/wallet-plugin-anchor"
import { ref, computed } from "vue"
import { useApiStore } from "src/stores/apiStore"

let session = ref<Session | undefined>(undefined)

const apiStore = useApiStore()
const telosUrl = computed(() => apiStore.getUrlForChain("Telos"))
const eosUrl = computed(() => apiStore.getUrlForChain("EOS"))
const telosTestnetUrl = computed(() => apiStore.getUrlForChain("Telos Testnet"))

const webRenderer = new WebRenderer()
const sessionKit = new SessionKit({
  appName: "BoidAdmin",
  // Networks: 0 = Telos Mainnet, 1 = Telos Testnet, 2 = EOS Mainnet
  chains: [
    {
      id: networks[0]!.chainId,
      url: telosUrl.value,
      logo: networks[0]!.logo
    },
    {
      id: networks[1]!.chainId,
      url: telosTestnetUrl.value,
      logo: networks[1]!.logo
    },
    {
      id: networks[2]!.chainId,
      url: eosUrl.value,
      logo: networks[2]!.logo
    }
  ],
  ui: webRenderer,
  walletPlugins: [new WalletPluginAnchor()]
})

export async function sessionLogin():Promise<Session | undefined> {
  const response = await sessionKit.login()
  session.value = response.session
  return response.session
}

export async function sessionLogout():Promise<Session | undefined> {
  await sessionKit.logout()
  session.value = undefined
  return session.value
}

export async function sessionRestore():Promise<Session | undefined> {
  const loginResult = await sessionKit.restore()
  session.value = loginResult
  return loginResult
}
