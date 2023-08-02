//------------------------------ MODULE --------------------------------
import AnimatedLoader from "react-native-animated-loader";
import { useState, useLayoutEffect } from 'react';
import { color_loading } from '@/assets/animation';
import { StyleSheet} from 'react-native';

//---------------------------- COMPONENT -------------------------------
export default function CustomLoading({lottie = null}){
    //state
    const [visible, setVisible] = useState(true);

    //effect
    useLayoutEffect(() => {
        setTimeout(() => {
            setVisible(false);
        }, 2000);
    }, []);

    //render
    return (       
        <AnimatedLoader
            visible={visible}
            overlayColor="rgba(255,255,255,1)"
            source={lottie || color_loading}
            speed={0.5}
            animationStyle={styles.lottie}
            //animationType="fade"
        />
    );
}

//------------------------------- STYLE --------------------------------
const styles = StyleSheet.create({
    lottie: {
        width: 200,
        height: 200
    }
});