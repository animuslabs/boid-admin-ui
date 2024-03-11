<template>
  <q-dialog v-model="dialogVisible">
    <q-card class="payrollForm">
      <q-card-section>
        <div class="text-h5">
          Add New Payroll
        </div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="submitForm">
          <div class="text-h6">
            Main details
          </div>
          <q-input v-model="meta.title" label="Payroll Title" :rules="payrollTitleRule" dense />
          <div class="q-gutter-md row justify-between">
            <div class="row q-mr-sm">
              <q-input v-model="payrollConfig.total" label="Total Amount" type="text" :rules="totalAmountRule" dense />
              <q-select v-model="selectedToken" :options="symOptions" label="Token" dense />
            </div>
            <div class="row">
              <q-input v-model="minClaimFrequency.value" label="Min Claim Frequency" type="number" dense />
              <q-select v-model="minClaimFrequency.unit" :options="timeUnits" label="Unit" dense />
            </div>
          </div>

          <div class="row">
            <div class="q-pa-md" style="max-width: 250px">
              <div>Start Time</div>
              <q-input filled v-model="payrollConfig.startTime" dense>
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="payrollConfig.startTime" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template #append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="payrollConfig.startTime" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="q-pa-md row" style="max-width: 250px">
              <div>Finish Time</div>
              <q-input filled v-model="payrollConfig.finishTime" dense>
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="payrollConfig.finishTime" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template #append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="payrollConfig.finishTime" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="text-subtitle2 q-pa-md">
            Days: {{ daysBetween }} | Daily: {{ amountCalculations.perDay }} | Weekly: {{ amountCalculations.perWeek }} | Monthly: {{ amountCalculations.perMonth }}
          </div>
          <q-separator />
          <div class="q-gutter-md q-mt-xs row justify-between">
            <q-input v-model="payrollConfig.receiverAccount" label="Receiver Account" :rules="accountRule" dense />
            <q-input v-model="payrollConfig.treasuryAccount" label="Treasury Account" :rules="accountRule" dense />
          </div>
          <q-checkbox v-model="payrollConfig.paused" label="Paused" class="q-mt-sm" />
          <q-expansion-item
            label="Optional details"
            icon="add"
            dense
            class="q-mt-md"
          >
            <div class="q-mt-lg q-mb-md">
              <!-- Meta data inputs -->
              <q-input class="q-mb-md" v-model="meta.text" label="Description" dense />
              <q-input class="q-mb-md" v-model="meta.websiteLink" label="Website Link" dense />
              <div>
                <div class="text-subtitle2">
                  Social Media Links
                </div>
                <div v-for="(link, platform) in meta.socialMediaLinks" :key="platform" class="q-mb-md">
                  <q-input v-model="meta.socialMediaLinks[platform]" :label="`Link for ${platform}`" />
                  <q-btn icon="delete" @click="() => removeSocialMediaLink(platform)" />
                </div>
                <q-input v-model="newPlatform" label="New Platform" dense />
                <q-input v-model="newUrl" label="New Link URL" dense />
                <q-btn label="Add Social Media Link" @click="addSocialMediaLink" flat class="q-my-sm bg-primary text-white" dense />
              </div>
              <q-separator class="q-my-md" />

              <div>
                <div class="text-subtitle2 q-mt-md">
                  Media Images IPFS CIDs
                </div>
                <q-input v-model="meta.mediaImages.banner" label="Banner Image CID" dense />
                <q-input v-model="meta.mediaImages.avatar" label="Avatar Image CID" dense />
              </div>
              <div>
                <div class="text-subtitle2 q-mt-md">
                  Documents IPFS CIDs
                </div>
                <div v-for="(cid, index) in meta.docIPFSCIDs" :key="index" class="q-mb-md">
                  <q-input v-model="meta.docIPFSCIDs[index]" label="Document IPFS CID" dense />
                  <q-btn icon="delete" label="remove IPFS CID" color="primary" @click="removeCID(index)" dense />
                </div>
                <q-btn label="Add another doc IPFS CID" color="primary" @click="addCID" class="q-mt-xs" dense />
              </div>
            </div>
          </q-expansion-item>
          <q-separator class="q-my-md" />
          <q-btn icon="add" label="Add to bucket" type="submit" color="primary" class="q-mt-md" />
          <q-btn label="Close" @click="dialogVisible = false" color="grey" class="q-mt-md q-ml-sm" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, computed, defineProps, defineEmits } from "vue"
import { Types as TypesPayroll, ActionParams } from "src/lib/payroll.boid"
import { PayrollMeta, PayrollConfigStructure } from "src/types/types"
import { usePayrollStore } from "src/stores/payrollStore"
import { TimePointSec } from "@wharfkit/session"
import { Asset, Bytes } from "@wharfkit/antelope"
import { getFormattedDatePlus7DaysAtMidnightPlusOne, bytesToJson } from "src/lib/reuseFunctions"
import { ActionDescriptor } from "src/lib/contracts"
import { useQuasar } from "quasar"

const $q = useQuasar()
const dialogVisible = ref(false)

// rules
const totalAmountRule = [
  (val:string) => !!val || "Total amount is required",
  (val:string) => /^-?\d+(\.\d{1,4})?$/.test(val) || "Total must be a number with up to 4 decimal places"
]
const payrollTitleRule = [
  (val:string) => !!val || "Payroll title is required",
  (val:string) => val.length >= 8 || "Payroll title must be at least 8 characters long",
  (val:string) => /^[a-zA-Z0-9 ]*$/.test(val) || "Payroll title must not contain special characters"
]
const accountRule = [
  (val:string) => !!val || "Account name is required",
  (val:string) => val.length <= 12 || "Account name must be no more than 12 characters",
  (val:string) => /^[a-z1-5.]+$/.test(val) || "Account name must only contain lowercase letters, numbers 1-5, and dots"
]


// props to be used when editing a payroll
// Define props
const props = defineProps<{
  editDescriptor?:ActionDescriptor;
  formMode?:string;
  actionIndex?:number;
}>()

// Define emits
const emit = defineEmits(["addedPayroll", "editedPayroll"])


// Calculate the time 7 days from now at midnight plus one second
const futureTimeMidnightPlusOne = getFormattedDatePlus7DaysAtMidnightPlusOne()
// load store
const payrollStore = usePayrollStore()




const minClaimFrequency = ref({
  value: 1,
  unit: "Weeks"
})
const timeUnits = [
  "Seconds", "Minutes", "Hours", "Days", "Weeks"
]
const calculateMinClaimFrequencySec = () => {
  let multiplier = 1 // Default is seconds
  switch (minClaimFrequency.value.unit) {
    case "Minutes": multiplier = 60; break
    case "Hours": multiplier = 3600; break
    case "Days": multiplier = 86400; break
    case "Weeks": multiplier = 604800; break
  }
  return minClaimFrequency.value.value * multiplier
}

const daysBetween = computed(() => {
  if (!payrollConfig.value.startTime || !payrollConfig.value.finishTime) {
    return 0
  }

  const startTime = new Date(payrollConfig.value.startTime).getTime()
  const finishTime = new Date(payrollConfig.value.finishTime).getTime()

  const millisecondsPerDay = 24 * 60 * 60 * 1000 // Number of milliseconds in one day
  const differenceInDays = Math.round((finishTime - startTime) / millisecondsPerDay)

  return differenceInDays
})
const amountCalculations = computed(() => {
  const total = parseFloat(payrollConfig.value.total)
  const days = daysBetween.value

  // Initialize default calculations
  let perDay = 0, perWeek = 0, perMonth = 0

  if (days > 0 && total > 0) {
    perDay = total / days
    perWeek = perDay * 7
    // Assuming an average month length of 30.44 days for calculation
    perMonth = perDay * 30.44
  }

  return {
    perDay: perDay.toFixed(0), // Format to 2 decimal places
    perWeek: perWeek.toFixed(0),
    perMonth: perMonth.toFixed(0)
  }
})


const symOptions = computed(() => payrollStore.getTokenSymbolList)
const selectedToken:Ref<string> = ref("")

//meta
const meta = ref<PayrollMeta>(new PayrollMeta())
console.log("Meta: ", meta.value)
const newPlatform = ref("")
const newUrl = ref("")
function addCID() {
  meta.value.docIPFSCIDs.push("")
}

function removeCID(index:number) {
  meta.value.docIPFSCIDs.splice(index, 1)
}


// Assuming these are the initial values for PayrollConfig and Meta
const payrollConfig:Ref<PayrollConfigStructure> = ref({
  total: "0.0000",
  startTime: futureTimeMidnightPlusOne,
  finishTime: futureTimeMidnightPlusOne,
  receiverAccount: "",
  treasuryAccount: "vault.boid",
  paused: false
})

// Function to prepare PayrollConfig and Meta data for submission to the store
function preparePayrollDataForState(meta:Ref<PayrollMeta>, payrollConfig:Ref<PayrollConfigStructure>, selectedToken:Ref<string>) {
  const payrollMetaInstance = new PayrollMeta({
    title: meta.value.title,
    text: meta.value.text,
    socialMediaLinks: meta.value.socialMediaLinks,
    websiteLink: meta.value.websiteLink,
    mediaImages: {
      banner: meta.value.mediaImages.banner,
      avatar: meta.value.mediaImages.avatar
    },
    docIPFSCIDs: meta.value.docIPFSCIDs
  })

  const payrollConfigInstance = new TypesPayroll.PayrollConfig({
    total: Asset.from(payrollConfig.value.total + " " + selectedToken.value),
    startTime: TimePointSec.fromMilliseconds((new Date(payrollConfig.value.startTime)).getTime()),
    finishTime: TimePointSec.fromMilliseconds((new Date(payrollConfig.value.finishTime)).getTime()),
    minClaimFrequencySec: calculateMinClaimFrequencySec(),
    receiverAccount: payrollConfig.value.receiverAccount,
    treasuryAccount: payrollConfig.value.treasuryAccount,
    meta: payrollMetaInstance.toBytes(),
    paused: payrollConfig.value.paused
  })

  return payrollConfigInstance
}

function isPayrollAddDescriptor(descriptor:ActionDescriptor):descriptor is ActionDescriptor & { action_data:{ payrollConfig:ActionParams.Type.PayrollConfig } } {
  return descriptor.actionName === "payroll.add"
}

// this will take data in the descriptor format from the pinia store and populate the form
async function populateFormFromPayrollDescriptor(descriptor:ActionDescriptor) {
  if (isPayrollAddDescriptor(descriptor)) {
    const { payrollConfig: descriptorConfig } = descriptor.action_data
    const totalString = Asset.from(descriptorConfig.total).toString()
    const [amount, tokenSymbol] = totalString.split(" ")
    // Update Vue refs directly based on descriptor content
    payrollConfig.value.total = amount || "0.0000"
    selectedToken.value = tokenSymbol || ""
    payrollConfig.value.startTime = (new Date(descriptorConfig.startTime.toMilliseconds())).toISOString()
    payrollConfig.value.finishTime = (new Date(descriptorConfig.finishTime.toMilliseconds())).toISOString()
    payrollConfig.value.receiverAccount = descriptorConfig.receiverAccount.toString()
    payrollConfig.value.treasuryAccount = descriptorConfig.treasuryAccount.toString()
    payrollConfig.value.paused = descriptorConfig.paused

    try {
      // Assuming bytesToJson is an async function that converts bytes to JSON
      const metaInstanceJson = await bytesToJson<PayrollMeta>(descriptorConfig.meta as Bytes)
      meta.value = new PayrollMeta({ ...metaInstanceJson })
    } catch (error) {
      console.error("Failed to decode meta data:", error)
    }
  } else {
    console.error("Descriptor is not for a 'payroll.add' action:", descriptor.actionName)
  }
}
onMounted(async() => {
  if (props.editDescriptor) {
    await populateFormFromPayrollDescriptor(props.editDescriptor)
  }
})

// Add a social media link
const addSocialMediaLink = () => {
  if (newPlatform.value && newUrl.value) {
    const updatedLinks = { ...meta.value.socialMediaLinks, [newPlatform.value]: newUrl.value }
    meta.value.socialMediaLinks = updatedLinks // Replace the entire object
    newPlatform.value = ""
    newUrl.value = ""
  }
}
// Remove a social media link
const removeSocialMediaLink = (platform:string) => {
  delete meta.value.socialMediaLinks[platform]
}

// Submit the form to add a new payroll to the store
const submitAddPayrollForm = async() => {
  // Prepare the PayrollConfig instance
  const payrollConfigInstance = preparePayrollDataForState(meta, payrollConfig, selectedToken)

  // Create an ActionDescriptor for adding a new payroll
  const actionDescriptor:ActionDescriptor = {
    actionName: "payroll.add",
    action_data: { payrollConfig: payrollConfigInstance }
  }

  // Add the new payroll descriptor to the store
  payrollStore.addDescriptor(actionDescriptor)
  console.log("Added new payroll:", actionDescriptor)

  $q.notify({
    type: "positive", // or 'info', 'warning' etc. based on context
    message: "Payroll added to bucket successfully.",
    icon: "check" // Optional: you can choose an icon
  })
  // Emit an event to notify the parent component that a new payroll has been added
  emit("addedPayroll", actionDescriptor)
}

const submitEditedPayroll = async() => {
  // Check if an editing index has been set
  if (props.actionIndex !== undefined && props.actionIndex >= 0) {
    // Ensure the descriptor exists for the editing index
    if (props.editDescriptor) {
      // Populate the form with the descriptor's data
      await populateFormFromPayrollDescriptor(props.editDescriptor)
      console.log("Populated form from descriptor:", props.editDescriptor)

      // Prepare the updated payroll config instance
      const payrollConfigInstance = preparePayrollDataForState(meta, payrollConfig, selectedToken)
      console.log("Updated payroll config:", payrollConfigInstance)
      // Create an updated action descriptor
      const actionDescriptor = {
        ...props.editDescriptor, // Assuming this already contains actionName and potentially other relevant data
        action_data: { payrollConfig: payrollConfigInstance }
      }
      console.log("Updated action descriptor:", actionDescriptor)
      // Update the payroll in the store
      payrollStore.editDescriptor(props.actionIndex, actionDescriptor)
      console.log("Index:", props.actionIndex)
      console.log("Edited payroll:", actionDescriptor)

      // Emit an event for successful edit
      emit("editedPayroll", { index: props.actionIndex, descriptor: actionDescriptor })
    } else {
      console.error("Descriptor for editing is not available.")
    }
  } else {
    console.error("No payroll is selected for editing.")
  }
}


const submitForm = async() => {
  console.log("Form mode:", props.formMode)
  if (props.formMode === "add") {
    await submitAddPayrollForm()
  } else if (props.formMode === "edit") {
    await submitEditedPayroll()
  } else {
    console.error("Invalid form mode:", props.formMode)
  }
}

</script>
<style scoped>
.payrollForm {
  height: 670px;
  width: 100%;
}
</style>
