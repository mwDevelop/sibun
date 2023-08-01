//------------------------------ MODULE --------------------------------
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';

//---------------------------- COMPONENT -------------------------------
export default function JoinSuccess(){
    //init
    const navigation = useNavigation();

    //render
    return (
        <StyledConatainer>
            <StyledHeader>
                <StyledHeaderText>회원가입이 완료됐어요 !</StyledHeaderText>
            </StyledHeader>
            <StyledBody>
                <StyledImage source={{uri:"https://media.tenor.com/gbdwfQLxMXQAAAAC/good-taste-nice.gif", priority: FastImage.priority.normal}}/>
            </StyledBody>
            <StyledFooter>
                <StyledConfirm onPress={() => navigation.replace("Welcome")}>
                    <StyledConfirmText>
                        확인
                    </StyledConfirmText>
                </StyledConfirm>
            </StyledFooter>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
`;
const StyledHeader = styled.View`
    flex:1;
    align-items:center;
    justify-content:flex-end;
`;
const StyledHeaderText = styled.Text`
    font-size:20px;
    font-weight:600;
    color:#222;
`;
const StyledBody = styled.View`
    flex:2;
    justify-content:center;
    align-items:center;
`;
const StyledImage = styled(FastImage)`
    width:300px;
    height:300px;
`;
const StyledFooter = styled.View`
    flex:1;
    justify-content:center;
    align-items:center;
`;
const StyledConfirm = styled.TouchableOpacity`    
    border-color:#DDD;
    border-width:1px;
    width:90%;
    height:50px;
    border-radius:50px;
    align-items:center;
    justify-content:center;
`;
const StyledConfirmText = styled.Text`    
    font-size:16px;
    font-weight:500;
`;