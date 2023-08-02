//------------------------------ MODULE --------------------------------
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from 'react-native-restart';

//----------------------------- FUNCTION -------------------------------
export default async function logout(endEvent = () => RNRestart.Restart()){
    //execute
    await AsyncStorage.removeItem('access');
    await AsyncStorage.removeItem('refresh');
    endEvent();
    return;
}