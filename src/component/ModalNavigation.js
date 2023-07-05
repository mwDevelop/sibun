//------------------------------ MODULE --------------------------------
import { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';

//---------------------------- NAVIGATORS -------------------------------
const Stack = createStackNavigator();

//---------------------------- COMPONENT -------------------------------
export default function ModalNavigation({pages}){
    //memo
    const stackGroup = useMemo(() => {
        return pages ? (
            <Stack.Navigator>
                {Object.entries(pages).map(([k, v], i) => (
                    <Stack.Screen key={i} name={k} component={v} />
                ))}
            </Stack.Navigator>
        ) : null;
    }, []);

    //render
    return(
        <NavigationContainer independent={true}>
            <PaperProvider>
                {stackGroup}
            </PaperProvider>
        </NavigationContainer>
    );
}
