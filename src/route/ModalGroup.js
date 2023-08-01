//------------------------------ MODULE --------------------------------

import { useLayoutEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import styled from 'styled-components/native';

//---------------------------- COMPONENT -------------------------------
export default function ModalGroup({route}){
    //init
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    //effect
    useLayoutEffect(()=>{
        if(isFocused) {
            console.log('modal');
        }
    }, [isFocused]);

    //render
    return(
        <StyledWindow activeOpacity={1}>
            <StyledWindowCloser/>
            <StyledConatainer activeOpacity={1}>
                {route.params.component}
            </StyledConatainer>
        </StyledWindow>
    )
}

//------------------------------- STYLE --------------------------------
const StyledWindow = styled.TouchableOpacity`
    background-color:rgba(0, 0, 0, 0);
    flex:1;
    justify-content:flex-end;
`;
const StyledWindowCloser = styled.View`
    flex:0.008;
    width:50px;
    background:#fff;
    align-self:center;
    bottom:10px;
    border-radius:50px;
`;
const StyledConatainer = styled.TouchableOpacity`
    flex:0.85;
    background:#fff;
    border-top-right-radius:40px;
    border-top-left-radius:40px;
    overflow:hidden;
`;