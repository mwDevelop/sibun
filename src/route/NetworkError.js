//------------------------------ MODULE --------------------------------
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NetInfo from "@react-native-community/netinfo";

//---------------------------- COMPONENT -------------------------------
export default function NetworkError(){
    //init
    const navigation = useNavigation();

    //function
    const checkNetwork = () => {
        NetInfo.fetch().then(state => {
            console.log(state.isConnected);
            if(state.isConnected) navigation.goBack();
            else return;
        });
    }

    //render
    return (
        <StyledConatainer>
            <StyledIcon name="wifi-off"/>
            <StyledMain>오프라인 상태입니다.</StyledMain>
            <StyledDesc>네트워크 연결 확인 후 다시 시도해주세요.</StyledDesc>
            <StyledButton>
                <StyledButtonText onPress={checkNetwork}>다시 시도하기</StyledButtonText>
            </StyledButton>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
    align-items:center;
    justify-content:center;
`;
const StyledIcon = styled(Icon)`
    font-size:80px;
    color:#444;
`;
const StyledMain = styled.Text`
    font-weight:600;
    font-size:20px;
    color:#888;
    margin:5px; 0;
`;
const StyledDesc = styled.Text`
    font-size:15px;
    color:#888;
    margin-bottom:20px;
`;
const StyledButton = styled.TouchableOpacity`
    margin:5px 0;
    width:40%;
    height:45px;
    border-width:1px;
    border-color:#777;
    align-items:center;
    justify-content:center;
    border-radius:30px;
`;
const StyledButtonText = styled.Text`
    font-weight:600;
    color:#666;
`;