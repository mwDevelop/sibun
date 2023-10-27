//------------------------------ MODULE --------------------------------
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NetInfo from "@react-native-community/netinfo";
import { rw, rh } from '@/data/globalStyle';

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
    font-size:${rw*80}px;
    color:#444;
`;
const StyledMain = styled.Text`
    font-weight:600;
    font-size:${rw*20}px;
    color:#888;
    margin:${rh*5}px; 0;
`;
const StyledDesc = styled.Text`
    font-size:${rw*15}px;
    color:#888;
    margin-bottom:${rh*20}px;
`;
const StyledButton = styled.TouchableOpacity`
    margin:${rh*5}px 0;
    width:40%;
    height:${rh*45}px;
    border-width:${rw*1};
    border-color:#777;
    align-items:center;
    justify-content:center;
    border-radius:${rw*30}px;
`;
const StyledButtonText = styled.Text`
    font-weight:600;
    color:#666;
`;