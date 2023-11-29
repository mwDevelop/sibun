/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//------------------------------ MODULE --------------------------------
import React, { useEffect } from 'react';
import { Navigation, ErrorFallback } from './src/component';
import { RecoilRoot } from 'recoil';
import ErrorBoundary from 'react-native-error-boundary';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import Toast from 'react-native-toast-message';
import toastConfig from './src/data/toastConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import messaging from '@react-native-firebase/messaging';
import { pushNoti } from './src/lib';
import SplashScreen from "react-native-splash-screen";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime : 1000 * 60,
            cacheTime : 1000 * 60 * 5
        }
    }
});

//---------------------------- COMPONENT -------------------------------
function App(): JSX.Element {
    // Register foreground handler
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hide();
        }, 500);

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
            console.log(remoteMessage);
            pushNoti(remoteMessage);  // 위에서 작성한 함수로 넘겨준다
        });

        return unsubscribe;
    }, []);

    //render
    return (
        <QueryClientProvider client={queryClient}>
        <AutocompleteDropdownContextProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <RecoilRoot>
                <Navigation/>
            </RecoilRoot>
        </ErrorBoundary>
        <Toast config={toastConfig}/>
        </AutocompleteDropdownContextProvider>
        </QueryClientProvider>
    );
}

export default App;
