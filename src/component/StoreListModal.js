//------------------------------ MODULE --------------------------------
import React, { useLayoutEffect, useMemo, useState } from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modalbox';
import FastImage from 'react-native-fast-image';
import { star_filled } from '@/assets/img';
import Geolocation from "react-native-geolocation-service";
import { Platform } from 'react-native';
import { permissionCheck, getDistance } from '@/lib';

//---------------------------- COMPONENT -------------------------------
export default React.memo(({
    title = "매장 목록 보기", 
    list = [], 
    modalOpen,
    modalCloseEvent = () => {},
}) => {
    if(!list) return null;

    //state
    const [orderedList, setOrderedList] = useState(null);
    const [order, setOrder] = useState(null);

    //function
    const distanceFilter = async(li) => {
        const chkResult = await permissionCheck(Platform.OS, 'location');//chk

        if(chkResult == "granted"){
            Geolocation.getCurrentPosition(
                pos => {
                    const {longitude, latitude} = pos.coords;                    
                    const filteredList = list.sort((a,b) => (getDistance(longitude, latitude, a.longitude, a.latitude) - getDistance(longitude, latitude, b.longitude, b.latitude)));
                    setOrderedList(filteredList);
                    setOrder('asc');
                },
                error => {
                    console.log(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 3600,
                    maximumAge: 3600,
                },
            );
        }else{
            setOrderedList(li);
            setOrder(null); //hide filter UI
        }
    }     

    const reverseList = (arr) => {
        setOrderedList([...arr].reverse());
        if(order == "desc") setOrder("asc");
        if(order == "asc") setOrder("desc");
    }

    //memo
    const listMemo = useMemo(() => {
        if(!(orderedList?.length)) return null;

        return (
            <StyledContainer>
                <StyledHeader>
                    <StyledTitle>{title}</StyledTitle>
                    {
                        order ? (
                            <StyledFilter onPress={() => reverseList(orderedList)}>
                                <StyledFilterText>거리순</StyledFilterText>
                                <Icon name={`chevron-${order == "asc" ? "down" : "up"}`} size={16} style={{top:-1, width:14}}/>
                            </StyledFilter>
                        ) : null
                    }
                </StyledHeader>
                <StyledContent>
                    {
                        orderedList.map((d, i) => (
                            <StyledItem key={i}>
                                <StyledItemImageArea>
                                    <StyledItemImage source={{uri:d.img}} resizeMode="contain"/>
                                </StyledItemImageArea>
                                <StyledItemInfo>
                                    {
                                        d.tag.length?(
                                            <StyledInfoRow>
                                                {d.tag.map((text, index) => (
                                                    text && index < 3 ? 
                                                    (<StyledInfoTag key={index} highligth={text=="할인중" || text=="즉시가능"}>{text}</StyledInfoTag>) : 
                                                    (index==3 ? <StyledInfoTagCount key={index}>+{d.tag.length - 3}</StyledInfoTagCount> : null)
                                                ))}
                                            </StyledInfoRow>
                                        ): null
                                    }
                                    <StyledInfoRow>
                                        <StyledInfoTitle>{d.name}</StyledInfoTitle>
                                    </StyledInfoRow>
                                    <StyledInfoRow>
                                        <StyledInfoReviewStarArea>
                                            <StyledInfoReviewStar source={star_filled}/>
                                            <StyledInfoReviewScore>
                                                {d.reviewAvg.toFixed(1)}
                                            </StyledInfoReviewScore>
                                        </StyledInfoReviewStarArea>
                                        <StlyedInfoReviewTextArea>
                                            <StyledInfoReviewCount>리뷰 {d.reviewCnt}개</StyledInfoReviewCount>
                                            <Icon name="chevron-forward" size={15}/>
                                        </StlyedInfoReviewTextArea>
                                    </StyledInfoRow>
                                    <StyledInfoRow>
                                        <StyledInfoAddr>{d.addr}</StyledInfoAddr>
                                    </StyledInfoRow>
                                </StyledItemInfo>
                            </StyledItem>       
                        ))
                    }
                </StyledContent>
            </StyledContainer>
        );
    }, [orderedList, title, order]);

    //effect
    useLayoutEffect(() => {
        if(modalOpen)distanceFilter(list);
    }, [list, modalOpen]);
    
    //render
    return (
        <StyledListModal
            isOpen={modalOpen}
            onClosed={() => {modalCloseEvent()}} //reset if not changed
            backdropOpacity={0.4}
            position="bottom"
            swipeToClose={false}
        >
            {listMemo}
        </StyledListModal>
    )
});

//------------------------------- STYLE --------------------------------
const StyledListModal = styled(Modal)`
    border-top-right-radius:25px;
    border-top-left-radius:25px;
    height:600px;
    margin-top:20px;
    overflow:hidden;
`;
const StyledContainer = styled.View`
    padding:20px;
`;
const StyledHeader = styled.View`
    justify-content:space-between;
    flex-direction:row;
    align-items:center;
`;
const StyledTitle = styled.Text`
    font-size:16px;
    color:#222;
    font-weight:500;
`;
const StyledFilter = styled.TouchableOpacity`
    flex-direction:row;
`;
const StyledFilterText = styled.Text`
    color:#444;
    font-size:14px;
    font-weight:400;
`;
const StyledContent = styled.ScrollView`
    margin:10px 0;
`;
const StyledItem = styled.View`
    flex-direction:row;
    margin:10px 0;
    padding:10px;
    border-color:#E9E9E9;
    border-width:1px;
    border-radius:10px;
`;
const StyledItemImageArea = styled.View`
    height:110px;
    width:110px;
    background:blue;
    background:#eee;
    border-radius:5px;
    overflow:hidden;
`;
const StyledItemImage = styled(FastImage)`
    height:100%;
`;
const StyledItemInfo = styled.View`
    margin:0 10px;
`;
const StyledInfoRow = styled.View`
    flex-direction:row;
    margin-bottom:6px;
    width:150px;
`;
const StyledInfoTag = styled.Text`
    background:${(props) => props.highligth ? '#FFA0B1': '#E9E9E9'};
    color:${(props) => props.highligth ? '#fff': '#444'};
    padding:2px 5px;
    border-radius:5px;
    overflow:hidden;
    font-weight:600;
    margin-right:5px;
`;
const StyledInfoTagCount = styled.Text`
    font-size:12px;
    font-weight:700;
    color:#444;
    padding:2px 0;
`;
const StyledInfoTitle = styled.Text`
    color:#222;
    font-size:14px;
    font-weight:700;
`;
const StyledInfoReviewStarArea = styled.View`
    flex-direction:row;
`;
const StyledInfoReviewStar = styled(FastImage)`
    height:15px;
    width:15px;
    margin-right:3px;
`;
const StyledInfoReviewScore = styled.Text`
    color:#F33562;
    font-weight:500;
    margin-right:10px;
`;
const StlyedInfoReviewTextArea = styled.View`
    flex-direction:row;
    align-items:center;
    
`;
const StyledInfoReviewCount = styled.Text`
    font-size:12px;
    color:#444;
    font-weight:500;
`;
const StyledInfoAddr = styled.Text`
    font-size:12px;
    color:#7D7D7D;
`;