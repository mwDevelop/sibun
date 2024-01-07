//------------------------------ MODULE --------------------------------
import messaging from '@react-native-firebase/messaging';
import { apiCall } from '@/lib';
import { Platform } from 'react-native';
import { requestNotifications } from "react-native-permissions";

//----------------------------- FUNCTION -------------------------------
export default async function setDeviceToken(){
	//permission for device token 
	//ANDROID : authorized default for android
	//IOS : including push permission 
  	const authStatus = await messaging().requestPermission();
  	let enabled = (
		authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
		authStatus === messaging.AuthorizationStatus.PROVISIONAL
  	);

	//push permission filter for android
	if (Platform.OS == "android"){
		const androidRes = await requestNotifications(["alert", "sound"]);
		enabled = (androidRes.status == "granted");
	};

	//get device token
	const headers = {"Authorization" : "access"};
	const tokenValue = enabled ? await messaging().getToken() : '';
	const params = {"mb_device_token" : tokenValue};

	//set device token in server
	apiCall.post(`/user/me`, {...params}, {headers})
		.then((r) => {
			if(r.data.result != "000" && r.data.result != "001") console.log(r.data); //api error
		})
		.catch((e) => console.log(e)); //network error	
}