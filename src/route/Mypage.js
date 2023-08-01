//------------------------------ MODULE --------------------------------
import { useLayoutEffect, useState, useMemo } from 'react';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { review_chat, book_list, star_pick } from '@/assets';

//---------------------------- COMPONENT -------------------------------
export default function Mypage(){
    //init
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    //state
    const [userData, setUserData] = useState([]);

    //function
    const initData = async() => {
        const testData = {
            mb_nickname : "스티치",
            mb_profile_img: "data:image/jpeg;base64,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"
        };

        setUserData(testData);
    }

    //memo
    const profileGear = useMemo(() => {
        const profileMenuList = [
            {
                icon: review_chat,
                text: "내후기"
            },
            {
                icon: book_list,
                text: "예약내역"
            },
            {
                icon: star_pick,
                text: "찜한매장"
            }
        ]

        return(
            <StyledProfile>
                <StyledProfileInfo>
                    <StyledProfileName>
                        <StyledProfileNameText>
                            {userData.mb_nickname} 님
                        </StyledProfileNameText>
                        <StyledProfileNameEdit onPress = {() => navigation.navigate("프로필 수정")} >
                            프로필 수정하기
                        </StyledProfileNameEdit>
                    </StyledProfileName>
                    <StyledProfileImage source={{uri:userData.mb_profile_img, priority: FastImage.priority.normal}}/>
                </StyledProfileInfo>
                <StyledProfileMenu>
                    {
                        profileMenuList.map((item, index) => (
                            <StyledProfileMenuItem key={index}>
                                <Image source={item.icon}/>
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
                link: "home"
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
                link: "home"
            }
        ]

        return(
            <StyledMenuList>
                {
                    navList.map((item, index) => (
                        <StyledMenuListItem activeOpacity={1} key={index}>
                            <StyledMenuListItemText>{item.title}</StyledMenuListItemText>
                            <StyledMenuListItemIcon name="ios-chevron-forward-outline"/>
                        </StyledMenuListItem>
                    ))
                }
            </StyledMenuList>            
        )
    }, []);

    //effect
    useLayoutEffect(() => {
        if(isFocused) initData();
    }, [isFocused]);

    //render
    return(
        <StyledWindow>
            <StyledConatainer>
                    {profileGear}
                    {menuGear}
                    <StyledFooter>
                        <StyledLogout>
                            <StyledLogoutIcon name="ios-exit-outline"/>
                            <StyledLogoutText onPress={() => navigation.replace('Login')}> 로그아웃</StyledLogoutText>
                        </StyledLogout>
                    </StyledFooter>
            </StyledConatainer>
        </StyledWindow>
    );
}

//------------------------------- STYLE --------------------------------
const StyledWindow = styled.View`
    background-color:#FFF;
    flex:1;
`;
const StyledConatainer = styled.View`
    flex:1;
`;
const StyledProfile = styled.View`
    background:black;
    flex:0.25;
    padding:20px;
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
    font-size:20px;
    font-weight:600;
`;
const StyledProfileNameEdit = styled.Text`
    color:#747474;
    font-size:13px;
`;
const StyledProfileImage = styled(FastImage)`
    width:70px;
    height:70px;
    border-radius:35px;
`;
const StyledProfileMenu = styled.View`
    flex-direction:row;  
`;
const StyledProfileMenuItem = styled.TouchableOpacity`
    align-items:center;
    margin-right:15px;
    justify-content:space-between;
`;
const StyledProfileMenuItemText = styled.Text`
    color:white;
    font-size:13px;
    margin: 7px 0;
`;
const StyledMenuList = styled.View`
    flex:0.6;
`;
const StyledMenuListItem = styled.TouchableOpacity`
    flex-direction:row;
    align-items:center;
    height:50px;
    justify-content:space-between;
    border-color:#ddd;
    border-bottom-width:0.5px;
`;
const StyledMenuListItemText = styled.Text`
    font-size:15px;
    left:30px;
    color:#222;
`;
const StyledMenuListItemIcon = styled(Icon)`
    font-size:18px;
    color:#aaa;
    right:10px;
`;
const StyledFooter = styled.View`
    align-items:flex-end;
    justify-content:flex-end;
    flex:0.12;
    margin:0 15px;
`;
const StyledLogout = styled.TouchableOpacity`
    flex-direction:row;
    align-items:center;
`;
const StyledLogoutIcon = styled(Icon)`
    font-size:20px;
    color:#aaa;
`;
const StyledLogoutText = styled.Text`
    font-size:15px;
    color:#aaa;
`;