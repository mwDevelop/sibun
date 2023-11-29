//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import { useStorage } from '@/hooks';
import { useLayoutEffect } from 'react';
import { StoreBlockList } from '@/component';

//---------------------------- COMPONENT -------------------------------
export default function RecentList(){
    //data
    const list = useStorage('viewedStore', true/*parse option*/);

    //render
    return (
        <StyledConatainer>
            <StoreBlockList list={list || []}/>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
`;