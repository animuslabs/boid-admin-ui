<template>
  <q-page class="container" padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Generate Keys
        </div>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input filled v-model="boidIdInput" label="Boid ID" />
          <q-input filled v-model="emailInput" label="Email" type="email" />
          <q-input filled v-model="boidIdPw" label="Password" type="password" />

          <div class="q-mt-md">
            <q-btn label="Generate Keys" type="submit" color="primary" class="q-ma-sm" />
            <q-btn label="Reset" @click="onReset" color="secondary" class="q-ma-sm" />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section v-if="generatedKeys">
        <div class="text-h6">
          Generated Keys
        </div>
        <q-list bordered>
          <q-item v-if="showPrivateKeys">
            <q-item-section>
              <q-item-label>Private Key (PVT Standard)</q-item-label>
              <q-item-label caption>
                {{ generatedKeys.privateKey.key.toString() }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="showPrivateKeys">
            <q-item-section>
              <q-item-label>Private Key (WIF)</q-item-label>
              <q-item-label caption>
                {{ generatedKeys.privateKey.wif }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Public Key (PUB Standard)</q-item-label>
              <q-item-label caption>
                {{ generatedKeys.publicKey.key.toString() }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Public Key (EOS Format)</q-item-label>
              <q-item-label caption>
                {{ generatedKeys.publicKey.eosFormat }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn v-if="generatedKeys" label="Show/Hide Private Keys" @click="togglePrivateKeyVisibility" color="accent" class="q-ma-sm" />
        <q-btn label="Verify on Explorer" @click="openInExplorer" color="green" class="q-ma-sm" />
      </q-card-section>
    </q-card>
  </q-page>
</template>


<script lang="ts" setup>
import { ref } from "vue"
import { generateKey } from "src/lib/keyGenerator"
import { KeyPair } from "src/types/types-stores"

const boidIdInput = ref("")
const emailInput = ref("")
const boidIdPw = ref("")
const generatedKeys = ref<KeyPair | null>(null)
const formKey = ref(0)
const showPrivateKeys = ref(false)

const onSubmit = () => {
  try {
    generatedKeys.value = generateKey(boidIdInput.value, emailInput.value, boidIdPw.value)
    showPrivateKeys.value = false // Hide private keys initially
  } catch (error) {
    console.error("Error:", error)
  }
}

const onReset = () => {
  boidIdInput.value = ""
  emailInput.value = ""
  boidIdPw.value = ""
  generatedKeys.value = null
  formKey.value++
}

const togglePrivateKeyVisibility = () => {
  showPrivateKeys.value = !showPrivateKeys.value
}
const openInExplorer = () => {
  const boidId = boidIdInput.value
  if (boidId) {
    const url = `https://eosauthority.com/account/boid?network=telos&scope=boid&table=accounts&limit=1&index_position=1&key_type=i64&reverse=0&mode=contract&sub=tables&lower_bound=${encodeURIComponent(boidId)}`
    window.open(url, "_blank")
  }
}
</script>
<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}
</style>
src/lib/types-stores
