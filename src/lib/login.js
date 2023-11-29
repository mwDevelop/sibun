//------------------------------ MODULE --------------------------------
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiCall, setDeviceToken } from '@/lib';

//----------------------------- FUNCTION -------------------------------
export default async function login(phone){
    const params = { mb_cellphone: phone };
    const loginTryResult = await apiCall.post('/auth/loginv2', {...params});

    if(loginTryResult.data.result == "000"){ //LOGIN
        AsyncStorage.setItem('access', loginTryResult.data.access_token);
        AsyncStorage.setItem('refresh', loginTryResult.data.refresh_token);

        //set device tokne for push alert
        setDeviceToken();

        return "success";
    }else if(loginTryResult.data.result == "001") return "join"; //JOIN
    else return "error"; //ERROR
}