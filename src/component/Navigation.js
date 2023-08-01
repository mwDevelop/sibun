//------------------------------ MODULE --------------------------------
import { useState, useLayoutEffect } from 'react';
import { Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { 
    Intro, 
    Login,
    Join,
    JoinSuccess,
    Welcome,
    FindAccount, 
    Home, 
    Mypage, 
    Desc, 
    Setting, 
    ProfileEdit,
    Search, 
    PermissionCard, 
    Schedule, 
    ModalGroup 
} from '@/route';
import { firstLaunch } from '@/lib';
import Icon from 'react-native-vector-icons/Ionicons';
import { TransitionPresets } from '@react-navigation/stack';
import { ProfileEditSaveAtom } from '@/data/global';
import { useRecoilState } from "recoil";
import { home, home_color, search, search_color, schedule, schedule_color, mypage, mypage_color } from '@/assets';

//---------------------------- NAVIGATORS -------------------------------
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

/* ------------------- TABS ---------------------- */
const ContentTab = () => (
    <Tab.Navigator 
        screenOptions={(r)=>({
            tabBarIcon: ({focused}) => <Image source={r.route.params.icon[focused ? 1 : 0]} />,
            headerShown: false, 
            tabBarStyle: { height: 70, paddingBottom: 20},
            tabBarActiveTintColor: "orangered",
            headerTitleStyle: {
                fontSize:18,
                fontWeight:600
            },
            tabBarShowLabel: false
        })}
    >
        <Tab.Screen name="홈" component={Home} initialParams={{ icon: [home, home_color] }}/>
        <Tab.Screen name="내주변" component={Search} initialParams={{ icon: [search, search_color] }}/>
        <Tab.Screen name="스케줄" component={Schedule} initialParams={{ icon: [schedule, schedule_color] }}/>
        <Tab.Screen name="마이페이지" component={Mypage} initialParams={{ icon: [mypage, mypage_color] }} options={{headerShown: true }}/>
    </Tab.Navigator>
);

/* ---------------- ROOT STACK -------------------- */
const RootStack = () => {
    console.log("rootNav");

    //state
    const [ firstLaunchChk, setFirstLaunchChk ] = useState('init');

    //function
    const launchChk = async() => {
        const checkResult = await firstLaunch();
        setFirstLaunchChk(checkResult ? 'true' : 'false');
    }
    const backButton = () => <Icon name="md-arrow-back-outline" size={28} style={{left:10}}/>;

    const profileEditSaveButton = () => (
        <Text>저장</Text>
    );

    //effect
    useLayoutEffect(() => {
        launchChk();
    }, []);

    //render
    return firstLaunchChk == 'init' ? null : (
        <Stack.Navigator
            screenOptions={(r)=>({
                headerShown: false, 
                headerTitleStyle: {
                    fontSize:18,
                    fontWeight:600
                },
                headerBackTitleVisible: false,
                headerBackImage: backButton
            })}        
        >
            {/********************* INTRO & PERMISSION **********************/}
            {
                firstLaunchChk == 'true' ? (
                    <>
                        <Stack.Screen name="Intro" component={Intro} />
                        <Stack.Screen name="PermissionCard" component={PermissionCard} />
                    </>
                ) : null
            }
            {/*************************** LOGIN ******************************/}
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="로그인 / 회원가입" component={Join} options={{headerShown:true}}/>
            <Stack.Screen name="JoinSuccess" component={JoinSuccess}/>
            <Stack.Screen name="Welcome" component={Welcome}/>
            <Stack.Screen name="계정찾기" component={FindAccount} options={{headerShown:true}}/>
            {/**************************** TABS ******************************/}
            <Stack.Screen name="Content" component={ContentTab} />

            {/**************************** HOME ******************************/}
            <Stack.Screen name="Desc" component={Desc} />
            {/**************************** SEARCH ****************************/}

            {/*************************** SCHEDULE ***************************/}

            {/*************************** MYPAGE *****************************/}
            <Stack.Screen name="Setting" component={Setting} />
            <Stack.Screen name="프로필 수정" component={ProfileEdit} options={{headerShown:true, headerRight:() => (<ProfileEditSaveButton/>)}}/>
            {/**************************** MODAL *****************************/}
            <Stack.Screen 
                name="ModalGroup" 
                component={ModalGroup} 
                
                options={{        
                    gestureEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,                    
                    presentation:'transparentModal',
                }}
                />
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
export default function Navatation(){
    //render
    return(
        <NavigationContainer>
            <PaperProvider>
                <RootStack/>
            </PaperProvider>
        </NavigationContainer>
    )
}