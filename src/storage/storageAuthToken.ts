import AsyncStorage from "@react-native-async-storage/async-storage";

import { AUTH_TOKEN_STORAGE } from "./storageConfig";

type storageAuthTokenProps = {
    token: string;
    refresh_token: string; // ele serve para gerar um novo token atualizado
}

export async function storageAuthTokenSave({token, refresh_token} : storageAuthTokenProps) {
    await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, JSON.stringify({token, refresh_token})); //JSON.stringify({token, refresh_token}) pq o {token, refresh_token} é são objetos 
}

export async function storageAuthTokenGet(){
    const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);

    const {token, refresh_token} : storageAuthTokenProps = response ? JSON.parse(response) : {}; // JSON.parse(response) convertendo para um objeto

    return {token, refresh_token};
}
export async function storageAuthTokenRemove(){
    await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);

}