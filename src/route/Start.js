//------------------------------ MODULE --------------------------------
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { korean_logo } from '@/assets/img';
import { useNavigation } from '@react-navigation/native';

//---------------------------- COMPONENT -------------------------------
export default function Start(){
    //init
    const navigation = useNavigation();
    
    //render
    return (
        <StyledConatainer>
            <StyledLogo source={korean_logo} resizeMode='contain'/>      
            <StyledDesc>{'언제 어디서나 원하는 시간을 간편하게 예약해 보세요.\n내가 원하는 시간으로 내 일정에 맞춰 바로 예약!'}</StyledDesc>
            <StyledNextButton onPress={() => navigation.replace("Intro")}>시작하기</StyledNextButton>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
    align-items:center;
`;
const StyledLogo = styled(FastImage)`
    margin-top:60%;
    height:150px;
    width:40%;
`;
const StyledDesc = styled.Text`
    text-align:center;
    line-height:23px;
    color:#444;
    font-weight:500;
    font-size:15px;
`;
const StyledNextButton = styled.Text`
    position:absolute;
    bottom:50px;  
    right:25px;
    font-weight:400;
    font-size:16px;
    color:#F33562;
`;