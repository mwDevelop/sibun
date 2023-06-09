//------------------------------ MODULE --------------------------------
import { StyleSheet, Text, View, TouchableOpacity } from  'react-native';
import { useNavigation } from '@react-navigation/native';

//---------------------------- COMPONENT -------------------------------
export default function Mypage(){
    //init
    const navigation = useNavigation();

    //render
    return(
        <View style={styles.container}>
            <Text>Mypage</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Setting")}>
                <Text style={styles.buttonText}>Go to Setting</Text>
            </TouchableOpacity>
        </View>
    );
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
        backgroundColor: "#fe5746",
        justifyContent: "center",
        alignItems: "center",
        margin:20
    },
    buttonText: {
        fontWeight: "bold",
        color: "white"
    },
});