
import { defineStore } from "pinia"
import { Signer } from "src/types/types-stores"
import { getAccInfo } from "src/lib/apiFetchData"

export const useSignersStore = defineStore("signers", {
  state: () => ({
    signers: [{ actor: "", permission: "active" }] as Signer[]
  }),
  getters: {
    signersState: (state) => state.signers
  },
  actions: {
    addSigner(actor:string, permission:string) {
      this.signers.push({ actor, permission })
    },
    removeSigner(index:number) {
      this.signers.splice(index, 1)
    },
    setSigners(signers:{ actor:string; permission:string }[]) {
      this.signers = signers
    },
    updateSigner(index:number, actor:string, permission:string) {
      this.signers[index] = { actor, permission }
    },
    clearSigners() {
      this.signers = []
    },
    async fetchAccountInfo(accountName:string) {
      try {
        const fullAccountData = await getAccInfo(accountName)
        const activePermission = fullAccountData.permissions.find(perm => perm.perm_name.toString() === "active")
        if (activePermission) {
          this.clearSigners() // Use `this` to access store action

          activePermission.required_auth.accounts.forEach(({ permission }) => {
            const actor = permission.actor.toString()
            const permissionName = permission.permission.toString()
            this.addSigner(actor, permissionName) // Use `this` to access store action
          })
        }
      } catch (error) {
        console.error("Error fetching account data:", error)
      }
    },
    async initializeSigners() {
      await this.fetchAccountInfo("dac.boid")
    }
  }
})
