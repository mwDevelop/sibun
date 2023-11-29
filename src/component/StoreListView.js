//------------------------------ MODULE --------------------------------
import React, { useLayoutEffect, useMemo, useState } from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { star_filled, onerror } from '@/assets/img';
import Geolocation from "react-native-geolocation-service";
import { permissionCheck, getDistance, timeToNumber } from '@/lib';
import { useNavigation } from '@react-navigation/native';
import { useRecoilValue } from 'recoil';
import { DevicePositionAtom } from '@/data/global';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
import { search_nth } from '@/assets/animation';

//---------------------------- COMPONENT ------------------------------- 
export default React.memo(({ title = "근처 매장 목록 보기", list = [] }) => {
    //init
    const navigation = useNavigation();

    //atom
    const positionCache = useRecoilValue(DevicePositionAtom);

    //state
    const [orderedList, setOrderedList] = useState(null);
    const [order, setOrder] = useState(null);

    //function
    const distanceFilter = async(li) => {
        const chkResult = await permissionCheck('location');//chk

        if(chkResult == "granted"){
            Geolocation.getCurrentPosition( //intermittently can't get position, then execute error block
                pos => {
                    const {longitude, latitude} = pos.coords;                    
                    const filteredList = li.sort((a,b) => (getDistance(longitude, latitude, a.store_addr_x, a.store_addr_y) - getDistance(longitude, latitude, b.store_addr_x, b.store_addr_y)));
                    setOrderedList(filteredList);
                    setOrder('asc');
                },
                error => { //case using cached position data
                    Toast.show({
                        type: 'bad',
                        text1: error.message,
                        topOffset: 120,
                        visibilityTime: 1000
                    });                         
                    if(positionCache){
                        const {longitude, latitude} = positionCache;
                        const filteredList = li.sort((a,b) => (getDistance(longitude, latitude, a.store_addr_x, a.store_addr_y) - getDistance(longitude, latitude, b.store_addr_x, b.store_addr_y)));
                        setOrderedList(filteredList);
                        setOrder('asc');                                            
                    }else{ //case no cache
                        setOrder(null); //hide filter UI
                        setOrderedList(li);                    
                    }
                },
                {
                    enableHighAccuracy: false,
                    timeout: 2000,
                    maximumAge: 0,
                },
            );
        }else{
            setOrderedList(li);
            setOrder(null); //hide filter UI
            Toast.show({
                type: 'bad',
                text1: '위치정보 사용을 위해 권한을 허용해 주세요.',
                topOffset: 120,
                visibilityTime: 1000
            });            
        }
    }     

    const reverseList = (arr) => {
        setOrderedList([...arr].reverse());
        if(order == "desc") setOrder("asc");
        if(order == "asc") setOrder("desc");
    }

    //memo
    const listGear = useMemo(() => {
        const td = new Date().getDay() || 7;
        const now = Number(timeToNumber(new Date()));

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
                {
                    !orderedList ? null : (
                        !orderedList.length ? <StyledEmpty>매장이 검색되지 않았습니다.</StyledEmpty> : (
                            <StyledFlatList 
                                keyExtractor={(item) => item.store_idx}
                                showsVerticalScrollIndicator={false}
                                data={orderedList}
                                renderItem= {({item}) => {
                                    //add extra tags
                                    const tags = item.store_amenities.split(',');
                                    //available tag
                                    if(
                                        Number(item.store_open_time) < now && 
                                        Number(item.store_close_time)-2 > now && //set 60 minutes(minimum usage) before until closed
                                        !(item.store_closed_days.split(',').includes(String(td)))
                                    ) tags.unshift('즉시가능');
                                    //voucher tag
                                    if(item.store_voucher_use_yn == 'y') tags.unshift('할인중');                                    
                                    return (
                                        <StyledItem>
                                            <StyledItemImageArea onPress={() => navigation.navigate('Desc', item)}>
                                                <StyledItemImage source={item.store_main_simg ? {uri:item.store_main_simg} : onerror} resizeMode="cover" defaultSource={onerror}/>
                                            </StyledItemImageArea>
                                            <StyledItemInfo>
                                                {
                                                    tags.length?(
                                                        <StyledInfoRow>
                                                            {tags.map((text, i) => (
                                                                text && i < 3 ? 
                                                                (<StyledInfoTag key={i} highligth={text=="할인중" || text=="즉시가능"}>{text}</StyledInfoTag>) : 
                                                                (i==3 ? <StyledInfoTagCount key={i}>+{tags.length - 3}</StyledInfoTagCount> : null)
                                                            ))}
                                                        </StyledInfoRow>
                                                    ): null
                                                }
                                                <StyledInfoRow>
                                                    <StyledInfoTitle suppressHighlighting={true} onPress={() => navigation.navigate('Desc', item)}>{item.store_name}</StyledInfoTitle>
                                                </StyledInfoRow>
                                                <StyledInfoRow>
                                                    <StyledInfoReviewStarArea>
                                                        <StyledInfoReviewStar source={star_filled}/>
                                                        <StyledInfoReviewScore>
                                                            {Number(item.store_review_avg).toFixed(1)}
                                                        </StyledInfoReviewScore>
                                                    </StyledInfoReviewStarArea>
                                                    <StlyedInfoReviewTextArea>
                                                        <StyledInfoReviewCount>리뷰 {item.store_review_cnt}개</StyledInfoReviewCount>
                                                        <Icon name="chevron-forward" size={15}/>
                                                    </StlyedInfoReviewTextArea>
                                                </StyledInfoRow>
                                                <StyledInfoRow>
                                                    <StyledInfoAddr>{item.store_addr}</StyledInfoAddr>
                                                </StyledInfoRow>
                                            </StyledItemInfo>
                                        </StyledItem>  
                                    );
                                }}
                            />
                        )
                    )
                }
            </StyledContainer>
        );
    }, [orderedList, title, order]);

    const nthGear = useMemo(() => (
        <StyledNthContainer>
            <StyledNthLottie source={search_nth} autoPlay loop />
            <StyledNthText>발견된 매장이 없어요</StyledNthText>
        </StyledNthContainer>
    ), []);

    //effect
    useLayoutEffect(() => {
        if(list){
            if(list.length) distanceFilter(list);
            else setOrderedList([]);
        }
    }, [list]);
    
    //render
    return orderedList ? (
        orderedList.length ? listGear : nthGear
    ) : null
});

//------------------------------- STYLE --------------------------------
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
    margin-top:10px;
    margin-bottom:30px;
`;
const StyledFlatList = styled.FlatList`
    margin-top:10px;
    margin-bottom:30px;
`;
const StyledItem = styled.View`
    flex-direction:row;
    margin:10px 0;
    padding:10px;
    border-color:#E9E9E9;
    border-width:1px;
    border-radius:10px;
`;
const StyledItemImageArea = styled.TouchableOpacity`
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
    width:230px;
    flex-wrap:wrap;
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
const StyledEmpty = styled.Text`
    align-self:center;
    top:50px;
    color:#555;
    font-weight:500;
`;
const StyledNthContainer = styled.View`
    align-items:center;
    flex:1;
    top:10%;
`;
const StyledNthLottie = styled(LottieView)`
    height:250px;
    width:250px;
`;
const StyledNthText = styled.Text`
    color:#555;
    font-size:15px;
`;