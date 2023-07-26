import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageAuthTokenGet, storageAuthTokenSave, storageAuthTokenRemove } from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { ReactNode, createContext, useEffect, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO;
    atualizarProfileUsuario: (userUpdate: UserDTO) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoadingUserStorageData: boolean;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps){
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true); // usado quando esta fazendo uma leitura de dados no celular do usuario

    async function userAndTokenUpdate(userData: UserDTO, token:string) {

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        setUser(userData);
    }

    async function storageUserAndTokenSave(userData: UserDTO, token:string){
        try{
        setIsLoadingUserStorageData(true)
        
        await storageUserSave(userData);
        await storageAuthTokenSave(token);

        }catch (error){
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
        
    }
 
    async function signIn(email: string, password: string){
        try {
       const {data} = await api.post('/sessions', {email, password})

       if(data.user && data.token){
        await storageUserAndTokenSave(data.user, data.token);
        userAndTokenUpdate(data.user, data.token);
       }
    } catch (error) {
        throw error
    } finally {
        setIsLoadingUserStorageData(false);

    }
}

    async function signOut() {
    try {
        setIsLoadingUserStorageData(true)
        
        setUser({} as UserDTO) // mostra quando o usuario nao esta logado
        await storageUserRemove();
        await storageAuthTokenRemove();

    }catch (error){
        throw error;
    } finally {
        setIsLoadingUserStorageData(false)
    }
}

    async function atualizarProfileUsuario(userUpdated: UserDTO) {
        try {
            setUser(userUpdated); // atualiza o nome do usuario no estado
            await storageUserSave(userUpdated); //para quando o usuario voltar, a conta esta atualizada

        } catch (error){
            throw error;

        }
    }

    async function loadUserData() {
    try{
    setIsLoadingUserStorageData(true)

    const userLogged = await storageUserGet();
    const token = await storageAuthTokenGet();

    if(token && userLogged){
        userAndTokenUpdate(userLogged, token) 
    }

} catch (error){
    throw error;

} finally {
    setIsLoadingUserStorageData(false);
}
}

    useEffect(() => {
    loadUserData();
}, [])


    return (
        <AuthContext.Provider value={{ 
            user, 
            signIn,
            signOut,
            isLoadingUserStorageData,
            atualizarProfileUsuario
             }}>
            {children}
          </AuthContext.Provider>
    )
}