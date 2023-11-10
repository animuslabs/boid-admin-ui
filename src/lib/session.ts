import { endpoints, networks } from "./config"
import { SessionKit } from "@wharfkit/session"
import { WebRenderer } from "@wharfkit/web-renderer"
import { WalletPluginAnchor } from "@wharfkit/wallet-plugin-anchor"
import { APIClient, APIClientOptions } from "@wharfkit/antelope"
import { ref } from "vue"

const session = ref<SessionKit | null>(null)
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

export async function sessionLogin() {
  if (!session.value) {
    session.value = await sessionKit.login()
  }
  return session.value
}

export async function sessionLogout() {
  if (session.value) {
    await sessionKit.logout()
    session.value = null
  }
}

export async function sessionRestore() {
  if (session.value) {
    session.value = await sessionKit.restore()
  }
  return session.value
}
