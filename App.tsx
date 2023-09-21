/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//------------------------------ MODULE --------------------------------
import React from 'react';
import { Navigation, ErrorFallback } from './src/component';
import { RecoilRoot } from 'recoil';
import ErrorBoundary from 'react-native-error-boundary';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import Toast from 'react-native-toast-message';
import toastConfig from './src/data/toastConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
