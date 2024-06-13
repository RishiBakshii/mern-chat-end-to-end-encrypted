import { DB_NAME, OBJECT_STORE, VERSION } from "../constants";
import { convertCryptoKeyToJwk } from "./encryption";

const indexDb = window.indexedDB

const initializeIndexDb = ()=>{

    if (!indexDb) {
        console.log("IndexedDB could not be found in this browser.");
        return 
    }
    
    const request = indexedDB.open(DB_NAME, VERSION)

    request.onupgradeneeded = function () {

        const db = request.result;

        if (!db.objectStoreNames.contains(OBJECT_STORE)) {
            db.createObjectStore(OBJECT_STORE, { keyPath: "_id" });
        }

        if(!db.objectStoreNames.contains("sharedKeys")){
            db.createObjectStore("sharedKeys",{keyPath:"_id"})
        }
    };
    
    request.onsuccess = function () {

    };

    request.onerror = function (event) {
        console.error("An error occurred with IndexedDB");
        console.error(event);
    };
}

const storePrivateKey = async (userId:string,key:JsonWebKey) => {

    const request = indexedDB.open(DB_NAME,VERSION);

    request.onsuccess = function () {
        const db = request.result
        const transaction = db.transaction(OBJECT_STORE, "readwrite");
        const store = transaction.objectStore(OBJECT_STORE);

        const putRequest = store.put({_id:userId,privateKey:key});

        putRequest.onsuccess = function () {
        };

        putRequest.onerror = function () {
            console.error("Error adding private key");
        };

        transaction.oncomplete = function () {
            db.close();
        };
    };
};

const getPrivateKey = async (userId: string): Promise<JsonWebKey | null> => {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, VERSION);

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction(OBJECT_STORE, "readonly");
            const store = transaction.objectStore(OBJECT_STORE);

            const getRequest = store.get(userId);

            getRequest.onsuccess = function () {

                const privatekey = getRequest.result?.privateKey
                if(privatekey){
                    console.log(getRequest.result);
                    resolve(privatekey)
                }
                else{
                    resolve(null)
                }
            };

            getRequest.onerror = function () {
                console.error("Error retrieving private key");
                reject(null)
            };

            transaction.oncomplete = function () {
                db.close();
            };
        };

        request.onerror = function (event) {
            console.error("Error opening database:", event);
            reject(null);
        };
    });
};

const storeSharedKey = async (userId1: string, userId2: string, sharedKey: CryptoKey) => {
    const sharedKeyJwk = await convertCryptoKeyToJwk(sharedKey); // Convert the key before opening the transaction

    const request = indexedDB.open(DB_NAME, VERSION);

    request.onsuccess = function() {
        const db = request.result;
        const transaction = db.transaction('sharedKeys', 'readwrite');
        const store = transaction.objectStore('sharedKeys');

        const putRequest = store.put({
            _id: `${userId1}${userId2}`,
            sharedKey: sharedKeyJwk,
        });

        putRequest.onsuccess = function () {
        };

        putRequest.onerror = function () {
            console.error("Error adding shared key");
        };

        transaction.oncomplete = function () {
            db.close();
        };
    };

    request.onerror = (event) => {
        console.error('Database error:', event);
    };
};



const getStoredSharedKey = async (userId1: string, userId2: string): Promise<JsonWebKey | null> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, VERSION);
    
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction('sharedKeys', 'readonly');
            const store = transaction.objectStore('sharedKeys');
    
            const getRequest = store.get(`${userId1}${userId2}`);
    
            getRequest.onsuccess = function () {
                if (getRequest.result) {
                    const storedSharedKey = getRequest.result?.sharedKey as JsonWebKey
                    resolve(storedSharedKey)
                } else {
                    resolve(null);
                }
            };
    
            getRequest.onerror = function (event) {
                console.error('Error retrieving shared key:', event);
                resolve(null);
            };
        };
    
        request.onerror = function (event) {
            console.error('Database error:', event);
            reject(event);
        };
    });
};

  



export {
    getPrivateKey,
    getStoredSharedKey,
    initializeIndexDb,
    storePrivateKey,
    storeSharedKey
};

