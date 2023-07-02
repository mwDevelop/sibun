//------------------------------ MODULE --------------------------------
import { StyleSheet, Text, View, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { permissionCheck } from '@/lib';
import { useNavigation } from '@react-navigation/native';

//---------------------------- COMPONENT -------------------------------
export default function PermissionCard(){
    //init
    const navigation = useNavigation();
    const permissions = [
        ['location', '내 주변 즉시방문 가능한 매장을 알려드려요!'],
        ['camera', '매장 리뷰를 위한 카메라 사용이 필요해요!']
    ]

    //state
    const [cardTitle, setCardTitle] = useState(permissions[0][1]);

    //function
    const recursiveReq = (cnt) => {
        try{
            permissionCheck(Platform.OS, permissions[cnt][0]).then((data) => {
                try{
                    cnt++; 
                    if(cnt >= permissions.length) return navigation.replace("Login");
                    setCardTitle(permissions[cnt][1]);
                    recursiveReq(cnt);
                }catch(e){
                    return;
                }
                return;
            });
        }catch(e){
            console.log(e);
        }
    }

    //effect
    useEffect(() => {
        setTimeout(() => {
            recursiveReq(0);
        }, 300);
    }, []);

    //render
    return(
        <View style={styles.container}>
            <Text style={styles.text}>{cardTitle}</Text>
        </View>
    )
}

//------------------------------- STYLE --------------------------------
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#111',
        padding: '10%'
    },

    text: {
        fontWeight: "bold",
        color: "white",
        fontSize: 25
    },
});