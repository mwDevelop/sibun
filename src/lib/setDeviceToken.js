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
  	const enabled = (
		authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
		authStatus === messaging.AuthorizationStatus.PROVISIONAL
  	);

	//push permission for android
	if (Platform.OS == "android") requestNotifications(["alert", "sound"]);

	//set device code in server 
	const headers = {"Authorization" : "access"};
  	if(enabled) {
		await messaging()
			.getToken()
			.then(fcmToken => {
				const params = {"mb_device_token" : fcmToken};
				apiCall.post(`/user/me`, {...params}, {headers})
					.then((r) => {
						if(r.data.result != "000" && r.data.result != "001") console.log(r.data); //api error
					})
					.catch((e) => console.log(e)); //network error
			})
			.catch(e => console.log('error: ', e));
  	}else{
		const params = {"mb_device_token" : ''}; //make token empty
		apiCall.post(`/user/me`, {...params}, {headers})
			.then((r) => {
				if(r.data.result != "000" && r.data.result != "001") console.log(r.data); //api error
			})
			.catch((e) => console.log(e)); //network error
	}
}