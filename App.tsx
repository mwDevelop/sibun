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

//---------------------------- COMPONENT -------------------------------
function App(): JSX.Element {
    //render
    return (
        <AutocompleteDropdownContextProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <RecoilRoot>
                <Navigation/>
            </RecoilRoot>
        </ErrorBoundary>
        </AutocompleteDropdownContextProvider>
    );
}

export default App;
