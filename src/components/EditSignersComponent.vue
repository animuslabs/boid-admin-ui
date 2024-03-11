<template>
  <q-card>
    <q-card-section>
      <div class="row text-h6">
        <div>Edit TRX signers</div>
        <div class="q-ml-md">
          <q-btn label="Fill from dac.boid" color="positive" @click="fillSigners" />
        </div>
      </div>
      <div v-for="(signer, index) in signersStore.signers" :key="index" class="q-ma-sm">
        <q-input v-model="signer.actor" label="Actor" @input="updateSigner(index, 'actor', $event)" />
        <q-input v-model="signer.permission" label="Permission" @input="updateSigner(index, 'permission', $event)" />
        <q-btn icon="delete" color="negative" @click="removeSigner(index)" />
      </div>
      <q-btn icon="add" label="Add Signer" @click="addSigner" />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancel" color="primary" @click="cancel" />
      <q-btn flat label="Save" color="green" @click="initiate" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits, ref } from "vue"
import { useSignersStore } from "src/stores/useSignersStore"
import { useRouter } from "vue-router"

const router = useRouter()
const signersStore = useSignersStore()
const emit = defineEmits(["cancel", "initiate"])

const addSigner = () => {
  signersStore.addSigner("", "")
}

const removeSigner = (index:number) => {
  signersStore.removeSigner(index)
}
const updateSigner = (index:number, key:"actor" | "permission", value:string) => {
  // Check if the signer exists at the given index
  const signer = signersStore.signers[index]
  if (signer) {
    if (key === "actor") {
      signersStore.updateSigner(index, value, signer.permission)
    } else {
      signersStore.updateSigner(index, signer.actor, value)
    }
  } else {
    console.error("Signer not found at index:", index)
  }
}

const cancel = () => {
  emit("cancel")
}

const initiate = () => {
  emit("initiate", signersStore.signers)
  console.log("Signers:", signersStore.signers)
  router.push("/").catch(err => {
    console.error("Failed to navigate:", err)
  })
}

const fillSigners = async() => {
  await signersStore.fetchAccountInfo("dac.boid")
}

</script>

