//------------------------------ MODULE --------------------------------
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { welcome } from '@/assets/img';
import { rw, rh } from '@/data/globalStyle';

//---------------------------- COMPONENT -------------------------------
export default function JoinSuccess({route}){
    //init
    const { name, destination } = route.params;
    const navigation = useNavigation();

    //render
    return (
        <StyledConatainer>
            <StyledBody>
                <StyledImageBox>
                    <StyledImage source={welcome} resizeMode="contain"/>
                    <StyledSmallText>가입 완료!</StyledSmallText>
                </StyledImageBox>
                <StyledLargeText>{name}님, 환영합니다</StyledLargeText>
            </StyledBody>
            <StyledFooter>
                <StyledConfirm onPress={() => navigation.replace(destination)} suppressHighlighting={true}>
                    확인
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
const StyledBody = styled.View`
    justify-content:flex-end;
    align-items:center;
    flex:1.2;
`;
const StyledImageBox = styled.View`
    align-items:center;
`;
const StyledImage = styled(FastImage)`
    width:${rw*90}px;
    height:${rh*90}px;
    left:${rw*13}px;
    margin-bottom:${rh*5}px;
`;
const StyledSmallText = styled.Text`
    font-size:${rw*15}px;
    font-weight:500;
    color:rgba(243, 53, 98, 0.98);
    margin:${rh*10}px 0;
`;
const StyledLargeText = styled.Text`
    font-size:${rw*20}px;
    font-weight:600;
    color:#222;
`;
const StyledFooter = styled.View`
    padding:${rh*15}px;
    justify-content:flex-end;
    flex:1;
`;
const StyledConfirm = styled.Text`    
    border-radius:5px;
    line-height:48px
    background:#F33562;
    overflow:hidden;
    text-align:center;
    color:#fff;
    font-size:${rw*15}px;
    font-weight:600;
    margin-bottom:${rh*35}px;
`;