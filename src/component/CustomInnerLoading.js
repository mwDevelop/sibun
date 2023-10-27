//------------------------------ MODULE --------------------------------
import { useState, useLayoutEffect } from 'react';
import { color_loading, hamster_loading } from '@/assets/animation';
import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';

//---------------------------- COMPONENT -------------------------------
export default function CustomInnerLoading({
        lottie = null, 
        paddingTop="50%", 
        height="200px", 
        width="200px", 
        transparent="1",
        delay=2000
    }){
    //state
    const [visible, setVisible] = useState(true);

    //effect
    useLayoutEffect(() => {
        setTimeout(() => {
            setVisible(false);
        }, delay);
    }, []);

    //render
    return (       
        <StyledConatainer v={visible} p={paddingTop} t={transparent}>
            <StyledLottie 
                source={lottie || hamster_loading}
                autoPlay
                loop            
                h={height}
                w={width}
            />
        </StyledConatainer>
    );
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    height:100%;
    width:100%;
    z-index:100;
    position:absolute;
    background:#fff;
    display:${(props) => props.v ? "flex" : "none"}
    align-items:center;
    padding-top:${(props) => props.p};
    background:rgba(255,255,255,${(props) => props.t});
`;
const StyledLottie = styled(LottieView)`
    height:${(props) => props.h};
    width:${(props) => props.w};
`;