//------------------------------ MODULE --------------------------------
import AsyncStorage from "@react-native-async-storage/async-storage";

//----------------------------- FUNCTION -------------------------------
export default async function firstLaunch(){
    try{
        const isFirstLaunched = await AsyncStorage.getItem('firstLaunch');
        if(isFirstLaunched == null){
            AsyncStorage.setItem('firstLaunch', 'true');
            return true;
        }
        return false;
    }catch(error){
        return false;
    }
}