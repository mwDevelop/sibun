//------------------------------ MODULE --------------------------------
import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStore, useStoreImage, useCoupon, usePriceList, useReview, useUser } from '@/hooks';
import { ReviewListView, ImageCarousel, CouponSlide } from '@/component';
import { koreanDay, defaultImage } from '@/data/constants';
import { numberToTime, mobileMask } from '@/lib';
import { star_filled } from '@/assets/img';
import FastImage from 'react-native-fast-image';

//---------------------------- COMPONENT -------------------------------
export default function Desc({route}){
    //init
    const navigation = useNavigation();
    const legacy = route.params;

    //data
    const [storeNew] = useStore(legacy.store_idx);
    const [imageList] = useStoreImage(legacy.store_idx);
    const [coupon] = useCoupon(legacy.store_idx, {nowAvailable:true});
    const [priceList] = usePriceList(legacy.store_idx);
    const [review] = useReview(legacy.store_idx);
    const [user] = useUser();

    //function
    const reserve = () => {
        if(!user) return;
        navigation.navigate('예약', {id:storeNew.store_idx})
    }

    //memo
    const headerGear = useMemo(() => (
        <StyledHeader>
            <StyledHeaderLeft>
                <StyledBackIcon name="chevron-back-outline" onPress={() => navigation.goBack()} />
            </StyledHeaderLeft>
            <StyledHeaderRight>
                <StyledHeartIcon name="heart-outline"/>
                <StyledShareIcon name="share-social-outline"/>
            </StyledHeaderRight>
        </StyledHeader>
    ));

    const slideGear = useMemo(() => {
        if(!imageList) return;
        const imageData = imageList.length ? imageList.map((i) => i.store_img_data) : [defaultImage];
        return (
            <ImageCarousel data={imageData}/>
        )
    }, [imageList]);

    const storeGear = useMemo(() => {
        const usingData = storeNew || legacy;
        return (
            <>
                <StyledSection>
                    <StyledSectionRow>
                        <StyledStoreName>
                            {usingData.store_name || null}
                        </StyledStoreName>
                        <StyledStoreDistance>
                            10.5km
                        </StyledStoreDistance>
                    </StyledSectionRow>
                    <StyledSectionRow style={{justifyContent:"space-between"}}>
                        <StyledStoreAddress>{usingData.store_addr || null}</StyledStoreAddress>
                        <StyledSectionRightButton>지도이동<Icon name="chevron-forward-outline" size={13.5}/></StyledSectionRightButton>
                    </StyledSectionRow>                    
                    <StyledSectionRow>
                        <StyledScoreTitle>평점</StyledScoreTitle>
                        <StyledScore>
                            <StyledScoreStar source={star_filled}/> {Number(usingData.store_review_avg || 0).toFixed(1)}
                        </StyledScore>
                        <StyledReviewSemiButtonBox>
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
                                        (d, i) => (i>0 ? ',' : '') + koreanDay[Number(d) == 7 ? 0 : Number(d)]
                                    ) : null
                            }요일 휴무
                        </StyledStoreTime>
                    </StyledSectionRow>
                    <StyledSectionRow>
                        <StyledSectionRowTitle>전화</StyledSectionRowTitle>
                        <StyledStoreTelContainer>
                            <StyledStoreTelBox>
                                <StyledStoreTelText>{mobileMask(usingData.store_tel || null)}</StyledStoreTelText>
                            </StyledStoreTelBox>
                            <StyledSectionRightButton>전화하기<Icon name="chevron-forward-outline" size={13.5}/></StyledSectionRightButton>
                        </StyledStoreTelContainer>
                    </StyledSectionRow>
                </StyledSection>
            </>
        );
    }, [storeNew]);

    const couponGear = useMemo(() => {
        return !coupon ? null : (
            <StyledSection>
                <CouponSlide couponList={coupon}/>
            </StyledSection>
        )
    }, [coupon]);

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
                                    {Number(data.item.store_pricing_price).toLocaleString('en-US')}원
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
                            <StyledScoreStar source={star_filled}/> {Number(storeNew.store_review_avg).toFixed(1)}
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
    justify-content:space-between;
`;
const StyledBackIcon = styled(Icon)`
    font-size:35px;
`;
const StyledHeartIcon = styled(Icon)`
    font-size:30px;
`;
const StyledShareIcon = styled(Icon)`
    font-size:30px;
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