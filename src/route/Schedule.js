//------------------------------ MODULE --------------------------------
import { StyleSheet, Text, View } from 'react-native';
import { CalendarView } from '@/component';

//---------------------------- COMPONENT -------------------------------
export default function Schedule(){
    //render
    return(
        <View style={styles.container}>
            <CalendarView />
        </View>
    )
}

//------------------------------- STYLE --------------------------------
const styles = StyleSheet.create({
    container:{
        flex:1,
        background: '#fff',
        paddingTop:40
    },
});