import { base64ToUint8Array, uint8ArrayToBase64 } from "./helpers";

const crypto = window.crypto.subtle;

// key pair generation
const generateKeyPair = async()=> {

    return await crypto.generateKey(
      { 
        name: "ECDH",          
        namedCurve: "P-384",
      },
      true,                    
      ["deriveKey"]
    )

}


// message encryption and decryption
const encryptMessage = async (sharedKey:CryptoKey, message:string):Promise<string> => {

  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generate a new IV for each encryption
  const encoded = new TextEncoder().encode(message); // Assuming getMessageEncoding just encodes to Uint8Array

  const encryptedData = await crypto.encrypt(
    { name: "AES-GCM", iv: iv },
    sharedKey,
    encoded
  );

  // Combine the IV and the encrypted data into one ArrayBuffer
  const combinedBuffer = new Uint8Array(iv.length + encryptedData.byteLength);
  combinedBuffer.set(iv, 0);
  combinedBuffer.set(new Uint8Array(encryptedData), iv.length);
  
  const base64Payload = uint8ArrayToBase64(combinedBuffer)

  return base64Payload
};

const decryptMessage = async (sharedKey:CryptoKey, encryptedDataWithIv:string) => {

  const encryptedDataWithIvUint8Array = base64ToUint8Array(encryptedDataWithIv);

  // Extract the IV and the encrypted message
  const iv = encryptedDataWithIvUint8Array.slice(0, 12); // Assuming a 12-byte IV
  const encryptedMessage = encryptedDataWithIvUint8Array.slice(12);

  try {

    const decryptedArrayBuffer = await crypto.decrypt(
      { name: "AES-GCM", iv },
      sharedKey,
      encryptedMessage
    );

    const decryptedMessage = new TextDecoder().decode(decryptedArrayBuffer);
    return decryptedMessage;

  } catch (error) {
    // console.error("Decryption failed:", error);
    return null;
  }
};

const deriveSharedSecret = (privateKey:CryptoKey, publicKey:CryptoKey)=> {
    return crypto.deriveKey(
      {
        name: "ECDH",
        public: publicKey,
      },
      privateKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"],
    );
}


// private keys encryption and decryption
export const deriveKeyFromPassword = async (password: string, salt: Uint8Array) => {
  try {
    // Create a TextEncoder to convert the password string into a byte array
    const passwordBuffer = new TextEncoder().encode(password);

    // Import the password as a cryptographic key material
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },  // Algorithm name
      false,  // Key is not extractable
      ['deriveBits', 'deriveKey']  // Key usage
    );

    // Derive a key from the key material using PBKDF2 with the provided salt
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,  // Number of iterations
        hash: 'SHA-256'  // Hash function
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },  // Output key algorithm and length
      true,  // Key is extractable
      ['encrypt', 'decrypt']  // Key usage
    );

    // Return the derived key
    return key;
  } catch (error) {
    // Log and rethrow any errors that occur during key derivation
    console.error('Error generating key:', error);
    throw error;
  }
};

export const encryptPrivateKey = async (password: string, privateKey: JsonWebKey) => {
  // Generate a random salt of 16 bytes for PBKDF2
  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  // Derive an encryption key from the password and salt using PBKDF2
  const key = await deriveKeyFromPassword(password, salt);

  // Encode the private key to a JSON string and then to a byte array
  const dataBuffer = new TextEncoder().encode(JSON.stringify(privateKey));

  // Generate a random initialization vector (IV) of 12 bytes for AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the data using AES-GCM with the derived key and IV
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    dataBuffer
  );

  // Combine the salt, IV, and the encrypted data into one ArrayBuffer
  const combinedBuffer = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
  combinedBuffer.set(salt, 0); // Set the salt at the beginning
  combinedBuffer.set(iv, salt.length); // Set the IV after the salt
  combinedBuffer.set(new Uint8Array(encryptedData), salt.length + iv.length); // Set the encrypted data after the IV

  // Convert the combined buffer to Base64 for storage
  const combinedBufferBase64 = btoa(String.fromCharCode(...combinedBuffer));

  // Return the Base64-encoded combined buffer
  return combinedBufferBase64;
};

export const decryptPrivateKey = async (password: string, combinedBufferBase64: string) => {
  // Convert the Base64-encoded combined buffer back to a Uint8Array
  const combinedBuffer = Uint8Array.from(atob(combinedBufferBase64), c => c.charCodeAt(0));

  // Extract the salt (first 16 bytes), IV (next 12 bytes), and the encrypted message (remaining bytes)
  const salt = combinedBuffer.slice(0, 16); // Assuming a 16-byte salt
  const iv = combinedBuffer.slice(16, 28); // Assuming a 12-byte IV
  const encryptedMessage = combinedBuffer.slice(28); // The rest is the encrypted data

  // Derive the encryption key from the password and salt
  const key = await deriveKeyFromPassword(password, salt);

  try {
    // Decrypt the encrypted message using AES-GCM with the derived key and IV
    const decryptedArrayBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedMessage
    );

    // Decode the decrypted ArrayBuffer back to a string
    const decryptedMessage = new TextDecoder().decode(decryptedArrayBuffer);

    // Parse the JSON string back into a JsonWebKey object
    return JSON.parse(decryptedMessage);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};


// conversion utils
const convertJwkToCryptoKey = async (jwk: JsonWebKey, isPrivate: boolean): Promise<CryptoKey> => {
  try {
    let key;

    // Determine the algorithm based on the key type
    if (jwk.kty === "EC") {
      key = await crypto.importKey(
        "jwk",
        jwk,
        {
          name: "ECDH",
          namedCurve: "P-384",
        },
        true,
        isPrivate ? ['deriveKey'] : []
      );
    } else if (jwk.kty === "oct") {
      key = await crypto.importKey(
        "jwk",
        jwk,
        {
          name: "AES-GCM",
        },
        true,
        ['encrypt', 'decrypt']
      );
    } else {
      throw new Error("Unsupported key type");
    }

    return key;
  } catch (error) {
    throw error; // Ensure that errors are still thrown to the calling context
  }
};

const convertCryptoKeyToJwk = async (cryptoKey: CryptoKey): Promise<JsonWebKey> => {
  return await crypto.exportKey("jwk",cryptoKey);
};







export {
    generateKeyPair,
    encryptMessage,
    decryptMessage,
    deriveSharedSecret,
    convertJwkToCryptoKey,
    convertCryptoKeyToJwk,
}