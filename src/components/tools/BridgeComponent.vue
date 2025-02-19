<template>
  <q-page class="q-pa-md">
    <q-card class="fixed-card">
      <q-card-section class="bg-primary text-white q-pa-sm rounded-borders text-center">
        <div class="text-h6">
          Telos Native to EVM Bridge
        </div>
      </q-card-section>
      <q-card-section class="column">
        <!-- Remove Request Action -->
        <div class="q-mb-md">
          <q-badge outline color="primary" class="text-weight-bolder text-subtitle2 q-mb-sm">
            Remove request
          </q-badge>
          <q-icon name="info" color="primary" size="sm" class="q-ml-sm">
            <q-tooltip>Remove a pending bridge request by ID from tables on native chain</q-tooltip>
          </q-icon>
          <div class="row">
            <q-input v-model="removeRequestId" label="Request ID" stack-label outlined dense clearable style="max-width: 150px;" />
            <q-btn glossy class="q-ml-sm" size="md" icon="delete" @click="handleRemoveRequest" color="primary" />
          </div>
        </div>
        <q-separator class="q-mb-lg" color="primary" />
        <!-- Remove Request EVM Action -->
        <div>
          <q-badge outline color="primary" class="text-weight-bolder text-subtitle2 q-mb-sm">
            Remove request from EVM
          </q-badge>
          <q-icon name="info" color="primary" size="sm" class="q-ml-sm">
            <q-tooltip>Remove EVM-chain specific requests by ID from tables on EVM chain</q-tooltip>
          </q-icon>
          <div class="row">
            <q-input v-model="removeRequestEvmId" label="Request ID" stack-label outlined dense clearable style="max-width: 150px;" />
            <q-btn glossy class="q-ml-sm" size="md" icon="delete" @click="handleRemoveRequestEVM" color="primary" />
          </div>
        </div>
        <q-separator class="q-my-lg" color="primary" />
        <!-- Refund Stuck Request Action -->
        <div>
          <q-badge outline color="primary" class="text-weight-bolder text-subtitle2 q-mb-sm">
            Refund stuck request
          </q-badge>
          <q-icon name="info" color="primary" size="sm" class="q-ml-sm">
            <q-tooltip>Refund requests stuck in processing for too long</q-tooltip>
          </q-icon>
          <q-btn glossy class="q-ml-lg" size="md" icon="delete" @click="handleRefundStuckRequest" color="primary" />
        </div>
        <q-separator class="q-my-lg" color="primary" />
        <!-- Clear Failed Request Action -->
        <div>
          <q-badge outline color="primary" class="text-weight-bolder text-subtitle2 q-mb-sm">
            Clear failed requests
          </q-badge>
          <q-icon name="info" color="primary" size="sm" class="q-ml-sm">
            <q-tooltip>Clear all failed requests from the tables on EVM chain</q-tooltip>
          </q-icon>
          <q-btn glossy class="q-ml-lg" size="md" icon="delete" @click="handleClearFailedRequest" color="primary" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBridgeStore } from "src/stores/bridgeStore"
import { ActionParams as ActionParamsEvmBoid } from "src/lib/evm.boid"

const bridgeStore = useBridgeStore()

// Input fields for actions needing a request ID
const removeRequestId = ref("")
const removeRequestEvmId = ref("")

const handleRemoveRequest = async() => {
  const data = {
    req_id: Number(removeRequestId.value)
  } as ActionParamsEvmBoid.rmreq
  await bridgeStore.createRemoveRequestAction(data)
}

const handleRefundStuckRequest = async() => {
  await bridgeStore.createRefundStuckRequestAction()
}

const handleClearFailedRequest = async() => {
  await bridgeStore.createClearFailReqAction()
}

const handleRemoveRequestEVM = async() => {
  const data = {
    req_id: Number(removeRequestEvmId.value)
  } as ActionParamsEvmBoid.rmreqonevm
  await bridgeStore.createRemoveRequestEVMAction(data)
}
</script>

<style scoped>
/* Add any custom styles as needed */
.fixed-card {
  width: 330px;
  max-width: 100%;
  margin: auto;
}
</style>
