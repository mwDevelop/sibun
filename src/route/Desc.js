//------------------------------ MODULE --------------------------------
import { StyleSheet, Text, View } from  'react-native';
import Config from 'react-native-config';

//---------------------------- COMPONENT -------------------------------
export default function Desc(){
    //render
    return(
        <View style={styles.container}>
            <Text>{Config.APP_API_URL}</Text>
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