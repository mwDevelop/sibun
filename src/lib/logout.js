//------------------------------ MODULE --------------------------------
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from 'react-native-restart';

//----------------------------- FUNCTION -------------------------------
export default function logout(endEvent = () => {RNRestart.Restart()}){
    //execute
    AsyncStorage.removeItem('access');
    AsyncStorage.removeItem('refresh');
    endEvent();
    return;
}