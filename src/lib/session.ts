import { endpoints, networks } from "./config"
import { SessionKit, Session } from "@wharfkit/session"
import { WebRenderer } from "@wharfkit/web-renderer"
import { WalletPluginAnchor } from "@wharfkit/wallet-plugin-anchor"
import { ref } from "vue"

let session = ref<Session | undefined>(undefined)

const webRenderer = new WebRenderer()
const sessionKit = new SessionKit({
  appName: "boidadmin",
  chains: [
    {
      id: networks[1]!.chainId,
      url: endpoints[2]![1]!
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
