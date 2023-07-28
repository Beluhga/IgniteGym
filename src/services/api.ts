import { storageAuthTokenGet } from '@storage/storageAuthToken';
import { AppError } from '@utils/AppError';
import axios, {AxiosError, AxiosInstance} from 'axios';

type SignOut = () => void;

type PromiseType = {
    onSuccess: (token: string) => void;
    onFailure: (error: AxiosError) => void;
}

type APIInstanceProps = AxiosInstance & {
    registerInterceptTokenManager: (signOut: SignOut ) => () => void; // interceptação da resposta
}

const api = axios.create({
    baseURL: 'http://192.168.0.8:3333',
    timeout: 1000,
}) as APIInstanceProps;

let feiledQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = signOut => {
    const interceptTokenManager = api.interceptors.response.use(response => response, async (RequestError) => {
        if(RequestError?.response?.status === 401){ // status de não autorizado
            if(RequestError.response.data?.message === 'token.expired' || RequestError.response.data?.message === 'token.invalid'){ // se o token da invalido ou expirado
                const {refresh_token} = await storageAuthTokenGet(); // reculpera o refresh_token, que esta armazenada no dispositivo(storageAuthTokenGet())

                if(!refresh_token){
                    signOut(); // para deslogar caso nao tenha o refresh_token
                    return Promise.reject(RequestError) // para rejeitar e devolver o requestError
                }
                const configuracaoDaRequisicaoOriginal = RequestError.config;

                if(isRefreshing){
                    return new Promise((resolve, reject) => {
                        feiledQueue.push({
                            onSuccess: (token: string) => {
                                configuracaoDaRequisicaoOriginal.headers = {'authorization' : `Bearer ${token}`}
                            },
                            onFailure: () => {},
                        })
                    })
                 }

                isRefreshing = true
                
            }

            signOut(); // fluxo novo de autenticação
        }



        if(RequestError.response && RequestError.response.data){
            return Promise.reject(new AppError(RequestError.response.data.message))
        } else {
            return Promise.reject(RequestError);
        }
    }); // resposta = acessa todas as informções da requisição que esta sendo feita. error = pra quando der errado oq irar ser feito

    return ( ) => {
        api.interceptors.response.eject(interceptTokenManager); // para fazer a interceptacao, responde e ejetae o "interceptTokenManager" 
    };  
};


export {api};

