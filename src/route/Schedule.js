//------------------------------ MODULE --------------------------------
import { Text} from 'react-native';
import { CalendarView } from '@/component';
import styled from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';
import { useState, useMemo, useLayoutEffect, useRef } from 'react';
import { koreanDay } from '@/data/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useReservation } from '@/hooks';
import { numberToTime } from '@/lib';
import { useNavigation } from '@react-navigation/native';
import { CustomInnerLoading } from '@/component';

//---------------------------- COMPONENT -------------------------------
export default function Schedule(){
    //init
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    //ref
    const scrollViewRef = useRef(null);

    //data
    const [reservation, reservationUpdate] = useReservation(null, {'type':'reservation_date', 'col':'reservation_date,reservation_time'});

    //state
    const [chkDate, setChkDate] = useState(null); 

    //effect
    useLayoutEffect(() => {
        if(isFocused) reservationUpdate();
    }, [isFocused]);

    useLayoutEffect(() => {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }, [chkDate])

    //memo
    const calendarGear = useMemo(() => {
        return <CalendarView initDate = {new Date()} dateChange = {setChkDate} scheduleData = {reservation || []}/>;
    }, [reservation]);

    const listGear = useMemo(() => {
        if(!chkDate || !reservation) return <StyledEmptyMessage>예약 데이터가 존재하지 않습니다</StyledEmptyMessage>;
        const now = new Date(chkDate);
        const date = now.getDate();
        const day = now.getDay();
        return (
            <>
            <StyledDateView>
                <StyledDateText>{date}.</StyledDateText>
                <StyledDayText> {koreanDay[day]}</StyledDayText>
            </StyledDateView>
            <StyledListBar/>
            <StyledListView>
                {
                    (chkDate in reservation) ? 
                    (
                        reservation[chkDate].map((item, index) => {
                            const from = numberToTime(item.reservation_time);
                            const until = numberToTime(Number(item.reservation_time) + Number(item.reservation_period));
                            const cancelFlag = item.reservation_stt == 3;
                            return (
                                <StyledListItem key={index}>
                                    <StyledItemName>
                                        <Text>{item.store_name}</Text>
                                    </StyledItemName>
                                    <StyledItemLocation>
                                        <Text>{item.store_addr}</Text>
                                    </StyledItemLocation>
                                    <StyledItemTime>
                                        <StyledTimeIcon name="clock-time-four-outline"/><Text> {from} - {until}</Text>
                                    </StyledItemTime>
                                    <StyledItemDesc onPress={() => navigation.navigate('예약상세', {id:item.reservation_idx})} style={cancelFlag ? {borderColor:'#888'} : null}>
                                        <StyledItemDescText style={cancelFlag ? {color:'#888'} : null} >
                                            {cancelFlag ? '취소완료' : '상세보기'}
                                        </StyledItemDescText>
                                    </StyledItemDesc>
                                </StyledListItem>
                            )
                        })
                    ) : <StyledListItem><StyledItemMsg>예약 내역이 존재하지 않습니다.</StyledItemMsg></StyledListItem>
                }
            </StyledListView>  
            </>
        );
    }, [chkDate, reservation/* refresh list data everytime reservation is updated */]);    

    //render
    return(
        <StyledConatainer>
            <CustomInnerLoading delay={1000} paddingTop="70%"/>
            <StyledCalendarSection>
                {calendarGear}
            </StyledCalendarSection>
            <StyledListSection ref={scrollViewRef}>
                {listGear}
            </StyledListSection>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex: 1;
    background:white;
`;
const StyledCalendarSection = styled.View`
`;
const StyledListSection = styled.ScrollView`
`;
const StyledDateView = styled.View`
    margin:15px 0 0 20px;
    flex-direction:row;
    align-items:baseline;
`;
const StyledDateText = styled.Text`
    font-size:20px;
    font-weight:500;
`;
const StyledDayText = styled.Text`
    font-size:15px;
    color:#7D7D7D;
`;
const StyledListBar = styled.View`
    position:absolute;
    width:1.5px;
    height:3000px;
    border-color: #999;
    border-left-width: 1.5px;
    left:32px;
    top:50px;
`;
const StyledListView = styled.View`
    //border-color: #999;
    //border-left-width: 1.5px;
    margin:10px 0px 0px 30px;
    padding: 2px 20px;
`;
const StyledListItem = styled.View`
    margin:10px 0px;
    border-color: #ddd;
    border-width: 1.5px;
    border-radius: 8px;
    padding:10px;
    position:relative;
    height:110px;
`;
const StyledItemName = styled.Text`
    font-size:20px;
    font-weight:600;
    height:27px;
`;
const StyledItemLocation = styled.Text`
    color:#7D7D7D;
    height:40px;
    width:170px;
`;
const StyledItemTime = styled.Text`
    font-weight:300;
`;
const StyledTimeIcon = styled(Icon)`
    font-size:15px;
`;
const StyledItemMsg = styled.Text`
    font-size:16px;
    color:#bbb;
`;
const StyledItemDesc = styled.TouchableOpacity`
    position:absolute;
    bottom: 10px;
    right: 10px;
    padding: 15px 25px;
    border-color: #F33562;
    border-width: 1.5px;
    border-radius: 50px;
`;
const StyledItemDescText = styled.Text`
    color:#F33562;
    font-size:15px;
    font-weight:600;
`;
const StyledEmptyMessage = styled.Text`
    text-align:center;
    font-size:16px;
    color:#bbb;
    padding:50px;
`;