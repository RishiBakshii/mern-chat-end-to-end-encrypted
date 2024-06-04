import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const isFetchBaseQueryError=(error: unknown):error is FetchBaseQueryError=>{
    return typeof error === 'object' && error != null && 'status' in error
}

const isErrorWithMessage=(error: unknown):error is { status:number ,data: {message:string} }=>{
    return (
      typeof error === 'object' &&
      error != null &&
      'data' in error &&
      typeof (error as any).data.message === 'string'
    )
  }

const printDraft = (data:unknown)=>{
  console.log(JSON.parse(JSON.stringify(data)));
}

const base64ToArrayBuffer=(base64:any)=>{
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convert Uint8Array to Base64
const uint8ArrayToBase64 = (array:any) => {
  return btoa(String.fromCharCode.apply(null, array));
};

// Convert Base64 to Uint8Array
const base64ToUint8Array = (base64:string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};


export {
    isFetchBaseQueryError,
    isErrorWithMessage,
    printDraft,
    base64ToArrayBuffer,
    uint8ArrayToBase64,
    base64ToUint8Array,
}