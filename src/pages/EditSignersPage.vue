<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Edit Signers
        </div>
        <div v-for="(signer, index) in signersStore.signers" :key="index" class="q-ma-sm">
          <q-input v-model="signer.actor" label="Actor" />
          <q-input v-model="signer.permission" label="Permission" />
          <q-btn icon="delete" color="negative" @click="removeSigner(index)" />
        </div>
        <q-btn icon="add" label="Add Signer" @click="addSigner" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="cancel" />
        <q-btn flat label="Initiate" color="green" @click="initiate" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { defineEmits } from "vue"
import { useSignersStore } from "src/stores/useSignersStore"
import { useRouter } from "vue-router"

const router = useRouter()
const signersStore = useSignersStore()
const emit = defineEmits(["cancel", "initiate"])

// Access the store's state directly in the template
// No need to reassign it to a local variable

const addSigner = () => {
  signersStore.addSigner("", "")
}

const removeSigner = (index:number) => {
  signersStore.removeSigner(index)
}

const cancel = () => {
  emit("cancel")
}

const initiate = () => {
  emit("initiate", signersStore.signers)
  router.push("/").catch(err => {
    console.error("Failed to navigate:", err)
  })
}


</script>

