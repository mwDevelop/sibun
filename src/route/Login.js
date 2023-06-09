//------------------------------ MODULE --------------------------------
import { StyleSheet, Text, View, TouchableOpacity } from  'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//---------------------------- COMPONENT -------------------------------
export default function Login(){
    //init
    const navigation = useNavigation();

    //render
    return(
        <View style={styles.container}>
            <Text>Login</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.replace("Content")}>
                <Text style={styles.buttonText}>다음에 할게요</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => AsyncStorage.clear()}>
                <Text style={{'fontWeight':'bold'}}>reset asyncStorage</Text>
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
    },
    button: {
        width: '70%',
        height: 40,
        backgroundColor: "skyblue",
        justifyContent: "center",
        alignItems: "center",
        margin:20
    },
    buttonText: {
        fontWeight: "bold",
        color: "white"
    },
});