import { defineStore } from "pinia"
import { LocalStorage } from "quasar"
import { sessionLogin, sessionLogout, sessionRestore } from "../lib/session"
import { PermissionLevel, Session } from "@wharfkit/session"

export const useSessionStore = defineStore({
  id: "sessionStore",
  state: () => ({
    session: undefined as Session | undefined
  }),
  // Getters
  getters: {
    isLoggedIn: (state) => state.session !== undefined,
    username: (state) => state.session?.actor.toString() || "",
    authorization: (state) => PermissionLevel.from(state.session?.permissionLevel as PermissionLevel || { actor: "boid", permission: "active" }),
    sessionState: (state) => state
  },

  // Actions
  actions: {
    async login() {
      const sessionData = await sessionLogin()
      if (sessionData) {
        const serializedSession = sessionData.serialize()
        LocalStorage.set("session", serializedSession)
      }
      this.session = sessionData
    },

    async logout() {
      await sessionLogout()
      LocalStorage.remove("session")
      this.session = undefined
    },

    async renew() {
      const serializedSession = LocalStorage.getItem("session")
      if (serializedSession) {
        this.session = await sessionRestore()
        if (this.session) {
          LocalStorage.set("session", this.session.serialize())
        }
      }
    }
  }
})
