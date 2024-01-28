import { sha256 } from "hash.js"
import { PrivateKey, Bytes, KeyType } from "@wharfkit/antelope"
import { KeyPair } from "src/lib/types"

export function generateKey(boidIdInput:string, emailInput:string, boidIdPw:string):KeyPair {
  // Combine inputs and convert them to lowercase
  const combinedString = boidIdInput.toLowerCase() + emailInput.toLowerCase() + boidIdPw

  // Generate SHA-256 hash of the combined string
  const hash = sha256().update(combinedString).digest()

  // Convert hash to Bytes object
  const bytes = Bytes.from(hash)

  // Create a new PrivateKey instance using the hashed bytes
  const key = new PrivateKey(KeyType.K1, bytes)
  const privateKeyWif = key.toWif()

  // Generate the corresponding PublicKey instance
  const publicKey = key.toPublic()
  // Convert the PublicKey to legacy EOS format
  const publicKeyEos = publicKey.toLegacyString("EOS")

  return {
    privateKey: {
      key,
      wif: privateKeyWif
    },
    publicKey: {
      key: publicKey,
      eosFormat: publicKeyEos
    }
  }
}
