import { LocalStorageKeys } from "../../enums/localStorage"

export const useLocalStorage = (key:LocalStorageKeys) => {


    if(localStorage.getItem(key)===null){
        localStorage.setItem(key,'false')
    }
    return localStorage.getItem(key)
}
