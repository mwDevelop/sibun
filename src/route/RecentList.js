//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import { useStorage } from '@/hooks';
import { useLayoutEffect } from 'react';
import { StoreBlock } from '@/component';

//---------------------------- COMPONENT -------------------------------
export default function RecentList(){
    //data
    const list = useStorage('viewedStore', true/*parse option*/);
    console.log(list);

    //render
    return (
        <StyledConatainer>
            <StoreBlock list={list || []}/>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
`;