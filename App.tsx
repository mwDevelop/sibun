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

//---------------------------- COMPONENT -------------------------------
function App(): JSX.Element {
    //render
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <RecoilRoot>
                <Navigation/>
            </RecoilRoot>
        </ErrorBoundary>
    );
}

export default App;
