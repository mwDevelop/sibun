//------------------------------ MODULE --------------------------------
import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';

//----------------------------- FUNCTION -------------------------------
export default function errorAlert(extraComment = '', endEvent = () => RNRestart.Restart()){
    //execute
    Alert.alert(
        `${extraComment} 문제가 발생하였습니다.`,
        "관리자에게 문의 해 주세요.",
        [
            {
                text: "돌아가기",
                onPress: () => {
                    endEvent();
                },
            },
        ]
    );
}