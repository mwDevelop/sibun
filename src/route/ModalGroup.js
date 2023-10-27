//------------------------------ MODULE --------------------------------

import { useLayoutEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import styled from 'styled-components/native';
import { AddressView } from '@/component';
import { rw, rh } from '@/data/globalStyle';

//---------------------------- COMPONENT -------------------------------
export default function ModalGroup(){
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
                <AddressView/>
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
    width:${rw*50}px;
    background:#fff;
    align-self:center;
    bottom:${rh*10}px;
    border-radius:${rw*50}px;
`;
const StyledConatainer = styled.TouchableOpacity`
    flex:0.85;
    background:#fff;
    border-top-right-radius:${rw*40}px;
    border-top-left-radius:${rw*40}px;
    overflow:hidden;
`;