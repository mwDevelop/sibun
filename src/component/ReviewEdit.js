//------------------------------ MODULE --------------------------------
import { useLayoutEffect, useState, useMemo } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { numberToTime, uniquePush } from '@/lib';
import {StarScore} from '@/component';
import {reviewScoreOption, reviewTagOption} from '@/data/constants';
import ImagePicker from 'react-native-image-crop-picker';

//---------------------------- COMPONENT -------------------------------
export default function ReviewEdit({type='add', reservationData=null, reviewData=null}){
    //state
    const [score, setScore] = useState(reviewData?.test || 1);
    const [tags, setTags] = useState([]);
    const [text, setText] = useState('');

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
                    <StyledScoreText>{reviewScoreOption[score]['title']}!</StyledScoreText>
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
                <StyledTextArea multiline={true} numberOfLines = {4} onChangeText={(t) => setText(t)} value={text} placeholder="매장을 이용하면서 느꼈던 점을 리뷰로 남겨주세요."/>
            </StyledSection>
        )
    }, [text]);

    const photoGear = useMemo(() => {
        return (
            <StyledSection style={{paddingTop:0}}>
                <StyledSectionTitle>사진 업로드</StyledSectionTitle>
            </StyledSection>
        )
    }, []);

    const submitGear = useMemo(() => {
        return (
            <StyledSubmit>
                {
                    type=='add' ? (
                        <StyledSubmitButton>작성 완료</StyledSubmitButton>
                    ) : (
                        <>
                        <StyledSubmitButton>취소</StyledSubmitButton>
                        <StyledSubmitButton>수정 완료</StyledSubmitButton>
                        </>
                    )
                }
            </StyledSubmit>
        );
    }, [type]);

    //effect
    useLayoutEffect(() => {
        console.log(reservationData);
    });

    useLayoutEffect(() => {
        console.log(score);
    }, [score]);

    useLayoutEffect(() => {
        console.log(tags);
    }, [tags]);

    //render
    return (
        <StyledConatainer>
            {infoGear}
            {scoreGear}
            {tagGear}
            {textGear}
            {photoGear}
            {submitGear}
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
    background:yellow;
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
    padding:5px 8px 4px 8px;  
    margin-top: 10px;
    margin-right: 10px;
`;
const StyledTagText = styled.Text`
`;
const StyledTextArea = styled.TextInput`
    border-width:1px;
    border-color:#E9E9E9;
    height:100px;
    padding: 10px;
`;