//------------------------------ MODULE --------------------------------
import axios from "axios";
import Config from 'react-native-config';

//----------------------------- FUNCTION -------------------------------
axios.default.withCredentials = true;

const apiCall = axios.create({
    baseURL: `${Config.APP_API_URL}`,
    headers: { 
        "Content-Type": "application/json"
    },
    timeout: 5000,
    withCredentials: true,    
});

apiCall.interceptors.request.use(
    (config) => {
        config.url += `?secret_key=${Config.APP_API_SECRET}`; 
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiCall.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { config, response: { status } } = error;
        const originalRequest = config;
        
        if(status === 401){

        }else if(status === 410){

        }

        return Promise.reject(error);
    }
);

export default apiCall;