//------------------------------ MODULE --------------------------------
import { useLayoutEffect, useState, useMemo } from 'react';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { chat_balloon, document_open, star_road } from '@/assets/img';
import { logout } from '@/lib';
import AwesomeAlert from 'react-native-awesome-alerts';
import { alertDefaultSetting } from '@/data/constants';
import { useUser } from '@/hooks';
import { rw, rh } from '@/data/globalStyle';

//---------------------------- COMPONENT -------------------------------
export default function Mypage(){
    //init
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    //data
    const [ userData, userUpdate ] = useUser();

    //state
    const [logoutAlert, setLogoutAlert] = useState(false);

    //memo
    const profileGear = useMemo(() => {
        const profileMenuList = [
            {
                icon: chat_balloon,
                iconSize:[rw*27,rw*22],
                text: "내후기",
                link: "리뷰관리"
            },
            {
                icon: document_open,
                iconSize:[rw*22,rw*22],
                text: "예약내역",
                link: "예약내역"
            },
            {
                icon: star_road,
                iconSize:[rw*17,rw*22],
                text: "찜한매장",
                link: "찜한 매장"
            }
        ]

        return (
            <StyledProfile>
                <StyledProfileInfo>
                    <StyledProfileName>
                        <StyledProfileNameText>
                            {userData?.mb_name} 님
                        </StyledProfileNameText>
                        <StyledProfileNameEdit onPress = {() => navigation.navigate("프로필 수정")} >
                            프로필 수정하기
                        </StyledProfileNameEdit>
                    </StyledProfileName>
                    <StyledProfileImage source={{uri:userData?.mb_profile_img, priority: FastImage.priority.normal}}/>
                </StyledProfileInfo>
                <StyledProfileMenu>
                    {
                        profileMenuList.map((item, index) => (
                            <StyledProfileMenuItem key={index} onPress = {() => navigation.navigate(item.link)}>
                                <Image source={item.icon} style={{width:item.iconSize[0], height:item.iconSize[1]}}/>
                                <StyledProfileMenuItemText>{item.text}</StyledProfileMenuItemText>
                            </StyledProfileMenuItem>
                        ))
                    }
                </StyledProfileMenu>
            </StyledProfile>            
        )
    }, [userData]);

    const menuGear = useMemo(() => {
        const navList = [
            {
                title: "최근 본 매장",
                link: "최근 본 매장"
            },
            {
                title: "매장 히스토리",
                link: "home"
            },
            {
                title: "1:1 문의",
                link: "home"
            },
            {
                title: "고객센터",
                link: "home"
            },
            {
                title: "공지사항",
                link: "home"
            },
            {
                title: "알림설정",
                link: "home"
            },
            {
                title: "앱 이용안내",
                link: "home"
            },
            {
                title: "회원탈퇴",
                link: "회원탈퇴"
            }
        ]

        return(
            <StyledMenuList>
                {
                    navList.map((item, index) => (
                        <StyledMenuListItem activeOpacity={1} key={index} onPress={() => navigation.navigate(item.link)}>
                            <StyledMenuListItemText>{item.title}</StyledMenuListItemText>
                            <StyledMenuListItemIcon name="ios-chevron-forward-outline"/>
                        </StyledMenuListItem>
                    ))
                }
            </StyledMenuList>            
        )
    }, []);

    const logoutAlertGear = useMemo(() => (
        <AwesomeAlert
            {...alertDefaultSetting}
            show={logoutAlert}
            title="로그아웃 하시겠습니까?"
            confirmText="로그아웃"
            onCancelPressed={() => {
                setLogoutAlert(false);
            }}
            onConfirmPressed={() => {
                setLogoutAlert(false);
                logout(() => {
                    navigation.reset({routes: [{name: "Login", params:{expired: '로그아웃 되었습니다'}}]});
                });
            }}
            onDismiss={() => {
                setLogoutAlert(false);
            }}
        />
    ), [logoutAlert]);

    //effect
    useLayoutEffect(() => {
        if(isFocused) userUpdate();
    }, [isFocused]);

    useLayoutEffect(() => {
        if(userData === null) navigation.reset({routes: [{name: "Login", params:{expired: '로그인 정보가 만료되었습니다'}}]});
    }, [userData]);
    
    //render
    return (
        <StyledWindow>
            <StyledConatainer>
                    {profileGear}
                    {menuGear}
                    <StyledFooter>
                        <StyledLogout>
                            <StyledLogoutIcon name="ios-exit-outline"/>
                            <StyledLogoutText onPress={() => {setLogoutAlert(true)}}> 로그아웃</StyledLogoutText>
                        </StyledLogout>
                    </StyledFooter>
            </StyledConatainer>
            {logoutAlertGear}
        </StyledWindow>
    );
}

//------------------------------- STYLE --------------------------------
const StyledWindow = styled.View`
    background-color:#FFF;
    flex:1;
`;
const StyledConatainer = styled.ScrollView`
    flex:1;
`;
const StyledProfile = styled.View`
    background:black;
    flex:0.25;
    padding:${rw*19}px;
    justify-content:space-between;
`;
const StyledProfileInfo = styled.View`
    flex-direction:row;
    justify-content:space-between;
`;
const StyledProfileName = styled.View`
`;
const StyledProfileNameText = styled.Text`
    color:white;
    font-size:${rw*19}px;
    font-weight:600;
`;
const StyledProfileNameEdit = styled.Text`
    color:#747474;
    font-size:${rw*12.5}px;
`;
const StyledProfileImage = styled(FastImage)`
    width:${rw*68}px;
    height:${rw*68}px;
    border-radius:${rw*35}px;
`;
const StyledProfileMenu = styled.View`
    flex-direction:row;  
`;
const StyledProfileMenuItem = styled.TouchableOpacity`
    align-items:center;
    margin-right:${rw*14}px;
    justify-content:space-between;
`;
const StyledProfileMenuItemText = styled.Text`
    color:white;
    font-size:${rw*12}px;
    margin: ${rw*7}px 0;
`;
const StyledMenuList = styled.View`
    flex:0.6;
`;
const StyledMenuListItem = styled.TouchableOpacity`
    flex-direction:row;
    align-items:center;
    height:${rh*48}px;
    justify-content:space-between;
    border-color:#ddd;
    border-bottom-width:0.5px;
`;
const StyledMenuListItemText = styled.Text`
    font-size:${rw*14.5}px;
    left:${rw*28}px;
    color:#222;
`;
const StyledMenuListItemIcon = styled(Icon)`
    font-size:${rw*18}px;
    color:#aaa;
    right:${rw*10}px;
`;
const StyledFooter = styled.View`
    align-items:flex-end;
    justify-content:flex-end;
    flex:0.12;
    margin:${rw*17}px;
    margin-top:${rw*30}px;
`;
const StyledLogout = styled.TouchableOpacity`
    flex-direction:row;
    align-items:center;
`;
const StyledLogoutIcon = styled(Icon)`
    font-size:${rw*19}px;
    color:#aaa;
`;
const StyledLogoutText = styled.Text`
    font-size:${rw*14.5}px;
    color:#aaa;
`;