//------------------------------ MODULE --------------------------------
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Intro, Login, Home, Mypage, Desc, Setting, Search, PermissionCard, Schedule } from '@/route';
import { firstLaunch } from '@/lib';
import Icon from 'react-native-vector-icons/Ionicons';

//---------------------------- NAVIGATORS -------------------------------
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//---------------------------- COMPONENT -------------------------------
/* ------------------- TABS ---------------------- */
const ContentTab = () => (
    <Tab.Navigator 
        screenOptions={(r)=>({
            tabBarIcon: ({focused}) => <Icon name={r.route.params.icon+(focused?'':'-outline')} color={focused?'orangered':'gray'} size={25}/>,
            headerShown: false, 
            tabBarStyle: { height: 60, paddingBottom: 10},
            tabBarActiveTintColor: "orangered",
        })}
    >
        <Tab.Screen name="홈" component={Home} initialParams={{ icon: "home" }}/>
        <Tab.Screen name="내주변" component={Search} initialParams={{ icon: "map" }}/>
        <Tab.Screen name="스케줄" component={Schedule} initialParams={{ icon: "checkbox" }}/>
        <Tab.Screen name="마이페이지" component={Mypage} initialParams={{ icon: "happy" }}/>
    </Tab.Navigator>
);

/* ---------------- ROOT STACK -------------------- */
const RootStack = () => {
    //state
    const [ firstLaunchChk, setFirstLaunchChk ] = useState('init');

    //function
    const launchChk = async() => {
        const checkResult = await firstLaunch();
        setFirstLaunchChk(checkResult ? 'true' : 'false');
    }

    //effect
    useEffect(() => {
        launchChk();
    }, []);

    //render
    return firstLaunchChk == 'init' ? null : (
        <Stack.Navigator>
            {/********************* INTRO & PERMISSION **********************/}
            {
                firstLaunchChk == 'true' ? (
                    <>
                        <Stack.Screen name="Intro" component={Intro} options={{headerShown:false}}/>
                        <Stack.Screen name="PermissionCard" component={PermissionCard} options={{headerShown:false}}/>
                    </>
                ) : null
            }
            {/*************************** LOGIN ******************************/}
            <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
            {/**************************** TABS ******************************/}
            <Stack.Screen name="Content" component={ContentTab} options={{headerShown:false}}/>

            {/**************************** HOME ******************************/}
            <Stack.Screen name="Desc" component={Desc} />
            {/**************************** SEARCH ****************************/}

            {/*************************** SCHEDULE ***************************/}

            {/*************************** MYPAGE *****************************/}
            <Stack.Screen name="Setting" component={Setting} />
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