//------------------------------ MODULE --------------------------------
import { StyleSheet, Text, View } from  'react-native';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

//---------------------------- COMPONENT -------------------------------
export default function Setting(){
    //init
    const isFocused = useIsFocused();

    //effect
    useEffect(()=>{
        if(isFocused) console.log('setting');
    }, [isFocused]);

    //render
    return(
        <View style={styles.container}>
            <Text>Setting</Text>
        </View>
    )
}

//------------------------------- STYLE --------------------------------
const styles = StyleSheet.create({
    container:{
        flex:1,
        background: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});