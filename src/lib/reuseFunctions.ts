import { Bytes } from "@wharfkit/antelope"

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
