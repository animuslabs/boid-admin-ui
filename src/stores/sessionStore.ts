import { defineStore } from "pinia"
import { sessionLogin, sessionLogout, sessionRestore } from "../lib/session"

export const useSessionStore = defineStore({
  id: "sessionStore",
  state: () => ({
    session: null as SessionKit | null
  }),

  // Getters
  getters: {
    isLoggedIn: (state) => state.session !== null // Check if logged in
  },

  // Actions
  actions: {
    async login() {
      this.session = await sessionLogin()
    },

    async logout() {
      sessionLogout()
      this.session = null
    },

    async renewSession() {
      this.session = await sessionRestore()
    }
  }
})
