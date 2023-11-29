//------------------------------ MODULE --------------------------------
import { Platform } from  'react-native';
import { useMemo, useLayoutEffect } from  'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import MaIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {login_kakao, login_apple, login_mobile} from '@/assets/img';
import FastImage from 'react-native-fast-image';
import {errorToast} from '@/data/constants';
import { korean_logo } from '@/assets/img';

//---------------------------- COMPONENT -------------------------------
export default function Login({route}){
    //init
    const tabFlag = route.params && "icon" in route.params ? true : false;
    const expiredFlag = route.params && "expired" in route.params ? true : false;
    const afterLoginPage = null;
    const navigation = useNavigation();

    //state

    //memo
    const headerGear = useMemo(() => (
        <>
        {
        tabFlag ? null : (
            <StyledFreePass suppressHighlighting={true} onPress={() => navigation.replace('Content')}>
                둘러보기
            </StyledFreePass>                
        )
        }
        <StyledTitleArea>
            <StyledTitleLogo source={korean_logo} resizeMode='contain'/>
        </StyledTitleArea>
        </>
    ), []);

    const contentTitleGear = useMemo(() => (
        <StyledContentTitle>
            <StyledContentTitleLine />
            <StyledContentTitleText>회원가입/로그인 3초만에 하기</StyledContentTitleText>
        </StyledContentTitle>
    ), []);

    const extraGear = useMemo(() => (
        <StyledFindAccountText suppressHighlighting={true} onPress={() => navigation.push('계정찾기')}>
            이메일로 계정찾기
        </StyledFindAccountText>
    ), []);

    const buttonGear  = useMemo(() => {
        const buttonList = [
            /*
            {
                icon : <MaIcon name='chat' color="#351209" size={33}/>,
                background: '#FFEF61',
                img: login_kakao,
                event: () => Toast.show(errorToast)
            },
            */
            {
                icon : <MaIcon name='cellphone' size={40}/>,
                background: 'white',
                img: login_mobile,
                event: () => navigation.navigate("로그인 / 회원가입", {page: 0, finalDestination: afterLoginPage || 'Content'})
            },
            /*
            Platform.OS === "ios" ? {
                icon : <MaIcon name='apple' color="white" size={33}/>,
                background: '#333',
                img: login_apple,
                event: () => Toast.show(errorToast)
            } : null,              
            */
        ]

        return (
            <>
            {
                buttonList.map((item, index) => item ? (
                    <StyledContentButtonItem key={index} onPress={item.event}>
                        <StyledContentButtonImage source={item.img}/>
                    </StyledContentButtonItem>
                ) : null)
            }
            </>
        )
    }, [])

    //effect
    useLayoutEffect(() => {
        if(expiredFlag){
            Toast.show({
                type: 'bad',
                text1: route.params.expired,
                topOffset: 120,
                visibilityTime: 1000
            })
        }
    }, []);

    //render
    return(
        <StyledConatainer>
            <StyledTitleSection>
                {headerGear}
            </StyledTitleSection>
            <StyledContentSection>
                {contentTitleGear}
                <StyledContentButton>
                    {buttonGear}
                </StyledContentButton>
                {/*extraGear*/}
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
const StyledTitleArea = styled.View`
    flex:0.2;
    align-items:center;
    top:5%;
`;
const StyledTitleLogo = styled(FastImage)`
    height:60px;
    width:300px;
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
`;
const StyledContentButtonImage = styled(FastImage)`
    width:80px;
    height:80px;
`;
const StyledFindAccountText = styled.Text`
    text-align:center;
    margin:15px;
    font-size:14px;
    color:#7D7D7D;
`;
const StyledFreePass = styled.Text`
    position:absolute;
    top:5%;
    right:8%;
    font-size:14px;
    color:#ccc;
`;