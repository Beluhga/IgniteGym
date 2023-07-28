import { storageAuthTokenGet, storageAuthTokenSave } from '@storage/storageAuthToken';
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

let filaDeRequisicao: Array<PromiseType> = [];
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
                const configuracaoDaRequisicaoOriginal = RequestError.config; // aqui esta todas as requisiçoes que foram feitas

                if(isRefreshing){
                    return new Promise((resolve, reject) => {
                        filaDeRequisicao.push({
                            onSuccess: (token: string) => {
                                configuracaoDaRequisicaoOriginal.headers = {'Authorization' : `Bearer ${token}`}
                                resolve(api(configuracaoDaRequisicaoOriginal))
                            },
                            onFailure: (error: AxiosError) => {
                                reject(error);
                            },
                        })
                    })
                 }

                isRefreshing = true

                return new Promise(async (resolve, reject) => {
                    try {
                        const {data} = await api.post('/sessions/refresh-token', {refresh_token}) // para buscar o token
                        await storageAuthTokenSave({token: data.token, refresh_token:data.refresh_token}) //para salvar o token
                       
                        if(configuracaoDaRequisicaoOriginal.data){ // para reenviar a requisicao
                            configuracaoDaRequisicaoOriginal.data = JSON.parse(configuracaoDaRequisicaoOriginal.data)
                        }

                        configuracaoDaRequisicaoOriginal.headers = {'Authorization': `Bearer ${data.token}`}
                        api.defaults.headers.common['Authorizarion'] = `Bearer ${data.token} `;

                        filaDeRequisicao.forEach(request => {
                            request.onSuccess(data.token);
                        })

                        console.log("TOKEN ATUALIZADO", )
                        resolve(api(configuracaoDaRequisicaoOriginal)) // para reinviar e processa a requisicao

                    }catch (error: any) {
                        filaDeRequisicao.forEach(request => { // para percorre cara requisicao
                            request.onFailure(error);
                        })

                        signOut();
                        reject(error);
                    } finally {
                        isRefreshing = false;
                        filaDeRequisicao = [];
                    }


                });
                
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

