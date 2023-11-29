//------------------------------ MODULE --------------------------------
import { useLayoutEffect } from 'react';
import styled from 'styled-components/native';
import { useMyReview } from '@/hooks';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { StarScore } from '@/component';
import { useNavigation } from '@react-navigation/native';
import { onerror } from '@/assets/img';

//---------------------------- COMPONENT -------------------------------
export default function ReviewMyList(){
    //init
    const navigation = useNavigation();

    //data
    const [review, reviewUpdate] = useMyReview();

    //effcet
    useLayoutEffect(() => {
        reviewUpdate();
    }, []);

    //render
    return (
        <StyledConatainer>
            {
                review?.length ? review.map((d, i) => {
                    const tags = d.review_tags && d.review_tags.split(',');
                    return (
                        <StyledItem key={i}>
                            <StyledItemHeader>
                                <StyledItemDate>{d.reservation_date.substr(2).replaceAll('-','.')}</StyledItemDate>
                                <StyledHeaderButton onPress={() => navigation.navigate('예약상세', {id:d.reservation_idx})}>
                                    <StyledHeaderButtonText>예약 상세보기</StyledHeaderButtonText>
                                    <Icon name="chevron-forward-outline" size={14}/>
                                </StyledHeaderButton>
                            </StyledItemHeader>
                            <StyledStoreContent>
                                <StyledStoreImageArea>
                                    <StyledStoreImage source={d.store_main_simg ? {uri:d.store_main_simg} : onerror} defaultSource={onerror} resizeMode="contain"/>
                                </StyledStoreImageArea>
                                <StyledStoreInfo>
                                    <StyledStoreName>{d.store_name}</StyledStoreName>
                                    <StyledStoreAddr>{d.store_addr}</StyledStoreAddr>
                                </StyledStoreInfo>
                            </StyledStoreContent>
                            <StyledReviewContent>
                                <StyledReviewInfo style={{width:120}}>
                                    <StarScore score={d.review_rating} showText={true} textColor='#222'/>
                                </StyledReviewInfo>
                                <StyledReviewInfo>
                                    <StyledReviewText>
                                        {d.review_content}
                                    </StyledReviewText>
                                </StyledReviewInfo>
                                {
                                    tags? (
                                        <StyledReviewInfo style={{flexDirection:'row'}}>
                                            <StyledReviewTag>
                                                {tags.slice(0,4).map((t) => `  #${t}  `)}
                                            </StyledReviewTag>
                                            <StyledReviewTagExtra>
                                                {tags.length-4 > 0 ? `  +${tags.length-4}` : ''}
                                            </StyledReviewTagExtra>
                                        </StyledReviewInfo>
                                    ) : null          
                                }
                            </StyledReviewContent>
                            <StyledItemFooter>
                                <StyledItemFooterButton onPress={() => navigation.navigate('내 리뷰 상세보기', {id:d.review_idx})}>
                                    <StyledItemFooterText>리뷰 상세보기</StyledItemFooterText>
                                    <Icon name="chevron-forward-outline" size={16} color='#F33562'/>
                                </StyledItemFooterButton>
                            </StyledItemFooter>
                        </StyledItem>
                    )
                }) : <StyledEmptyText>작성한 리뷰 건이 존재하지 않습니다.</StyledEmptyText>
            }
        </StyledConatainer>
    );
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.ScrollView`
    flex:1;
    background:#F1F1F1;
`;
const StyledItem = styled.View`
    margin:10px;
    margin-top:13px;
    background:#fff;
    border-radius:5px;
    shadow-color: black; 
    shadow-offset: 5px;
    shadow-opacity: 0.1;
    elevation:1;
`;
const StyledItemHeader = styled.View`
    flex-direction:row;
    justify-content:space-between;
    padding:8px;
    border-bottom-width:1px;
    border-color:#E9E9E9;
`;
const StyledItemDate = styled.Text`
    font-size:12px;
    color:#222;
    font-weight:400;
`;
const StyledHeaderButton = styled.TouchableOpacity`
    flex-direction:row;
    align-items:center;
`;
const StyledHeaderButtonText = styled.Text`
    color:#222;
    font-size:12px;
`;
const StyledStoreContent = styled.View`
    padding:10px 20px;
    flex-direction:row;
    align-items:center;
`;
const StyledStoreImageArea = styled.View`
    background-color:#fff;
    border-radius:5px;
    shadow-color: black; 
    shadow-offset: 3px;
    shadow-opacity: 0.3;
    elevation:1;
`;
const StyledStoreImage = styled(FastImage)`
    height:60px;
    width:60px;
    background:#E9E9E9;
    border-radius:5px;
`;
const StyledStoreInfo = styled.View`
    margin-left:10px;  
`;
const StyledStoreName = styled.Text`
    margin-bottom:5px;
    font-size:14px;
    font-weight:700;
    color:#222;
`;
const StyledStoreAddr = styled.Text`
    color:#444;
    font-size:12px;
    font-weight:400;
`;
const StyledReviewContent = styled.View`
    padding:0 20px;
`;
const StyledReviewInfo = styled.View`
    padding:5px 0;
`;
const StyledReviewText = styled.Text`  
`;
const StyledReviewTag = styled.Text`
    background:#E9E9E9;
    line-height:25px;
`;
const StyledReviewTagExtra = styled.Text`
    background:#fff;
    line-height:25px;
    color:#444;
    font-size:12px;
    font-weight:700;
`;
const StyledItemFooter = styled.View`
    margin:8px;
    padding-top:8px;
    border-top-width:1px;
    border-color:#E9E9E9;
`;
const StyledItemFooterButton = styled.TouchableOpacity`
    flex-direction:row;
    align-items:center;
    justify-content:flex-end;
    right:-4px;
`;
const StyledItemFooterText = styled.Text`
    color:#F33562;
    font-weight:500;
    font-size:14px;
`;
const StyledEmptyText = styled.Text`
    margin-top:50px;
    align-self:center;
    color:#222;
`;