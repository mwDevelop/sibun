//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNRestart from 'react-native-restart';

//---------------------------- COMPONENT -------------------------------
export default function ErrorFallback(){
    //render
    return (
        <StyledConatainer >
            <StyledMessage>
                <StyledTitle>앱 실행 중</StyledTitle>
                <StyledTitle>문제가 발생 하였습니다!</StyledTitle>
                <StyledSub>홈으로 버튼을 눌러 다시 실행 해 주세요.</StyledSub>
            </StyledMessage>
            <StyledButton onPress={() => RNRestart.restart()}>
                <StyledButtonText>홈 으 로</StyledButtonText>
            </StyledButton>
        </StyledConatainer>        
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    height:100%;
    background: black;
`;
const StyledMessage = styled.View`
    padding: 70px 30px;
`;
const StyledTitle = styled.Text`
    font-size:28px;
    color:white;
    font-weight:bold;
`;
const StyledSub = styled.Text`
    font-size:18px;
    margin-top:18px;
    color:#555;
`;
const StyledButton = styled.TouchableOpacity`
    background:tomato;
    height:40px;
    margin:80% 30px 20% 30px;
    align-items:center;
    justify-content:center;
    border-radius: 10px;
`;
const StyledButtonText = styled.Text`
    color:white;
    font-weight:bold;
    font-size: 20px;
`;