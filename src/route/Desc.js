//------------------------------ MODULE --------------------------------
import { useLayoutEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStore, useStoreImage, useCoupon, usePriceList, useStoreReview, useUser, useLike, useLikeMutate } from '@/hooks';
import { ReviewListView, ImageCarousel, CouponSlide, CustomLoading } from '@/component';
import { koreanDay } from '@/data/constants';
import { numberToTime, mobileMask, setViewedStore, permissionCheck, getDistance } from '@/lib';
import { star_filled, heart_empty, heart_fill, share } from '@/assets/img';
import FastImage from 'react-native-fast-image';
import { DevicePositionAtom } from '@/data/global';
import { useRecoilState } from 'recoil';
import Geolocation from "react-native-geolocation-service";
import Toast from 'react-native-toast-message';
import { Linking } from 'react-native';
import { heart_pop } from '@/assets/animation';
import AnimatedLoader from "react-native-animated-loader";

//---------------------------- COMPONENT -------------------------------
export default function Desc({route}){
    //init
    const navigation = useNavigation();
    const legacy = route.params;
    const likeMutation = useLikeMutate();

    //atom
    const [positionCache, setPositionCache] = useRecoilState(DevicePositionAtom);

    //data
    const [storeNew, storeUpdate] = useStore(legacy.store_idx);
    const [imageList] = useStoreImage(legacy.store_idx);
    const [coupon] = useCoupon(legacy.store_idx, {/*nowAvailable:true*/});
    const [priceList] = usePriceList(legacy.store_idx);
    const [review] = useStoreReview(legacy.store_idx);
    const [user] = useUser();
    const [like] = useLike();

    //state
    const [position, setPosition] = useState(positionCache);
    const [heartPopVisible, setHeartPopVisible] = useState(false);

    //function
    const positionUpdate = async() => {
        try{
            const chkResult = await permissionCheck('location');//chk
            return (chkResult != "granted") ? //set location
                Toast.show({
                    type: 'bad',
                    text1: '위치정보 사용을 위해 권한을 허용해 주세요.',
                    topOffset: 120,
                    visibilityTime: 1000
                }) : 
                Geolocation.getCurrentPosition(
                    pos => {
                        setPosition(pos.coords);
                        setPositionCache(pos.coords);
                    },
                    error => {
                        console.log(error);
                        Toast.show({
                            type: 'bad',
                            text1: error.message,
                            topOffset: 120,
                            visibilityTime: 1000
                        });                                          
                    },
                    {
                        enableHighAccuracy: false,
                        timeout: 2000,
                        maximumAge: 0,
                    },
                );
        }catch(e){
            console.log(e);
        }
    }; 

    const reserve = () => {
        if(!user) return Toast.show({ //case not login
            type: 'bad',
            text1: '로그인/회원가입 후 예약이 가능합니다.',
            topOffset: 120,
            visibilityTime: 1000
        });
        if(storeNew?.store_closed_days?.split(',').length > 6) return Toast.show({ //case allday close
            type: 'bad',
            text1: '현재 이용할 수 없는 매장입니다.',
            topOffset: 120,
            visibilityTime: 1000
        });
        navigation.navigate('예약', {id:storeNew.store_idx})
    }

    const addLike = (storeIdx) => {
        const params = { mb_like_store_idx : storeIdx };
        likeMutation.mutate({type:"add", params:params});                
        setHeartPopVisible(true);
    }

    const removeLike = (likeIdx) => {
        likeMutation.mutate({type:"remove", id:likeIdx});                
    }

    //memo
    const headerGear = useMemo(() => {
        const storeIdx = storeNew?.store_idx;
        const likeTarget = like ? like.filter((i) => i.mb_like_store_idx == storeIdx) : null;
        const likeIdx = likeTarget?.length ? likeTarget[0].mb_like_idx : null;
        
        return (
            <StyledHeader>
                <StyledHeaderLeft>
                    <StyledBackIcon name="chevron-back-outline" onPress={() => navigation.goBack()} suppressHighlighting={true} />
                </StyledHeaderLeft>
                <StyledHeaderRight>
                    { 
                        user ? (
                            <StyledIconTouch onPress={() => likeIdx ? removeLike(likeIdx) : addLike(storeIdx)}>
                                <StyledHeartIcon source={likeIdx ? heart_fill : heart_empty} resizeMode="contain"/>
                            </StyledIconTouch>
                        ) : null
                    }
                    {
                        /*
                        <StyledIconTouch>
                            <StyledShareIcon source={share} resizeMode="contain"/>                      
                        </StyledIconTouch>                    
                        */
                    }

                </StyledHeaderRight>
            </StyledHeader>
        );
    }, [like, storeNew, user]);

    const slideGear = useMemo(() => {
        if(!imageList) return;
        const imageData = imageList.length ? imageList.map((i) => i.store_img_data) : [null];
        return (
            <ImageCarousel data={imageData} />
        )
    }, [imageList]);

    const storeGear = useMemo(() => {
        const usingData = storeNew || legacy;
        const callNumber = () => Linking.openURL(`tel:${usingData.store_tel}`);
        return (
            <>
                <StyledSection>
                    <StyledSectionRow>
                        <StyledStoreName>
                            {usingData.store_name || null}
                        </StyledStoreName>
                        {
                            position ? (
                                <StyledStoreDistance>
                                    {getDistance(position.longitude, position.latitude, Number(usingData.store_addr_x), Number(usingData.store_addr_y)).toFixed(1)}km
                                </StyledStoreDistance>
                            ) : null
                        }
                    </StyledSectionRow>
                    <StyledSectionRow style={{justifyContent:"space-between"}}>
                        <StyledStoreAddress>{usingData.store_addr || null}</StyledStoreAddress>
                        <StyledSectionRightButton 
                            onPress={() => navigation.navigate('내주변', {
                                target : {
                                    latitude : Number(usingData.store_addr_y), 
                                    longitude : Number(usingData.store_addr_x),
                                    zoom : 14
                                }
                            })}
                            suppressHighlighting={true}
                        >
                            지도이동<Icon name="chevron-forward-outline" size={13.5}/>
                        </StyledSectionRightButton>
                    </StyledSectionRow>                    
                    <StyledSectionRow>
                        <StyledScoreTitle>평점</StyledScoreTitle>
                        <StyledScore>
                            <StyledScoreStar source={star_filled}/> {Number(usingData.store_review_avg || 0).toFixed(1)}
                        </StyledScore>
                        <StyledReviewSemiButtonBox onPress={() => navigation.navigate('리뷰', {storeIdx : usingData.store_idx})}>
                            <StyledReviewSemiButton>
                                리뷰 {usingData.store_review_cnt || 0}개<Icon name="chevron-forward-outline" size={11}/>
                            </StyledReviewSemiButton>
                        </StyledReviewSemiButtonBox>
                    </StyledSectionRow>
                </StyledSection>
                <StyledSection>
                    <StyledSectionRow>
                        <StyledSectionRowTitle>영업시간</StyledSectionRowTitle>
                        <StyledStoreTime>
                            {numberToTime(usingData.store_open_time || null)} ~ {numberToTime(usingData.store_close_time || null)}
                            {'   '}
                            {
                                usingData?.store_closed_days ?
                                    usingData?.store_closed_days.split(',').map(
                                        (d, i) => koreanDay[Number(d) == 7 ? 0 : Number(d)]
                                    ) + '요일 휴무' : null
                            }
                        </StyledStoreTime>
                    </StyledSectionRow>
                    <StyledSectionRow>
                        <StyledSectionRowTitle>전화</StyledSectionRowTitle>
                        <StyledStoreTelContainer>
                            <StyledStoreTelBox>
                                <StyledStoreTelText onPress={callNumber}>{mobileMask(usingData.store_tel || null)}</StyledStoreTelText>
                            </StyledStoreTelBox>
                            <StyledSectionRightButton onPress={callNumber} suppressHighlighting={true}>전화하기<Icon name="chevron-forward-outline" size={13.5}/></StyledSectionRightButton>
                        </StyledStoreTelContainer>
                    </StyledSectionRow>
                </StyledSection>
            </>
        );
    }, [storeNew]);

    const couponGear = useMemo(() => {
        return storeNew?.store_voucher_use_yn == 'n' || !coupon ? null : (
            <StyledSection>
                <CouponSlide couponList={coupon}/>
            </StyledSection>
        )
    }, [coupon, storeNew]);

    const priceGear = useMemo(() => {
        const dayInx = String(new Date().getDay()); 
        if(dayInx === '0') dayInx = '7'; //sunday idx 0 -> 7

        return !priceList ? null : (
            <StyledSection>
                <StyledSectionRow>
                    <StyledSectionRowTitle>이용가격</StyledSectionRowTitle>
                </StyledSectionRow>
                <StyledSectionRow>
                    <StyledStorePriceBox 
                        data={priceList}
                        scrollEnabled={false}
                        nestedScrollEnabled={true}
                        renderItem={(data) => (
                            <StyledStorePriceRow>
                                <StyledStorePriceTime>
                                    {data.item.store_pricing_time}분
                                </StyledStorePriceTime>
                                <StyledStorePriceCnt>
                                    {data.item.store_pricing_cnt}회 
                                </StyledStorePriceCnt>
                                <StyledStorePriceUnderline/>
                                <StyledStorePriceDisplay>
                                    {Number(data.item.store_pricing_price).toLocaleString()}원
                                </StyledStorePriceDisplay>
                            </StyledStorePriceRow>
                        )}                                            
                    /> 
                </StyledSectionRow>
            </StyledSection>
        )
    }, [priceList]);

    const facilityGear = useMemo(() => {
        if(!storeNew) return null;
        const facilityList = storeNew.store_amenities ? storeNew.store_amenities.split(',') : [];
        return (
            <StyledSection>
                <StyledSectionRow>
                    <StyledSectionRowTitle>편의시설</StyledSectionRowTitle>
                </StyledSectionRow>
                <StyledSectionRow style={{paddingTop:0, flexWrap:'wrap'}}>
                    {
                        facilityList.map((item, index) => (
                            <StyledHashTagBox key={index}>
                                <StyledHashTagText>
                                    <StyledHighlight>#</StyledHighlight>{item}
                                </StyledHashTagText>
                            </StyledHashTagBox>
                        ))
                    }
                </StyledSectionRow>
            </StyledSection>
        )
    }, [storeNew]);  
    
    const reviewGear = useMemo(() => {
        if(!review || !storeNew) return null;
        const storeIdx = storeNew.store_idx;
        return (
            <StyledSection style={{borderBottomWidth:0}}>
                <StyledSectionRow style={{justifyContent:"space-between"}}>
                    <StyledSectionRowTitle style={{width:100}}>
                        리뷰({review.length}){'   '}
                        <StyledScore>
                            <StyledScoreStar source={star_filled} resizeMode='contain'/> {Number(storeNew.store_review_avg).toFixed(1)}
                        </StyledScore>
                    </StyledSectionRowTitle>
                    <StyledSectionRightButton 
                        style={{color:"#444"}} 
                        onPress={() => navigation.navigate('리뷰', {storeIdx})}
                        suppressHighlighting={true}
                    >
                        더보기
                    <Icon name="chevron-forward-outline" size={13.5}/></StyledSectionRightButton>                        
                </StyledSectionRow>            
                <ReviewListView data={review.slice(0,2)}/>
                <StyledReviewShowButton suppressHighlighting={true} onPress={() => navigation.navigate('리뷰', {storeIdx})}>리뷰더보기</StyledReviewShowButton>
            </StyledSection>                
        )
    }, [review, storeNew]);

    const footerGear = useMemo(() => (
        <StyledFooter>
            <StyledSubmit onPress={() => reserve(storeNew.store_idx)}>
                <StyledSubmitText>예약하기</StyledSubmitText>
            </StyledSubmit>
        </StyledFooter>
    ));

    const heartPopGear = useMemo(() => {
        if(heartPopVisible) setTimeout(() => setHeartPopVisible(false), 700);
        else return null;

        return(
            <AnimatedLoader
                visible={heartPopVisible}
                overlayColor="rgba(255,255,255,0)"
                source={heart_pop}
                speed={1.5}
                animationStyle={{height:400, width:400}}
            />
        )
    }, [heartPopVisible]);

    //effect
    useLayoutEffect(() => {
        storeUpdate();
        if(legacy?.store_idx) setViewedStore(legacy.store_idx);
        if(!positionCache) positionUpdate();
    }, []);

    //render
    return(
        <StyledConatainer>
            {headerGear}
            <StyledScrollContainer>
                <StyledBody>
                    <StyledSlide>
                        {slideGear}
                    </StyledSlide>
                    <StyledContent>
                        {storeGear}
                        {couponGear}
                        {priceGear}
                        {facilityGear}
                        {reviewGear}
                    </StyledContent>
                </StyledBody>
            </StyledScrollContainer>
            {footerGear}
            {heartPopGear}
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
`;
const StyledScrollContainer = styled.ScrollView`
    flex:1;
`;
const StyledHeader = styled.View`
    height: 50px;
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
    padding-right:15px;
    padding-left:8px;
    border-bottom-width:1px;
    border-color:#E9E9E9;
`;
const StyledHeaderLeft = styled.View`
`;
const StyledHeaderRight = styled.View`
    flex-direction:row;
    width:80px;
    justify-content:flex-end;
`;
const StyledBackIcon = styled(Icon)`
    font-size:35px;
`;
const StyledIconTouch = styled.TouchableOpacity`
    margin-left:25px;
`;
const StyledHeartIcon = styled(FastImage)`
    height:30px;
    width:30px;
`;
const StyledShareIcon = styled(FastImage)`
    height:30px;
    width:30px;
`;
const StyledBody = styled.View`
`;
const StyledSlide = styled.View`
    height:430px;
    background : #fff;
`;
const StyledContent = styled.View`
`;
const StyledSection = styled.View`
    padding:15px 20px;
    border-bottom-width:1px;
    border-color:#E9E9E9;
`;
const StyledSectionRow = styled.View`
    flex-direction:row;
    padding:5px 0;
    align-items:center;
`;
const StyledStoreName = styled.Text`
    font-size:18px;
    font-weight:700;
    color:#222;
`;
const StyledStoreDistance = styled.Text`
    background:#F33562;
    border-radius:5px;
    margin-left:10px;
    font-size:12px;
    color:#fff;
    overflow:hidden;
    line-height:18px;
    padding: 0 3px;
`;
const StyledStoreAddress = styled.Text`
    color:#444;
`;
const StyledSectionRightButton = styled.Text`
    color:#F33562;
    font-weight:500;
`;
const StyledScoreTitle = styled.Text`
    color:#222;
    margin-right:10px;
`;
const StyledScore = styled.Text`
    color:#F33562;
    
`;
const StyledScoreStar = styled(FastImage)`
    width:13px;
    height:13px;
`;
const StyledReviewSemiButtonBox = styled.TouchableOpacity`
    margin-left:10px;
    border-bottom-width:1px;
    border-color:#444;
    justify-content:center;
`;
const StyledReviewSemiButton = styled.Text`
    justify-content:center;
    color:#444;
    font-size:12px;
`;
const StyledSectionRowTitle = styled.Text`
    font-weight:700;
    color:#444;
    width:70px;
`;
const StyledStoreTime = styled.Text`
    flex:4;
`;
const StyledStoreTelContainer = styled.View`
    flex:4;
    justify-content:space-between;
    flex-direction:row;
`;
const StyledStoreTelBox = styled.TouchableOpacity`
    border-bottom-width:1px;
    border-color:#FFA0B1;
`;
const StyledStoreTelText = styled.Text`
    color:#FFA0B1;
`;
const StyledHighlight = styled.Text`
    font-weight:700;
    color:#F33562;
`;
const StyledStorePriceBox = styled.FlatList`
    margin-top:5px;
    padding:20px;
    border-width:1px;
    border-color:#7D7D7D;
    border-radius:10px;
`;
const StyledStorePriceRow = styled.View`
    flex-direction:row;
    padding: 5px 0;
`;
const StyledStorePriceTime = styled.Text`
    flex:2;
    color:#222;
    font-weight:500;
`;
const StyledStorePriceCnt = styled.Text`
    flex:2;
    font-weight:500;
`;
const StyledStorePriceUnderline = styled.View`
    flex:5;
    border-bottom-width:1px;
    border-bottom-color:black;
`;
const StyledStorePriceDisplay = styled.Text`
    font-weight:700;
    padding-left:20px;
`;
const StyledHashTagBox = styled.View`
    border-width:1px;
    border-color:#222;
    border-radius:50px;
    padding:5px 8px 4px 8px;  
    margin-top: 10px;
    margin-right: 10px;
`;
const StyledHashTagText = styled.Text`
    color:#222;
    font-weight:500;
`;
const StyledReviewShowButton = styled.Text`
    border-width:1px;
    border-color:#7D7D7D;
    border-radius:10px;
    line-height:42px;
    margin-bottom:50px;
    text-align:center;
    color:#222;
    font-weight:600;
`;
const StyledFooter = styled.View`
`;
const StyledSubmit = styled.TouchableOpacity`
    background:#FF2D58;
    align-items:center;
`;
const StyledSubmitText = styled.Text`
    color:#FFF;
    font-weight:600;
    font-size:16px;
    line-height:60px;
`;