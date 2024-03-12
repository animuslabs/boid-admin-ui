import { Bytes, Name, ABI, Serializer } from "@wharfkit/antelope"

export async function bytesToJson<T>(bytes:Bytes):Promise<T> {
  try {
    // Check if bytes are empty
    if (bytes.length === 0) {
      console.warn("Empty bytes, returning default value.")
      return {} as T // Return an empty object (or a more appropriate default value)
    }

    // Decode bytes to string
    const decoder = new TextDecoder() // Assumes UTF-8 encoding
    const jsonString = decoder.decode(bytes.array)

    // Parse string to JSON
    const data = JSON.parse(jsonString)

    return data
  } catch (error:any) {
    console.error("Error converting bytes to JSON:", error)
    throw new Error("Error converting bytes to JSON: " + error.message)
  }
}
export function stringToBytes(str:string):Bytes {
  return Bytes.fromString(str, "utf8")
}

// Method to convert Uint8Array to comma-separated string
export const arrayToString = (array:Uint8Array) => {
  return Array.from(array).join(", ")
}

export function generateRandomName():Name {
  const characters = "abcdefghijklmnopqrstuvwxyz12345"
  let result = ""

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return Name.from(result)
}

function getFutureDate(days:number):string {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + days)

  // Ensuring the date format is YYYY-MM-DD
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, "0")
  const day = String(currentDate.getDate()).padStart(2, "0")

  const futureDate = `${year}-${month}-${day}T00:00:00`
  return futureDate
}

// Example usage: Get date 14 days in the future
export const expDate:string = getFutureDate(14)


// serialization of actions for transaction
export function serializeActionData(action:any, abi:ABI) {
  try {
    // Ensure action and ABI are provided
    if (!action || !abi) {
      throw new Error("Action or ABI is missing for serialization")
    }
    return Serializer.encode({ object: action.data, abi, type: action.name })
  } catch (error) {
    console.error("Error serializing action data:", error)
    throw error
  }
}

export function getFormattedDatePlus7DaysAtMidnightPlusOne() {
  const datePlus7Days = new Date()
  datePlus7Days.setDate(datePlus7Days.getDate() + 7) // Add 7 days to the current date

  // Set time to 00:01
  datePlus7Days.setHours(0, 1, 0, 0) // Sets hours and minutes to "00" and "01" respectively, and seconds and milliseconds to "0"

  const year = datePlus7Days.getFullYear()
  const month = String(datePlus7Days.getMonth() + 1).padStart(2, "0") // getMonth() is zero-based
  const day = String(datePlus7Days.getDate()).padStart(2, "0")

  // Since the time is fixed at 00:01, it's not necessary to dynamically generate the time part
  return `${year}-${month}-${day} 00:01`
}

export function convertTo24HourISO(dateTimeStr:any) {
  // Split the date and time parts
  let [datePart, timePart] = dateTimeStr.split(", ")

  // Convert datePart from "MM/DD/YYYY" to "YYYY-MM-DD"
  let [month, day, year] = datePart.split("/")
  month = month.padStart(2, "0") // Ensure two digits
  day = day.padStart(2, "0") // Ensure two digits
  const isoDate = `${year}-${month}-${day}`

  // Determine if it's AM or PM and remove AM/PM
  const isPM = timePart.includes("PM")
  const isAM = timePart.includes("AM")
  timePart = timePart.replace("AM", "").replace("PM", "").trim()

  // Split hours and minutes
  let [hours, minutes, seconds] = timePart.split(":")

  // Convert hours to 24-hour format if necessary
  hours = parseInt(hours, 10)
  if (isPM && hours < 12) {
    hours += 12
  } else if (isAM && hours === 12) {
    hours = 0
  }

  // Ensure two digits for hours
  hours = hours.toString().padStart(2, "0")

  // Reconstruct the time part with proper formatting
  const isoTime = `${hours}:${minutes}:${seconds}`

  // Construct and return the ISO 8601 string
  return `${isoDate}T${isoTime}`
}

