import { AppError } from '@utils/AppError';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.0.8:3333',
    timeout: 1000,
});

api.interceptors.response.use(response => response, error => {
    if(error.response && error.response.data){
        return Promise.reject(new AppError(error.response.data.message))
    } else {
        return Promise.reject(error);
    }
}); // resposta = acessa todas as informções da requisição que esta sendo feita. error = pra quando der errado oq irar ser feito

export {api};

