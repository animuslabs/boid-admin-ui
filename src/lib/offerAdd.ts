import { reactive, ref } from "vue"
import { NftAction, NftMint, NftAttribute } from "src/lib/types"
import { Int8, Int16, Int32, Int64, UInt8, UInt16, UInt32, UInt64, Float32, Float64, Bytes } from "@wharfkit/antelope"

export const showNftMintDialog = ref(false)

export const newOffer = reactive({
  requirements: {
    team_id: [] as number[], // array of numbers | default bytes
    min_power: 0, // Default UInt16 value
    min_balance: 0, // Default UInt32 value
    min_stake: 0, // Default UInt32 value
    min_cumulative_team_contribution: 0 // Default UInt32 value
  },
  actions: {
    delegated_stake: 0, // Default UInt16 value
    stake_locked_additional_rounds: 0, // Default UInt16 value
    nft_actions: [] as NftAction[],
    balance_payment: 0 // Default UInt32 value
  },
  rewards: {
    nft_mints: [] as NftMint[],
    balance_deposit: 0, // Default UInt32 value
    delegated_stake: 0, // Default UInt16 value
    stake_locked_additional_rounds: 0, // Default UInt16 value
    activate_powermod_ids: [] as number[] // array of numbers | default bytes
  },
  limits: {
    offer_quantity_remaining: 0, // Default UInt32 value
    available_until_round: 0 // Default UInt16 value
  }
})

export const atomicAttributeVariants = [
  "Int8", "Int16", "Int32",
  "Int64", "UInt8", "UInt16",
  "UInt32", "UInt64", "Float32",
  "Float64", "String", "Int8[]",
  "Int16[]", "Int32[]", "Int64[]",
  "Bytes", "UInt16[]", "UInt32[]",
  "UInt64[]", "Float32[]", "Float64[]", "String[]"
]

// Action Section
export const activatePowermodErrorMessage = "Please enter a comma separated list of numbers."
export const teamIdErrorMessage = "Please enter a comma separated list of numbers."
export const isInvalidInput = ref(false)
export const isInvalidTeamId = ref(false)
export const showNftActionDialog = ref(false)


// Define reactive properties for current action
export const currentActionIndex = ref(-1)
export const currentAction = ref({
  collection_name: "",
  schema_name: "",
  template_id: 0,
  match_immutable_attributes: [] as NftAttribute[],
  match_mutable_attributes: [] as NftAttribute[],
  burn: false,
  lock_rounds: 0
})

export const addNftAction = () => {
  const newAction = {
    collection_name: "",
    schema_name: "",
    template_id: 0,
    match_immutable_attributes: [],
    match_mutable_attributes: [],
    burn: false,
    lock_rounds: 0
  }

  newOffer.actions.nft_actions.push(newAction)
  currentActionIndex.value = newOffer.actions.nft_actions.length - 1
  currentAction.value = { ...newAction }
  showNftActionDialog.value = true
}
export const editNftAction = (index:number) => {
  if (index >= 0 && index < newOffer.actions.nft_actions.length) {
    const actionToEdit = newOffer.actions.nft_actions[index]
    if (actionToEdit) {
      currentActionIndex.value = index
      currentAction.value = { ...actionToEdit }
      showNftActionDialog.value = true
    } else {
      console.error("No action found at the specified index")
    }
  } else {
    console.error("Invalid action index for editing")
  }
}
export const saveNftAction = () => {
  if (currentActionIndex.value === -1) {
    newOffer.actions.nft_actions.push({ ...currentAction.value })
  } else if (currentActionIndex.value >= 0 && currentActionIndex.value < newOffer.actions.nft_actions.length) {
    newOffer.actions.nft_actions[currentActionIndex.value] = { ...currentAction.value }
  } else {
    console.error("Invalid action index")
    return
  }
  showNftActionDialog.value = false
  resetCurrentAction() // Reset current action after saving
}
const resetCurrentAction = () => {
  currentAction.value = {
    collection_name: "",
    schema_name: "",
    template_id: 0,
    match_immutable_attributes: [],
    match_mutable_attributes: [],
    burn: false,
    lock_rounds: 0
  }
  currentActionIndex.value = -1
}
export const removeNftAction = (actionIndex:number) => {
  if (actionIndex >= 0 && actionIndex < newOffer.actions.nft_actions.length) {
    newOffer.actions.nft_actions.splice(actionIndex, 1)
  } else {
    console.error("Invalid action index for removal")
  }
}
export const addImmutableAttribute = (actionIndex:number) => {
  const action = newOffer.actions.nft_actions[actionIndex]
  if (action) {
    action.match_immutable_attributes.push({ key: "", type: "", value: "" })
  }
}
export const removeImmutableAttribute = (actionIndex:number, attrIndex:number) => {
  const action = newOffer.actions.nft_actions[actionIndex]
  if (action && attrIndex >= 0 && attrIndex < action.match_immutable_attributes.length) {
    action.match_immutable_attributes.splice(attrIndex, 1)
  }
}
export const addMutableAttribute = (actionIndex:number) => {
  const action = newOffer.actions.nft_actions[actionIndex]
  if (action) {
    action.match_mutable_attributes.push({ key: "", type: "", value: "" })
  }
}
export const removeMutableAttribute = (actionIndex:number, attrIndex:number) => {
  const action = newOffer.actions.nft_actions[actionIndex]
  if (action && attrIndex >= 0 && attrIndex < action.match_mutable_attributes.length) {
    action.match_mutable_attributes.splice(attrIndex, 1)
  }
}


// Mint Section
export const currentNftMintIndex = ref(-1)
export const currentNftMint = ref({
  mint_template_id: "0",
  mint_schema_name: "",
  mint_collection_name: "",
  match_immutable_attributes: [] as NftAttribute[],
  match_mutable_attributes: [] as NftAttribute[],
  quantity: "0"
})
export const addNftMint = () => {
  const newMint = {
    mint_template_id: "0",
    mint_schema_name: "",
    mint_collection_name: "",
    match_immutable_attributes: [],
    match_mutable_attributes: [],
    quantity: "0"
  }

  newOffer.rewards.nft_mints.push(newMint)
  currentNftMintIndex.value = newOffer.rewards.nft_mints.length - 1
  currentNftMint.value = { ...newMint }
  showNftMintDialog.value = true
}
export const editNftMint = (index:number) => {
  if (index >= 0 && index < newOffer.rewards.nft_mints.length) {
    const mintToEdit = newOffer.rewards.nft_mints[index]
    if (mintToEdit) {
      currentNftMintIndex.value = index
      currentNftMint.value = { ...mintToEdit }
      showNftMintDialog.value = true
    } else {
      console.error("No mint found at the specified index")
    }
  } else {
    console.error("Invalid mint index for editing")
  }
}
export const saveNftMint = () => {
  if (currentNftMintIndex.value === -1) {
    newOffer.rewards.nft_mints.push({ ...currentNftMint.value })
  } else if (currentNftMintIndex.value >= 0 && currentNftMintIndex.value < newOffer.rewards.nft_mints.length) {
    newOffer.rewards.nft_mints[currentNftMintIndex.value] = { ...currentNftMint.value }
  } else {
    console.error("Invalid mint index")
    return
  }
  showNftMintDialog.value = false
  resetNftMint() // Reset current NFT mint after saving
}
const resetNftMint = () => {
  currentNftMint.value = {
    mint_template_id: "0",
    mint_schema_name: "",
    mint_collection_name: "",
    match_immutable_attributes: [],
    match_mutable_attributes: [],
    quantity: "0"
  }
  currentNftMintIndex.value = -1
}
export const removeNftMint = (index:number) => {
  if (index >= 0 && index < newOffer.rewards.nft_mints.length) {
    newOffer.rewards.nft_mints.splice(index, 1)
  } else {
    console.error("Invalid mint index for removal")
  }
}
export const addImmutableAttributeToMint = (mintIndex:number) => {
  const mint = newOffer.rewards.nft_mints[mintIndex]
  if (mint) {
    mint.match_immutable_attributes.push({ key: "", type: "", value: "" })
  }
}
export const removeImmutableAttributeFromMint = (mintIndex:number, attrIndex:number) => {
  const mint = newOffer.rewards.nft_mints[mintIndex]
  if (mint && attrIndex >= 0 && attrIndex < mint.match_immutable_attributes.length) {
    mint.match_immutable_attributes.splice(attrIndex, 1)
  }
}
export const addMutableAttributeToMint = (mintIndex:number) => {
  const mint = newOffer.rewards.nft_mints[mintIndex]
  if (mint) {
    mint.match_mutable_attributes.push({ key: "", type: "", value: "" })
  }
}
export const removeMutableAttributeFromMint = (mintIndex:number, attrIndex:number) => {
  const mint = newOffer.rewards.nft_mints[mintIndex]
  if (mint && attrIndex >= 0 && attrIndex < mint.match_mutable_attributes.length) {
    mint.match_mutable_attributes.splice(attrIndex, 1)
  }
}

export function parseAttributeValue(type:string, value:string) {
  switch (type) {
    case "Int8":
      return Int8.from(Number(value))
    case "Int16":
      return Int16.from(Number(value))
    case "Int32":
      return Int32.from(Number(value))
    case "Int64":
      return Int64.from(Number(value))
    case "UInt8":
      return UInt8.from(Number(value))
    case "UInt16":
      return UInt16.from(Number(value))
    case "UInt32":
      return UInt32.from(Number(value))
    case "UInt64":
      return UInt64.from(Number(value))
    case "Float32":
      return Float32.from(Number(value))
    case "Float64":
      return Float64.from(Number(value))
    case "Int8[]":
      return value.split(",").map(v => Int8.from(Number(v.trim())))
    case "Int16[]":
      return value.split(",").map(v => Int16.from(Number(v.trim())))
    case "Int32[]":
      return value.split(",").map(v => Int32.from(Number(v.trim())))
    case "Int64[]":
      return value.split(",").map(v => Int64.from(Number(v.trim())))
    case "UInt8[]":
      return value.split(",").map(v => UInt8.from(Number(v.trim())))
    case "UInt16[]":
      return value.split(",").map(v => UInt16.from(Number(v.trim())))
    case "UInt32[]":
      return value.split(",").map(v => UInt32.from(Number(v.trim())))
    case "UInt64[]":
      return value.split(",").map(v => UInt64.from(Number(v.trim())))
    case "Float32[]":
      return value.split(",").map(v => Float32.from(Number(v.trim())))
    case "Float64[]":
      return value.split(",").map(v => Float64.from(Number(v.trim())))
    case "Bytes":
      return Bytes.from(value)
    case "String[]":
      return value.split(",").map(v => v.trim())
    default:
      return value // For string and unhandled types, return the value as is
  }
}
