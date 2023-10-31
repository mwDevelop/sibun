//------------------------------ MODULE --------------------------------
import axios from "axios";
import Config from 'react-native-config';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    async(config) => {
        if(config.headers.Authorization){
            const accessToken = await AsyncStorage.getItem(config.headers.Authorization);
            if(accessToken) config.headers.Authorization = `Bearer ${accessToken}`; //exit when token is empty
        };
        config.url += `?secret_key=${Config.APP_API_SECRET}`; 
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiCall.interceptors.response.use(
    async(response) => {
        const expiredCode = "020";
        if(response.data.result == expiredCode){ //case access_token expired
            //console.log('* ACCESS EXPIRED ...');
            const refreshToken = await AsyncStorage.getItem('refresh');
            if(!refreshToken) return refreshResult; //exit when token is empty
            const refreshResult = await axios.get(`${Config.APP_API_URL}/auth/refresh`, {headers : {Authorization : `Bearer ${refreshToken}`}});
            if(refreshResult.data.result == "000"){
                //console.log('* TOKEN REFRESHED ...');
                const originalRequest = response.config;
                AsyncStorage.setItem('access', refreshResult.data.access_token);
                AsyncStorage.setItem('refresh', refreshResult.data.refresh_token);                
                originalRequest.headers.Authorization = 'access';
                //console.log('* REQUEST RETRYING ...');
                return apiCall(originalRequest);
            }else{
                //console.log('* REFRESH EXPIRED ...');
                AsyncStorage.removeItem('access');
                AsyncStorage.removeItem('refresh');               
                return refreshResult;
            }
        }
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