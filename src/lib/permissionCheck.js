//------------------------------ MODULE --------------------------------
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import { Alert, Linking } from 'react-native';
import { Platform } from 'react-native';

//----------------------------- FUNCTION -------------------------------
/* 
    권한 허용 프로세스
    IOS 
        이번한번만 -> 다음번 DENIED
        항상허용 -> 다음번 GRANTED 거절시 BLOCKED
        앱사용시허용 -> 다음번 GRANTED 거절시 BLOCKED
        => 따라서 BLOCKED 경우 SETTING으로 리다이렉트
        => DENIED 경우 request 요청
        * 사진저장소의 경우 제한된 사진 선택의 경우 LIMITED 상태
    ANDOIRD
        허용시 바로 GRANTED
        허용하지 않을 경우 DENIED (but 두번째 요청부터는 request 시 blocked return)
        => DENIED일 경우 계속해서 request 요청 but blocked return 될 경우는 SETTING으로 리다이렉트
*/

export default async function permissionCheck(type, onlyChk = false){
    try{
        const os = Platform.OS;
        const version = Platform.Version;
        const options = {
            'ios' : {
                'location' : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                'camera' : PERMISSIONS.IOS.CAMERA,
                'photo' : PERMISSIONS.IOS.PHOTO_LIBRARY,
            },
            'android' : {
                'location' : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                'camera' : PERMISSIONS.ANDROID.CAMERA,
                'photo' : PERMISSIONS.ANDROID[version >= 33 ? 'READ_MEDIA_IMAGES' : 'READ_EXTERNAL_STORAGE'],
            }
        }
    
        const messages = {
            'location' : "주변매장 확인을 위해 위치 권한 허용이 필요합니다.",
            'camera' : "사진촬영을 위한 카메라 사용 권한 허용이 필요합니다.",
            'photo' : "사진업로드를 위한 사진 사용 권한 허용이 필요합니다."
        }    
    
        return new Promise((resolve, reject) => {
            const settingAlert = () => {
                Alert.alert(
                    messages[type],
                    "앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.",
                    [
                        {
                            text: "네",
                            onPress: () => {
                                Linking.openSettings();
                                resolve('any result');
                            },
                        },
                        {
                            text: "아니오",
                            onPress: () => {
                                resolve('any result');
                            },
                            style: "cancel",
                        },
                    ]
                );
            }
    
            check(options[os][type])
            .then((result) => {
                switch (result) {
                    case RESULTS.DENIED:
                        console.log('The permission has not been requested / is denied but requestable');
                        request(options[os][type]).then((res) => {
                            if(os == 'android' && res == 'blocked' && !onlyChk) settingAlert();
                            resolve('denied');
                        }).catch((error) => console.log(error));
                        break;
                    case RESULTS.BLOCKED:
                        console.log('The permission is denied and not requestable anymore');
                        settingAlert();
                        break;
                    case RESULTS.UNAVAILABLE:
                        console.log('This feature is not available (on this device / in this context)');
                        resolve('unavailable');
                        break;
                    case RESULTS.LIMITED:
                        console.log('The permission is limited: some actions are possible');
                        resolve('limited');
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        resolve('granted');
                        break;
                }
            })
            .catch((error) => {
                console.log(error);
            });
        })
    }catch(e){
        console.log(e);
        return false;
    }
}