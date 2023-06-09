//------------------------------ MODULE --------------------------------
import { StyleSheet, Text, View } from  'react-native';

//---------------------------- COMPONENT -------------------------------
export default function Desc(){
    //render
    return(
        <View style={styles.container}>
            <Text>Desc</Text>
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