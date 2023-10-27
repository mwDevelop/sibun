//------------------------------ MODULE --------------------------------
import { useLayoutEffect, useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { useMyReview } from '@/hooks';
import { StarScore } from '@/component';
import { numberToTime } from '@/lib';
import { ImageModal } from '@/component';
import { useMyReviewMutate } from '@/hooks';
import { alertDefaultSetting } from '@/data/constants';
import AwesomeAlert from 'react-native-awesome-alerts';
import Toast from 'react-native-toast-message';

//---------------------------- COMPONENT -------------------------------
export default function ReviewDesc({route}){
    //init
    const reviewId = route?.params?.id;
    const reviewMutation = useMyReviewMutate();
    const navigation = useNavigation();

    //state
    const [modalData, setModalData] = useState(null);
    const [confirm, setConfirm] = useState(false);

    //function
    const badToast = (msg) => {
        return Toast.show({
            type: 'bad',
            text1: msg || '문제가 발생했습니다\n\n관리자에게 문의 해 주세요!',
            topOffset: 120,
            visibilityTime: 2000
        })
    };

    const remove = () => {
        reviewMutation.mutate({type:"remove", index:reviewId}, {onSuccess: async(res) => {
            if(res.data.result == "000"){
                navigation.navigate('리뷰관리');
            }else{
                setTimeout(() => badToast('리뷰 삭제에 실패하였습니다. 관리자에게 문의 해 주세요.'),500);
            }
        }});
    }

    //data
    const [review, reviewUpdate] = useMyReview(reviewId);

    //memo
    const bodyGear = useMemo(() => {
        if(!review) return null;

        const photoArr = [];
        if(review.review_img1) photoArr.push(review.review_img1);
        if(review.review_img2) photoArr.push(review.review_img2);
        if(review.review_img3) photoArr.push(review.review_img3);

        return (
            <>
                <StyledSection style={{flexDirection:'row', borderBottomWidth: 1}}>
                    <StyledStoreImage source={{uri:review.store_main_simg}} resizeMode='contain'/>
                    <StyledStoreInfo>
                        <StyledStoreName>{review.store_name}</StyledStoreName>
                        <StyledStoreAddr>{review.store_addr}</StyledStoreAddr>
                    </StyledStoreInfo>
                </StyledSection>
                <StyledSection style={{paddingTop:5}}>
                    <StyledSectionRow style={{justifyContent:'space-between'}}>
                        <StarScore score={review.review_rating} size={14} showText={true} textSize='20px'/>
                        <StyledReservationTime>
                            {review.reservation_date.substr(2).replaceAll('-','.') + '   '}
                            {numberToTime(review.reservation_time)}~
                            {numberToTime(Number(review.reservation_time)+Number(review.reservation_period))}
                        </StyledReservationTime>
                    </StyledSectionRow>
                    {!photoArr.length? null : (
                        <StyledSectionRow>
                            {photoArr.map((item, index) => (
                                <StyledPhotoBox key={index} onPress={() => setModalData({data : photoArr, startIdx: index})}><StyledPhoto resizeMode="cover" source={{uri : item}}/></StyledPhotoBox>
                            ))}
                        </StyledSectionRow>                        
                    )}
                    {!review.review_tags ? null : (
                        <StyledSectionRow>
                            {review.review_tags.split(',').map((item, index) => <StyledTag key={index}>  #{item}  </StyledTag>)}
                        </StyledSectionRow>
                    )}
                    <StyledSectionRow>
                        <StyledTextArea>
                            {review.review_content}
                        </StyledTextArea>
                    </StyledSectionRow>
                    <StyledDeleteButton suppressHighlighting={true} onPress={() => setConfirm(true)}>
                        <Icon name='trash-outline' size={15}/> 삭제하기
                    </StyledDeleteButton>
                </StyledSection>            
            </>
        )
    }, [review]);

    const confirmGear = useMemo(() => (
        <AwesomeAlert
            {...alertDefaultSetting}
            show={confirm}
            title='시:분'
            message='삭제 후에는 다시 리뷰를 등록 할 수 없습니다. 리뷰를 삭제하시겠습니까?'
            confirmText="삭제하기"
            cancelText="아니오"
            onCancelPressed={() => {
                setConfirm(false);
            }}
            onConfirmPressed={() => {
                setConfirm(false);
                remove();
            }}
            onDismiss={() => setConfirm(false)}
        />
    ), [confirm]);

    //effcet
    useLayoutEffect(() => {
        reviewUpdate();
    }, []);

    //render
    return (
        <StyledConatainer>
            {bodyGear}
            {confirmGear}
            <ImageModal data={modalData?.data} startIdx={modalData?.startIdx} close={() => setModalData(null)}/>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
`;
const StyledSection = styled.View`
    margin:0 15px;
    border-color:#E9E9E9;
    padding:20px 0;
`;
const StyledStoreImage = styled(FastImage)`
    height:70px;
    width:70px;
    border-radius:5px;
    background:#D9D9D9;
`;
const StyledStoreInfo = styled.View`
    margin-left:10px;
    justify-content:center;
`;
const StyledStoreName = styled.Text`
    color:#222;
    font-size:14px;
    font-weight:700;
    padding:1px 0;
`;
const StyledStoreAddr = styled.Text`
    color:#444;
    font-size:12px;
    font-weight:400;
    padding:1px 0;
`;
const StyledSectionRow = styled.View`
    align-items:center;
    flex-direction:row;
    margin:8px 0;
    flex-wrap:wrap;
`;
const StyledReservationTime = styled.Text`
    color:#7D7D7D;
    font-size:12px;
    justify-content:flex-end;
`;
const StyledPhotoBox = styled.TouchableOpacity`
    width:90px;
    height:90px;
    background:#eee;
    border-radius:5px;
    overflow:hidden;
    margin-right:10px;
`;
const StyledPhoto = styled(FastImage)`
    height:100%;
`;
const StyledTag = styled.Text`
    background:#E9E9E9;
    line-height:25px;
`;
const StyledTextArea = styled.Text`
    font-size:14px;
    font-weight:500;
    color:#222;
`;
const StyledDeleteButton = styled.Text`
    color:#888;
    font-weight:500;
    align-self:flex-end;
`;


