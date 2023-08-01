//------------------------------ MODULE --------------------------------
import { StyleSheet, Text, View, TouchableOpacity } from  'react-native';
import { useLayoutEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';

//---------------------------- COMPONENT -------------------------------
export default function Setting(){
    //init
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    //effect
    useLayoutEffect(()=>{
        if(isFocused) console.log('setting');
    }, [isFocused]);

    //render
    return(
        <View style={styles.container}>
            <Text>Setting</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Desc")}>
                <Text>
                    desc
                </Text>
            </TouchableOpacity>
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