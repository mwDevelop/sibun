//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import React, { useLayoutEffect } from 'react';
import { useState } from 'react';
import { apiCall } from '@/lib';
import { useLike, useLikeMutate } from '@/hooks';
import FastImage from 'react-native-fast-image';
import { heart_flat_empty, heart_flat_fill, onerror } from '@/assets/img';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

//---------------------------- COMPONENT -------------------------------
export default React.memo(({list=[]}) => {
    //init
    const navigation = useNavigation();
    const likeMutation = useLikeMutate();

    //state
    const [storeList, setStoreList] = useState(null);
    const [likeList, setLikeList] = useState(null);

    //data
    const [like, likeUpdate] = useLike();

    //function
    const addLike = (storeIdx) => {
        const params = { mb_like_store_idx : storeIdx };
        likeMutation.mutate({type:"add", params:params}, {onSuccess: (res) => {
            if(res.data.result == "000"){
                Toast.show({ type: 'plain', text1: "매장이 찜한 매장에\n등록 되었어요", position: 'bottom', bottomOffset: 120, visibilityTime: 1000});
            }else{
                Toast.show({ type: 'plain', text1: "등록에 실패하였습니다.\n관리자에게 문의 해 주세요.", position: 'bottom', bottomOffset: 120, visibilityTime: 1000});
            }
        }});
    }

    const removeLike = (storeIdx) => {
        if(!(like?.length)) return;
        const isStore = like.filter((d) => d.mb_like_store_idx == storeIdx);
        if(isStore?.length) likeMutation.mutate({type:"remove", id:isStore[0].mb_like_idx});                
    }    

    //effect
    useLayoutEffect(() => {
        if(list && Array.isArray(list)){
            if(list.length){
                const params = { store_idx_in : list.join() };
                apiCall.get('/store', {params}).then((res) => {                
                    if(res.data.result=="000") setStoreList(res.data.list);
                    if(res.data.result=="001") setStoreList([]);
                })
            }else{
                setStoreList([]);
            }
        }
    }, [list]);

    useLayoutEffect(() => {
        likeUpdate();
    }, []);

    useLayoutEffect(() => {
        if(like && Array.isArray(like)) setLikeList(like.map((d) => Number(d.mb_like_store_idx)));
    }, [like]);

    //render
    return (
        <StyledScrollWrap>            
            {
                storeList && likeList ? (
                    storeList.length? (
                        <StyledContainer>
                        {
                            storeList.map((item, index) => {
                                const likeFlag = likeList.includes(item.store_idx);
                                return (
                                    <StyledItem key={index}>
                                        <StyledImage source={item.store_main_simg ? {uri:item.store_main_simg} : onerror} defaultSource={onerror} />
                                        <StyledLikeTouch onPress={() => likeFlag ? removeLike(item.store_idx) : addLike(item.store_idx)}>
                                            <StyledLikeIcon source={ likeFlag ? heart_flat_fill : heart_flat_empty} resizeMode='contain'/>
                                        </StyledLikeTouch>
                                        <StyledItemInfo onPress={() => navigation.navigate('Desc', item)}>
                                            <StyledItemName>{item.store_name}</StyledItemName>
                                            <StyledReviewText>
                                                <StyledReviewStar>★</StyledReviewStar>
                                                {Number(item.store_review_avg).toFixed(1)}({item.store_review_cnt})
                                            </StyledReviewText>
                                        </StyledItemInfo>
                                    </StyledItem>                                        
                                )
                            })
                        }
                        </StyledContainer>
                    ) : <StyledEmptyText>내역이 존재하지 않습니다.</StyledEmptyText>
                ) : null
            }
        </StyledScrollWrap>
    );
});

//------------------------------- STYLE --------------------------------
const StyledScrollWrap = styled.ScrollView`
`;
const StyledContainer = styled.View`
    flex-direction:row;
    flex-wrap:wrap;
    justify-content:space-between;
    margin:20px;
`;
const StyledEmptyText = styled.Text`
    margin-top:50px;
    align-self:center;
    color:#222;
`;
const StyledItem = styled.View`
    width:48%;
    margin-bottom:20px;
    background:#fff;
    border-radius:8px;
    shadow-color: black; 
    shadow-offset: 3px; 
    shadow-opacity: 0.2; 
    shadow-radius:5px;
    elevation:1;
`;
const StyledImage = styled(FastImage)`
    width:100%;
    height:100px;
    border-top-right-radius:8px;
    border-top-left-radius:8px;
`;
const StyledLikeTouch = styled.TouchableOpacity`
    position:absolute;
    right:5px;
    top:5px;
`;
const StyledLikeIcon = styled(FastImage)`
    width:25px;
    height:25px;
`;
const StyledItemInfo = styled.TouchableOpacity`
    height:70px;
    padding:5px 10px;
`;
const StyledItemName = styled.Text`
    color:#222;
    font-size:16px;
    font-weight:500;
    margin-bottom:5px;
`;
const StyledReviewStar = styled.Text`
    color:#F4DF1F;
`;
const StyledReviewText = styled.Text`
    color:#B9B9B9;
    font-size:12px;
`;
