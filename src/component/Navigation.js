//------------------------------ MODULE --------------------------------
import { useState, useLayoutEffect } from 'react';
import { Text, Image, SafeAreaView } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { 
    Start,
    Intro, 
    Login,
    Join,
    JoinSuccess,
    FindAccount, 
    Home, 
    Mypage, 
    Desc, 
    ReviewList,
    Setting, 
    ProfileEdit,
    Leave,
    Search, 
    PermissionCard, 
    Reservation, 
    Schedule, 
    ReservationDesc,
    ReservationReady,
    ReservationDone,
    ReviewAddible,
    ReviewMyList,
    ReviewAdd,
    ReviewDesc,
    RecentList,
    LikeList,
    NetworkError 
} from '@/route'; //need to consider lazy (ordering tab and stack groups...?)
import { firstLaunch } from '@/lib';
import Icon from 'react-native-vector-icons/Ionicons';
import { ProfileEditSaveAtom } from '@/data/global';
import { useRecoilState } from "recoil";
import { home_gray, home_color, location_gray, location_color, document_gray, document_color, person_gray, person_color } from '@/assets/img';
import { useStorage } from '@/hooks';
import NetInfo from "@react-native-community/netinfo";
import { rw, rh } from '@/data/globalStyle';

//---------------------------- NAVIGATORS -------------------------------
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

//---------------------------- COMPONENT --------------------------------
/* -------------------- ETC ---------------------- */
const ProfileEditSaveButton = () => {
    //atom
    const [saveFlag, setSaveFlag] = useRecoilState(ProfileEditSaveAtom);

    //render
    return(
        <Text 
            onPress={() => saveFlag == 'active' ? setSaveFlag('execute') : null}
            style={{
                right:10,
                fontSize:15,
                color:saveFlag == 'active' ? '#F33562' : '#BABABA'
            }}
        >
            저장
        </Text>
    )
};

/* ------------------- BOTTOM TAB ---------------------- */
const ContentTab = () => {
    //state
    const access = useStorage('access');

    //render
    return (
        <Tab.Navigator 
            screenOptions={(r)=>({
                tabBarIcon: ({focused}) => <Image source={r.route.params.icon[focused ? 1 : 0]} style={r.route.params.style || {height:rh*28, width:rw*24}} resizeMode='contain'/>,
                headerShown: false, 
                headerTitleAlign: 'center',
                tabBarStyle: { height: 70, paddingBottom: rh*10 },
                headerTitleStyle: {
                    fontSize:18,
                    fontWeight:600
                },
                tabBarShowLabel: false
            })}
        >
            <Tab.Screen name="홈" component={Home} initialParams={{ icon: [home_gray, home_color], style: {height:rh*30, width:rw*30}}}/>
            <Tab.Screen name="내주변" component={Search} initialParams={{ icon: [location_gray, location_color] }}/>
            <Tab.Screen name="스케줄" component={Schedule} initialParams={{ icon: [document_gray, document_color] }}/>
            {access == 'init' ? null : <Tab.Screen name="마이페이지" component={access ? Mypage : Login} initialParams={{ icon: [person_gray, person_color] }} options={{headerShown: access ? true  : false}}/>}
        </Tab.Navigator>
    )
};

/* ------------------- TOP TAB ---------------------- */
const ReservationTab = () => {
    return (
        <TopTab.Navigator
            initialRouteName='예약중'
            style={{
                backgroundColor:'#fff',
            }}
            screenOptions={{   
                tabBarStyle:{paddingTop:15},
                tabBarItemStyle: { width: 100 },
                tabBarPressColor: 'transparent',
                tabBarActiveTintColor: '#222',
                tabBarInactiveTintColor: '#7D7D7D',
                tabBarLabelStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                },    
                tabBarIndicatorStyle: { backgroundColor: '#222' },                  
            }}>
            <TopTab.Screen name="예약중" component={ReservationReady} />
            <TopTab.Screen name="이용완료" component={ReservationDone} />
        </TopTab.Navigator>        
    )
}

const ReviewTab = () => {
    return (
        <TopTab.Navigator
            initialRouteName='리뷰 작성'
            style={{
                backgroundColor:'#fff',
            }}
            screenOptions={{   
                tabBarStyle:{paddingTop:15, marginRight:20, marginLeft:20, elevation:0},
                tabBarPressColor: 'transparent',
                tabBarActiveTintColor: '#222',
                tabBarInactiveTintColor: '#7D7D7D',
                tabBarLabelStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                },    
                tabBarIndicatorStyle: { backgroundColor: '#222' },
            }}>
            <TopTab.Screen name="리뷰 작성" component={ReviewAddible} />
            <TopTab.Screen name="나의 리뷰" component={ReviewMyList} />
        </TopTab.Navigator>        
    )
}

/* ---------------- ROOT STACK -------------------- */
const RootStack = () => {
    //init
    const navigation = useNavigation();

    //state
    const access = useStorage('access');
    const [ firstLaunchChk, setFirstLaunchChk ] = useState('init');

    //function
    const launchChk = async() => {
        //fisrt launch check..
        const checkResult = await firstLaunch();
        setFirstLaunchChk(checkResult ? 'true' : 'false');

        //network cheeck event setting
        setTimeout(() => { //after setting navigation tree 
            try{
                console.log("network callback registered.");
                NetInfo.addEventListener((state) => {
                    if(!state.isConnected) navigation.navigate('NetworkError');                 
                });
            }catch(e){
                console.log(e);
            }
        });
    }

    const backButton = () => <Icon name="chevron-back-outline" size={35} style={{left:10}} />;

    //effect
    useLayoutEffect(() => {
        launchChk();
    }, []);

    //rendering Count......
    if(!(firstLaunchChk == 'init' || access == 'init')) console.log('root rendered');

    //render
    return firstLaunchChk == 'init' || access == 'init' ? null : (
        <Stack.Navigator
            initialRouteName ={firstLaunchChk == 'true' ? 'Start' : (access ? 'Content' : 'Login') } 
            //initialRouteName ='Start' 
            screenOptions={(r)=>({
                headerShown: false,
                headerTitleAlign: 'center', 
                headerTitleStyle: {
                    fontSize:18,
                    fontWeight:600,
                },
                headerBackTitleVisible: false,
                headerBackImage: backButton,
            })}        
        >
            {/********************* INTRO & PERMISSION **********************/}                
            <Stack.Screen name="Start" component={Start} />
            <Stack.Screen name="Intro" component={Intro} />
            <Stack.Screen name="PermissionCard" component={PermissionCard} />
            {/*************************** LOGIN ******************************/}
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="로그인 / 회원가입" component={Join} options={{headerShown:true}}/>
            <Stack.Screen name="JoinSuccess" component={JoinSuccess}/>
            <Stack.Screen name="계정찾기" component={FindAccount} options={{headerShown:true}}/>
            {/**************************** TABS ******************************/}
            <Stack.Screen name="Content" component={ContentTab}/>
            {/**************************** HOME ******************************/}
            <Stack.Screen name="Desc" component={Desc}/>
            <Stack.Screen name="리뷰" component={ReviewList} options={{headerShown:true}}/>
            {/**************************** SEARCH ****************************/}
            <Stack.Screen name="예약" component={Reservation} options={{headerShown:true}}/>
            {/*************************** SCHEDULE ***************************/}
            <Stack.Screen name="예약상세" component={ReservationDesc} options={{headerShown:true}}/>
            {/*************************** MYPAGE *****************************/}
            <Stack.Screen name="Setting" component={Setting}/>
            <Stack.Screen name="프로필 수정" component={ProfileEdit} options={{headerShown:true, headerRight:() => (<ProfileEditSaveButton/>)}}/>
            <Stack.Screen name="회원탈퇴" component={Leave} options={{headerShown:true}}/>
            <Stack.Screen name="예약내역" component={ReservationTab} options={{headerShown:true, headerShadowVisible: false}}/>
            <Stack.Screen name="리뷰관리" component={ReviewTab} options={{headerShown:true, headerShadowVisible: false}}/>
            <Stack.Screen name="리뷰작성" component={ReviewAdd} options={{headerShown:true}}/>
            <Stack.Screen name="내 리뷰 상세보기" component={ReviewDesc} options={{headerShown:true}}/>
            <Stack.Screen name="최근 본 매장" component={RecentList} options={{headerShown:true}}/>
            <Stack.Screen name="찜한 매장" component={LikeList} options={{headerShown:true}}/>
            {/***************************** ETC ******************************/}
            <Stack.Screen name="NetworkError" component={NetworkError}/>
        </Stack.Navigator>
    );    
}

/* drawer reference
const DrawerNavigation = () => (
    <Drawer.Navigator>
        <Drawer.Screen name="Main" component={TabStack} option={{headerShown: false}} />  
        <Drawer.Screen name="Setting" component={Setting} option={{headerShown: false}} />
    </Drawer.Navigator>
);
*/

/* ----------------- EXPORT MAIN -------------------- */
export default function Navigation(){
    //rendering Count......
    console.log('navigation rendered');

    //render
    return(
        <NavigationContainer>
            <SafeAreaView/>
            <PaperProvider>
                <RootStack/>
            </PaperProvider>
        </NavigationContainer>
    )
}