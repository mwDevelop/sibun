//------------------------------ MODULE --------------------------------
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';

//---------------------------- COMPONENT -------------------------------
export default function Welcome(){
    //init
    const navigation = useNavigation();

    //render
    return (
        <StyledConatainer>
            <StyledHeader>
                <StyledHeaderText>{"000님\n\가입을 축하드립니다!"}</StyledHeaderText>
                <StyledHeaderSubText>할인 쿠폰을 적용할 수 있는 매장을 보러갈까요?</StyledHeaderSubText>
            </StyledHeader>
            <StyledBody>
                <StyledImage source={{uri:"https://media.tenor.com/gbdwfQLxMXQAAAAC/good-taste-nice.gif", priority: FastImage.priority.normal}}/>
            </StyledBody>
            <StyledFooter>
                <StyledConfirm onPress={() => navigation.replace("Content")}>
                    <StyledConfirmText>
                        보러가기
                    </StyledConfirmText>
                </StyledConfirm>
                <StyledConfirmSubText onPress={() => navigation.replace("Content")}>
                    다음에 볼게요
                </StyledConfirmSubText>
            </StyledFooter>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
    padding: 0 20px;
`;
const StyledHeader = styled.View`
    flex:1;
    justify-content:flex-end;
`;
const StyledHeaderText = styled.Text`
    font-size:20px;
    font-weight:600;
    color:#222;
    margin: 5px 0;
`;
const StyledHeaderSubText = styled.Text`
    font-size:14px;
    font-weight:400;
    color:#7D7D7D;
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
    align-items:center;
    justify-content:center;
`;
const StyledConfirm = styled.TouchableOpacity`    
    border-color:#DDD;
    border-width:1px;
    width:100%;
    height:50px;
    background:#444;
    border-radius:50px;
    align-items:center;
    justify-content:center;
`;
const StyledConfirmText = styled.Text`    
    font-size:16px;
    font-weight:500;
    color:#fff;
`;
const StyledConfirmSubText = styled.Text`    
    font-size:12px;
    font-weight:500;
    color:#999;
    margin:10px 0;
`;