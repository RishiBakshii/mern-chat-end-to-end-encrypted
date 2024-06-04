import { DB_NAME, OBJECT_STORE, VERSION } from "../../constants";
import { selectLoggedInUser } from "../../services/redux/slices/authSlice";
import { useAppSelector } from "../../services/redux/store/hooks";

export const usePrivateKey = () => {


    const loggedInUserId = useAppSelector(selectLoggedInUser)?._id

    return new Promise((resolve, reject) => {

        if(loggedInUserId){

            const request = indexedDB.open(DB_NAME, VERSION);
    
            request.onsuccess = function () {
                const db = request.result;
                const transaction = db.transaction(OBJECT_STORE, "readonly");
                const store = transaction.objectStore(OBJECT_STORE);
    
                const getRequest = store.get(loggedInUserId);
    
                getRequest.onsuccess = function () {
    
                    const privatekeyData = getRequest.result?.privateKey as JsonWebKey
                    if(privatekeyData){
                        resolve(privatekeyData)
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
        }
    }) as Promise<JsonWebKey | null>
}
