//------------------------------ MODULE --------------------------------
import { useLayoutEffect } from 'react';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { useReservation } from '@/hooks';
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { onerror } from '@/assets/img';

//---------------------------- COMPONENT -------------------------------
export default function ReviewAddible(){
    //init
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    //data
    const [reservation, reservationUpdate] = useReservation(null, {'reservation_stt':'5', 'reservation_review_yn':'n', 'col':'reservation_date,reservation_time'});

    //effcet
    useLayoutEffect(() => {
        if(isFocused) reservationUpdate();
    }, [isFocused]);

    //render
    return reservation ? (
        <StyledConatainer>
            {
                reservation?.length ? reservation.map((d, i) => (
                    <StyledItem key={i}>
                        <StyledItemHeader>
                            <StyledItemDate>{d.reservation_date.substr(2).replaceAll('-','.')}</StyledItemDate>
                            <StyledHeaderButton>
                                <StyledHeaderButtonText onPress={() => navigation.navigate('예약상세', {id:d.reservation_idx})}>예약 상세보기</StyledHeaderButtonText>
                                <Icon name="chevron-forward-outline" size={14}/>
                            </StyledHeaderButton>
                        </StyledItemHeader>
                        <StyledItemContent>
                            <StyledItemImageArea>
                                <StyledItemImage source={d.store_main_simg ? {uri:d.store_main_simg} : onerror} defaultSource={onerror} resizeMode="contain"/>
                            </StyledItemImageArea>
                            <StyledItemInfo>
                                <StyledItemName>{d.store_name}</StyledItemName>
                                <StyledItemAddr>{d.store_addr}</StyledItemAddr>
                            </StyledItemInfo>
                        </StyledItemContent>
                        <StyledItemFooter>
                            <StyledItemAddButton suppressHighlighting={true} onPress={() => navigation.navigate('리뷰작성' ,{reservationData: d})}>리뷰 작성하기</StyledItemAddButton>
                        </StyledItemFooter>
                    </StyledItem>
                )) : <StyledEmptyText>작성하실 리뷰 건이 존재하지 않습니다.</StyledEmptyText>
            }
        </StyledConatainer>
    ) : null;
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
const StyledItemContent = styled.View`
    padding:10px 20px;
    flex-direction:row;
    align-items:center;
`;
const StyledItemImageArea = styled.View`
    background-color:#fff;
    border-radius:5px;
    shadow-color: black; 
    shadow-offset: 3px;
    shadow-opacity: 0.3;
    elevation:1;
`;
const StyledItemImage = styled(FastImage)`
    height:60px;
    width:60px;
    background:#E9E9E9;
    border-radius:5px;
`;
const StyledItemInfo = styled.View`
    margin-left:10px;  
`;
const StyledItemName = styled.Text`
    margin-bottom:5px;
    font-size:14px;
    font-weight:700;
    color:#222;
`;
const StyledItemAddr = styled.Text`
    color:#444;
    font-size:12px;
    font-weight:400;
`;
const StyledItemFooter = styled.View`
    padding:10px;
    padding-top:5px;
`;
const StyledItemAddButton = styled.Text`
    background:#F33562;
    color:#fff;
    border-radius:5px;
    overflow:hidden;
    text-align:center;
    padding:5px;
    font-size:14px;
    font-weight:500;
`;
const StyledEmptyText = styled.Text`
    margin-top:50px;
    align-self:center;
    color:#222;
`;
