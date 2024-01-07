//------------------------------ MODULE --------------------------------
import { useState, useMemo } from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { numberToTime, uniquePush } from '@/lib';
import { StarScore, ImageUpload } from '@/component';
import {reviewScoreOption, reviewTagOption, alertDefaultSetting} from '@/data/constants';
import { picture_upload, x_circle } from '@/assets/img';
import { Dimensions } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useMyReviewMutate } from '@/hooks';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//---------------------------- COMPONENT -------------------------------
export default function ReviewEdit({reservationData=null, reviewData=null}){
    //init
    const windowWidth = Dimensions.get('window').width -30/*section margin*/;
    const imageWidth = windowWidth/4 -2/*border*/ -3/*gap*/;
    const textMin = 10;
    const textMax = 300;
    const reviewMutation = useMyReviewMutate();
    const navigation = useNavigation();

    //state
    const [score, setScore] = useState(reviewData?.test || 0);
    const [tags, setTags] = useState([]);
    const [text, setText] = useState('');
    const [uploadOpen, setUploadOpen] = useState(false);
    const [photos, setPhotos] = useState([]);
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

    const saveChk = () => {
        if(score < 1) return badToast(`매장 별점을 선택 해 주세요.`);
        if(text.length < textMin) return badToast(`리뷰작성은 ${textMin}자 이상 등록 해 주세요.`);
        return setConfirm(true);
    }

    const save = () => {
        try{
            const params = { 
                review_reservation_idx: reservationData.reservation_idx,
                review_tags: tags.join(),
                review_content: text,
                review_rating: score
            };
            photos.forEach((item, index) => params[`review_img${index+1}`] = item);
    
            reviewMutation.mutate({type:"add", params:params}, {onSuccess: async(res) => {
                if(res.data.result == "000"){
                    navigation.navigate('리뷰관리');
                    console.log(res.data);
                }else{
                    setTimeout(() => badToast('리뷰 등록에 실패하였습니다. 관리자에게 문의 해 주세요.'), 500);
                }
            }});
        }catch(e){
            console.log(e);
            setTimeout(() => badToast('리뷰 등록에 실패하였습니다. 관리자에게 문의 해 주세요.'), 500);
        }
        return;        
    }

    //memo
    const infoGear = useMemo(() => {
        if(!reservationData) return null;
        const {store_main_simg, store_name, store_addr, reservation_date, reservation_time, reservation_period} = reservationData;
        return (
            <StyledSection style={{flexDirection:'row', borderBottomWidth: 1}}>
                <StyledStoreImage source={{uri:store_main_simg}} resizeMode='contain'/>
                <StyledInfo>
                    <StyledStoreInfo>
                        <StyledStoreName>{store_name}</StyledStoreName>
                        <StyledStoreAddr>{store_addr}</StyledStoreAddr>
                    </StyledStoreInfo>
                    <StyledReserveTime>
                        {`예약일자  ${reservation_date.substr(2).replaceAll('-','.')}  ${numberToTime(reservation_time)}-${numberToTime(Number(reservation_time) + Number(reservation_period))}`}
                    </StyledReserveTime>
                </StyledInfo>
            </StyledSection>
        )
    }, [reservationData]);

    const scoreGear = useMemo(() => {
        return (
            <StyledSection style={{borderBottomWidth: 1}}>
                <StyledSectionTitle>매장은 만족하셨나요?</StyledSectionTitle>
                <StyledScoreRow>
                    <StarScore score={score} size={25} scoreCatch={setScore} starGap='3%'/>
                    {score ? <StyledScoreText>{reviewScoreOption[score]['title']}!</StyledScoreText> : null}
                </StyledScoreRow>
            </StyledSection>
        )
    }, [score]);

    const tagGear = useMemo(() => {
        return (
            <StyledSection style={{borderBottomWidth: 1}}>
                <StyledSectionTitle>매장과 어울리는 태그를 선택해주세요.</StyledSectionTitle>
                <StyledTagList>
                    {
                        reviewTagOption.map((item, index) => {
                            const chked = tags.includes(item);
                            return (
                                <StyledTagBox key={index} onPress={() => setTags(uniquePush(item,tags))} style={{borderColor: chked ? '#F33562' : '#222'}}>
                                    <StyledTagText>
                                        <Icon name={chked ? 'checkmark' : 'add'} color={chked ? '#F33562' : '#222'} size={14}/>{item}
                                    </StyledTagText>
                                </StyledTagBox>
                            )
                        })
                    }
                </StyledTagList>                
            </StyledSection>
        )
    }, [tags]);

    const textGear = useMemo(() => {
        return (
            <StyledSection>
                <StyledSectionTitle>리뷰를 작성해주세요.</StyledSectionTitle>
                <StyledTextArea 
                    maxLength={textMax}
                    multiline={true} 
                    onChangeText={(t) => setText(t)} 
                    value={text} 
                    placeholder={`매장을 이용하면서 느꼈던 점을 리뷰로 남겨주세요.\n(${textMin}자 이상)`}
                />
                <StyledTextCnt>{text.length} / {textMax}</StyledTextCnt>
            </StyledSection>
        )
    }, [text]);

    const photoGear = useMemo(() => {
        const photoList = [...photos];
        return (
            <StyledSection style={{paddingTop:0, paddingBottom:100}}>
                <StyledSectionTitle>사진 업로드({photoList.length}/3)</StyledSectionTitle>
                <StyledPhotoRow>
                    <StyledPhotoBox style={{width:imageWidth}}>
                        <StyledPhotoUploadButton onPress={() => setUploadOpen(true)}>
                            <FastImage source={picture_upload} resizeMode="contain" style={{width: imageWidth/3, height: imageWidth/3}}/>
                        </StyledPhotoUploadButton>
                    </StyledPhotoBox>
                    {
                        photoList.map((item, index) => (
                            <StyledPhotoBox key={index} style={{width:imageWidth, marginLeft:6}}>
                                <FastImage source={{uri:item}} resizeMode="cover" style={{width: imageWidth-2, height: imageWidth-2, backgroundColor:'#E9E9E9', borderRadius:5}}/>
                                <StyledImageDelete 
                                    onPress={() => {
                                        photoList.splice(index,1);
                                        setPhotos(photoList);
                                    }}
                                >
                                    <FastImage source={x_circle} style={{width:15, height:15}}/>
                                </StyledImageDelete>
                            </StyledPhotoBox>
                        ))
                    }
                </StyledPhotoRow>
            </StyledSection>
        )
    }, [photos]);

    const confirmGear = useMemo(() => (
        <AwesomeAlert
            {...alertDefaultSetting}
            show={confirm}
            title='시:분'
            message={'리뷰를 등록하시면 수정하실 수 없습니다. \n 작성하신 리뷰를 등록하시겠습니까?'}
            confirmText="등록하기"
            cancelText="아니오"
            onCancelPressed={() => {
                setConfirm(false);
            }}
            onConfirmPressed={() => {
                save();
                setConfirm(false);
            }}
            onDismiss={() => setConfirm(false)}
        />
    ), [confirm]);

    //render
    return (
        <>
        <StyledConatainer enableOnAndroid>            
                {infoGear}
                {scoreGear}
                {tagGear}
                {textGear}
                {photoGear}
                <ImageUpload 
                    open={uploadOpen} 
                    close={() => setUploadOpen(false)} 
                    dataHandler={setPhotos}
                    title="매장 리뷰와 관련된 사진을 올려주세요!" 
                    max={3}
                    size={300}
                />
                {confirmGear}
        </StyledConatainer>
        <StyledSubmit>
            <StyledSubmitButton onPress={saveChk}>작성 완료</StyledSubmitButton>
        </StyledSubmit>
        </>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled(KeyboardAwareScrollView)`
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
const StyledInfo = styled.View`
    margin-left:10px;
    justify-content:space-between;
`;
const StyledStoreInfo = styled.View`
`;
const StyledStoreName = styled.Text`
    color:#222;
    font-size:14px;
    font-weight:700;
`;
const StyledStoreAddr = styled.Text`
    color:#444;
    font-size:12px;
    font-weight:400;
`;
const StyledReserveTime = styled.Text`
    color:#7D7D7D;
    font-size:12px;
    font-weight:400;
`;
const StyledSectionTitle = styled.Text`
    color:#222;
    font-size:16px;
    font-weight:500;
    margin-bottom:10px;
`;
const StyledSubmit = styled.View`
    position:absolute;
    width:100%;
    bottom:0;
`;
const StyledSubmitButton = styled.Text`
    background:#FF2D58;
    color:#fff;
    text-align:center;
    padding:20px;
    font-size:16px;
    font-weight:600;
`;
const StyledScoreRow = styled.View`
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
`;
const StyledScoreText = styled.Text`
    color:#F33562;
    font-size:14px;
    font-weight:700;
`;
const StyledTagList = styled.View`
    flex-wrap:wrap;
    flex-direction:row;
`;
const StyledTagBox = styled.TouchableOpacity`
    border-width:1px;
    border-color:#222;
    border-radius:50px;
    padding:0 5px 0 4px;  
    height:25px;
    margin-top: 10px;
    margin-right: 10px;
    justify-content:center;
`;
const StyledTagText = styled.Text`
    line-height:19px;
`;
const StyledTextArea = styled.TextInput`
    border-width:1px;
    border-color:#E9E9E9;
    border-radius:5px;
    height:100px;
    padding: 10px;
    text-align-vertical:top;
`;
const StyledTextCnt = styled.Text`
    position:absolute;
    bottom:0;
    right:0;
    color:#555;
    font-size:13px;
`;
const StyledPhotoRow = styled.View`
    flex-direction:row;
`;
const StyledPhotoBox = styled.View`
    border-color:#E9E9E9;
    aspect-ratio:1;
    border-width:1px;
    border-radius:5px;
`;
const StyledPhotoUploadButton = styled.TouchableOpacity`
    height:100%;
    width:100%;
    align-items:center;
    justify-content:center;
`;
const StyledImageDelete = styled.TouchableOpacity`
    position:absolute;
    top:-5px;
    right:-5px;
`;