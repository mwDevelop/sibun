//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import { useState, useLayoutEffect } from 'react';
import { StoreBlockList } from '@/component';
import { apiCall } from '@/lib';

//---------------------------- COMPONENT -------------------------------
export default function LikeList(){
    //data
    const [list, setList] = useState(null);

    //effect
    useLayoutEffect(() => {
        const headers = {"Authorization" : "access"};
        apiCall.get('/like', {headers}).then((res) => {
            if(res.data.result == '000') setList(res.data.list);
            if(res.data.result == '001') setList([]);
        });
    }, []);

    //render
    return (
        <StyledConatainer>
            <StoreBlockList list={list ? list.map((d) => d.mb_like_store_idx) : []} />
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
`;