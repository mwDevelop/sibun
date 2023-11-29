//------------------------------ MODULE --------------------------------
import { useLayoutEffect, useState } from 'react';
import styled from 'styled-components/native';
import React from 'react';
import { apiCall } from '@/lib';
import { StoreListView } from '@/component';

//---------------------------- COMPONENT -------------------------------
export default React.memo(({keyword = null}) => {
    //state
    const [list, setList] = useState(null);

    //effect
    useLayoutEffect(() => {
        if(keyword){
            const params = {store_keyword:String(keyword)}
            apiCall.get('/store', {params})
                .then((res) => {
                    if(res.data.result == "000") setList(res.data.list);
                    if(res.data.result == "001") setList([]);
                }).catch((e) => {
                    console.log(e);
                })
        }
    }, [keyword]);

    //render
    return (
        <StyledConatainer>
            {
                list ? (
                    list.length? (
                        <StoreListView title={`검색결과 ${list.length.toLocaleString()}개`} list={list}/>
                    ) : <StyledEmpty>검색 결과가 없습니다.</StyledEmpty>
                ) : <StyledEmpty>원하는 매장을 검색 해 보세요</StyledEmpty>
            }
        </StyledConatainer>
    )
});

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    height:100%;
    width:100%;
    top:-55px;
    background:white;
    position:absolute;
    z-index:101;
    elevation:1;
`;
const StyledEmpty = styled.Text`
    align-self:center;
    top:50px;
    color:#555;
    font-weight:500;
`;