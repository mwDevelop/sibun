//------------------------------ MODULE --------------------------------
import { Platform } from  'react-native';
import { useMemo } from  'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import MaIcon from 'react-native-vector-icons/MaterialCommunityIcons';

//---------------------------- COMPONENT -------------------------------
export default function Login(){
    //init
    const navigation = useNavigation();

    //memo
    const buttonGear  = useMemo(() => {
        const buttonList = [
            {
                icon : <MaIcon name='chat' color="#351209" size={33}/>,
                background: '#FFEF61',
                event: () => AsyncStorage.clear()
            },
            {
                icon : <MaIcon name='cellphone' size={40}/>,
                background: 'white',
                event: () => navigation.navigate("로그인 / 회원가입", {page: 0})
            },
            Platform.OS === "ios" ? {
                icon : <MaIcon name='apple' color="white" size={33}/>,
                background: '#333',
                event: () => navigation.replace("Content")
            } : null,              
        ]

        return (
            <>
            {
                buttonList.map((item, index) => item ? (
                    <StyledContentButtonItem key={index} background={item.background} border={item.border} onPress={item.event}>
                        {item.icon}
                    </StyledContentButtonItem>
                ) : null)
            }
            </>
        )
    }, [])

    //render
    return(
        <StyledConatainer>
            <StyledTitleSection>
                <StyledFreePass suppressHighlighting={true} onPress={() => navigation.replace('Content')}>
                    둘러보기
                </StyledFreePass>                
                <StyledTitleTextArea>
                    <StyledTitleMain>SUN</StyledTitleMain>
                    <StyledTitleMain>TALK</StyledTitleMain>
                    {/*<StyledTitleSub>선톡에 오신 것을 환영합니다.</StyledTitleSub>*/}
                </StyledTitleTextArea>
            </StyledTitleSection>
            <StyledContentSection>
                <StyledContentTitle>
                    <StyledContentTitleLine />
                    <StyledContentTitleText>회원가입/로그인 3초만에 하기</StyledContentTitleText>
                </StyledContentTitle>
                <StyledContentButton>
                    {buttonGear}
                </StyledContentButton>
                <StyledFindAccountText suppressHighlighting={true} onPress={() => navigation.navigate('계정찾기')}>
                    이메일로 계정찾기
                </StyledFindAccountText>
            </StyledContentSection>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
`;
const StyledTitleSection = styled.View`
    flex:2;
    align-items:center;
    justify-content:center;
`;
const StyledTitleTextArea = styled.View`
    flex:0.2;
    align-items:center;
    top:5%;
`;
const StyledTitleMain = styled.Text`
    font-size:45px;
    font-weight:800;  
    color:#F33562;
`;
const StyledTitleSub = styled.Text`
    flex:1;
    color:#7A7A7A;
    font-weight:400;  
`;
const StyledContentSection = styled.View`
    flex:1;
    margin:5%;
`;
const StyledContentTitle = styled.View`
    height:70px;
    align-items:center;
    justify-content:center;
`;
const StyledContentTitleLine = styled.View`
    position:absolute;
    background:#E8E8E8;
    height:1px;
    width:100%;
`;
const StyledContentTitleText = styled.Text`
    background:white;
    width:220px;
    font-size:14px;
    font-weight:500;
    text-align:center;
    color:#444;
`;
const StyledContentButton = styled.View`
    flex-direction:row;
    justify-content:space-evenly;
    width:85%;
    align-self:center;  
`;
const StyledContentButtonItem = styled.TouchableOpacity`
    background:${(props) => props.background || '#eee'};
    margin:6px 0;
    width:65px;
    height:65px;
    border-radius:32.5px;
    shadow-color: black; shadow-offset: 5px; shadow-opacity: 0.2; shadow-radius:8px;
    elevation:2;
    justify-content:center;
    align-items:center;
`;
const StyledFindAccountText = styled.Text`
    text-align:center;
    margin:15px;
    font-size:14px;
    color:#7D7D7D;
`;
const StyledFreePass = styled.Text`
    position:absolute;
    top:8%;
    right:8%;
    font-size:14px;
    color:#ccc;
`;
