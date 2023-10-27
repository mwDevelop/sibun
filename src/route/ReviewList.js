//------------------------------ MODULE --------------------------------
import { useMemo, useState } from 'react';
import styled from 'styled-components/native';
import { useStoreReview, useStore } from '@/hooks';
import { StarScore, ReviewListView, CustomSelect } from '@/component';
import { reviewScoreOption } from '@/data/constants';
import { cloneObject } from '@/lib';

//---------------------------- COMPONENT -------------------------------
export default function ReviewList({route}){
    //init
    const { storeIdx } = route.params;

    //data
    const [review] = useStoreReview(storeIdx);
    const [store] = useStore(storeIdx);

    //state
    const [photoReview, setPhotoReview] = useState([]);
    const [isPhoto, setIsPhoto] = useState(false);
    const [filter, setFilter] = useState(0);

    //function
    const filterReview = (opt, data) => {
        const copiedReview = data.map((i) => cloneObject(i)); //copy

        copiedReview.sort((a,b) => {
            if(opt == 0) return a.review_reg_dt == b.review_reg_dt ? 0 : (a.review_reg_dt > b.review_reg_dt ? -1 : 1); //new
            if(opt == 1) return a.review_reg_dt == b.review_reg_dt ? 0 : (a.review_reg_dt > b.review_reg_dt ? 1 : -1); //old
            if(opt == 2) return Number(b.review_rating) - Number(a.review_rating); //high
            if(opt == 3) return Number(a.review_rating) - Number(b.review_rating); //row
            else return 0;
        });
    
        //return
        return copiedReview;
    }

    //memo
    const reviewStoreGear = useMemo(() => (
        <>
        <StyledScoreAvg>
            <StyledScoreText>
                {Number(store.store_review_avg).toFixed(1)}
                <StyledScoreTextHighlight>({store.store_review_cnt})</StyledScoreTextHighlight>
            </StyledScoreText>
        </StyledScoreAvg>
        <StyledScoreStar>
            <StarScore score={store.store_review_avg} size={35}/>
        </StyledScoreStar>
        </>
    ), [store]);

    const reviewChartGear = useMemo(() => {
        if(!review || !review.length) return null; //optional

        const menu = cloneObject(reviewScoreOption); //deep copy
        let isImgList = []; //extra count for isPhoto state
        review.forEach((data) => { //couting reviews for each score key
            const rating = Number(data.review_rating);
            if('cnt' in menu[rating]){
                menu[rating].cnt++;
            }else menu[rating].cnt = 1;

            if(data.review_img1 || data.review_img2 || data.review_img3) isImgList.push(data);
        });    

        if(isImgList.length) setPhotoReview(isImgList);

        return (
            <StyledScoreChart>
                {
                    Object.entries(menu) //into array
                    .sort((a, b) => Number(b[0]) - Number(a[0])) //reverse order
                    .map(([key, val]) => {
                        const percentage = val.cnt/review.length*100;
                        return (
                            <StyledScoreChartRow key={key}>
                                <StyledScoreChartTitle>
                                    {val.title} ({key}점)
                                </StyledScoreChartTitle>
                                <StyledScoreChartBar>
                                    <StyledScoreChartBarPercent ratio={ percentage ? val.cnt/review.length*100 : 0 }/>
                                </StyledScoreChartBar>
                                <StyledScoreChartNumber>
                                    {val.cnt ? (val.cnt/review.length*100).toFixed(0) : 0} %
                                </StyledScoreChartNumber>
                            </StyledScoreChartRow>
                        )
                    })
                }     
            </StyledScoreChart>
        );
    }, [review]);

    const reviewListGear = useMemo(() => {
        if(!review) return <StyledEmptyText>등록된 리뷰 건이 없습니다.</StyledEmptyText>; //optional

        let targetdata = !isPhoto ? review : photoReview; //photo filter
        
        const option = ["최신순", "오래된순", "별점높은순", "별점낮은순"]; //extra filter
        const filteredReview = filterReview(filter, targetdata);

        return (
            <>
            <StyledReviewListTop>
                <StyleReviewListTopLeft>
                    <StyledReviewListTopTotal suppressHighlighting={true} onPress={() => setIsPhoto(false)} highlight={!isPhoto}>전체({review.length})  </StyledReviewListTopTotal>
                    <StyleReviewListTopFence>|</StyleReviewListTopFence>
                    <StyledReviewListTopPhoto suppressHighlighting={true} onPress={() => setIsPhoto(true)} highlight={isPhoto}>  포토리뷰({photoReview.length})</StyledReviewListTopPhoto>
                </StyleReviewListTopLeft>
                <StyledReviewListTopRight>
                    <CustomSelect option={option} onSelect={setFilter}/>
                </StyledReviewListTopRight>
            </StyledReviewListTop>
            <ReviewListView data={filteredReview} />
            </>
        )
    }, [review, photoReview, isPhoto, filter]);

    //render
    return (
        <StyledConatainer>
            <StyledScoreSummaryBox>
                {reviewStoreGear}
                {reviewChartGear}
            </StyledScoreSummaryBox>      
            <StyledReviewListBox>
                {reviewListGear}
            </StyledReviewListBox>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.ScrollView`
    background:white;
    padding:5px 15px;
`;
const StyledScoreSummaryBox = styled.View`
    padding: 15px 0 20px 0;
`;
const StyledScoreAvg = styled.View`
    align-items:center;
    padding: 5px 0;
`;
const StyledScoreText = styled.Text`
    font-size:26px;
    font-weight:700;
`;
const StyledScoreTextHighlight = styled.Text`
    font-size:14px;
    color:#FFA0B1;
`;
const StyledScoreStar = styled.View`
    align-items:center;
`;
const StyledScoreChart = styled.View`
    align-items:center; 
    margin-top: 25px;
    border-width:1px;
    border-color:#E9E9E9;
    border-radius:10px;
    padding:5px 10px;
`;
const StyledScoreChartRow = styled.View`
    flex-direction:row;
    align-items:center;
    padding: 5px 0;
`;
const StyledScoreChartTitle = styled.Text`
    flex:2;
    color:#444;
    font-weight:500;
`;
const StyledScoreChartBar = styled.View`
    flex:3;
    height:5px;
    background:#E9E9E9;
    border-radius:10px;
`;
const StyledScoreChartBarPercent = styled.View`
    height:5px;
    background:#F33562;
    width:${(props) => props.ratio}%;
    border-radius:10px;
`;
const StyledScoreChartNumber = styled.Text`
    flex:1;
    text-align:right;
    font-size:16px;
    color:#444;
    font-weight:700;
`;
const StyledReviewListBox = styled.View`
    padding-bottom:100px;
`;
const StyledReviewListTop = styled.View`
    flex-direction:row;
    justify-content:space-between;
    margin: 3px 0;
    align-items:center;
`;
const StyleReviewListTopLeft = styled.View`
    flex-direction:row;
`;
const StyledReviewListTopRight = styled.View`
    
`;
const StyledReviewListTopTotal = styled.Text`
    color:#222;
    font-weight:${(props) => props.highlight ? "700" : "400"};
`;
const StyleReviewListTopFence = styled.Text`
    font-weight:600;
`;
const StyledReviewListTopPhoto = styled.Text`
    color:#444;
    font-weight:${(props) => props.highlight ? "700" : "400"};
`;
const StyledEmptyText = styled.Text`
    align-self:center;
    top:50px;
    color:#555;
    font-weight:500;
`;