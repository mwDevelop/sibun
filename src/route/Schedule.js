//------------------------------ MODULE --------------------------------
import { StyleSheet, Text, View } from 'react-native';
import { CalendarView } from '@/component';
import { timeToText } from '@/lib';
import styled from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';
import { useState, useMemo, useEffect, useRef } from 'react';
import { koreanDay } from '@/data/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//---------------------------- COMPONENT -------------------------------
export default function Schedule(){
    //init
    const isFocused = useIsFocused();

    //ref
    const scrollViewRef = useRef(null);

    //state
    const [schedule, setSchedule] = useState([]);
    const [chkDate, setChkDate] = useState(null);

    //function
    const init = () => {
        try{
            const testData = {
                "2023-06-23":[
                    {
                        "name" : "버디스크린골프존",
                        "location" : "서울특별시 송파구 오금동 2",
                        "time" : "13:00 - 14:00"
                    },
                    {
                        "name" : "G골프스튜디오",
                        "location" : "서울 송파구 오금로 31길 19 지하 1층",
                        "time" : "16:00 - 17:30"
                    },
                    {
                        "name" : "JD골프아카데미",
                        "location" : "서울 송파구 오금로 31길 11 B1",
                        "time" : "18:00 - 19:00"
                    },          
                    {
                        "name" : "G골프스튜디오",
                        "location" : "서울 송파구 오금로 31길 19 지하 1층",
                        "time" : "15:30 - 17:30"
                    },                                          
                    {
                        "name" : "G골프스튜디오",
                        "location" : "서울 송파구 오금로 31길 19 지하 1층",
                        "time" : "15:30 - 17:30"
                    },                            
                ],
                "2023-06-25":[
                    {
                        "name" : "양재 스크린 골프장",
                        "location" : "2-desc1",
                        "time" : "10:00 - 13:00"
                    },
                    {
                        "name" : "JD골프아카데미",
                        "location" : "서울 송파구 오금로 31길 11 B1",
                        "time" : "14:00 - 15:00"
                    },
                    {
                        "name" : "G골프스튜디오",
                        "location" : "서울 송파구 오금로 31길 19 지하 1층",
                        "time" : "15:30 - 17:30"
                    },              
                    {
                        "name" : "G골프스튜디오",
                        "location" : "서울 송파구 오금로 31길 19 지하 1층",
                        "time" : "15:30 - 17:30"
                    },                                      
                ],
                "2023-06-30":[
                    {
                        "name" : "JD골프아카데미",
                        "location" : "서울 송파구 오금로 31길 11 B1",
                        "time" : "09:30 - 10:30"
                    },
                    {
                        "name" : "버디스크린골프존",
                        "location" : "서울특별시 송파구 오금동 2",
                        "time" : "11:00 - 12:30"
                    },
                    {
                        "name" : "G골프스튜디오",
                        "location" : "서울 송파구 오금로 31길 19 지하 1층",
                        "time" : "15:30 - 17:30"
                    },                        
                ],                
                "2023-07-01":[
                    {
                        "name" : "JD골프아카데미",
                        "location" : "서울 송파구 오금로 31길 11 B1",
                        "time" : "09:30 - 10:30"
                    },
                    {
                        "name" : "버디스크린골프존",
                        "location" : "서울특별시 송파구 오금동 2",
                        "time" : "11:00 - 12:30"
                    },
                    {
                        "name" : "G골프스튜디오",
                        "location" : "서울 송파구 오금로 31길 19 지하 1층",
                        "time" : "15:30 - 17:30"
                    },                        
                ],
                "2023-07-05":[
                    {
                        "name" : "JD골프아카데미",
                        "location" : "서울 송파구 오금로 31길 11 B1",
                        "time" : "09:30 - 10:30"
                    },
                    {
                        "name" : "버디스크린골프존",
                        "location" : "서울특별시 송파구 오금동 2",
                        "time" : "11:00 - 12:30"
                    },
                    {
                        "name" : "G골프스튜디오",
                        "location" : "서울 송파구 오금로 31길 19 지하 1층",
                        "time" : "15:30 - 17:30"
                    },                        
                ],                
                "2023-09-02":[
                    {
                        "name" : "JD골프아카데미",
                        "location" : "서울 송파구 오금로 31길 11 B1",
                        "time" : "09:30 - 10:30"
                    },
                    {
                        "name" : "버디스크린골프존",
                        "location" : "서울특별시 송파구 오금동 2",
                        "time" : "11:00 - 12:30"
                    },
                    {
                        "name" : "G골프스튜디오",
                        "location" : "서울 송파구 오금로 31길 19 지하 1층",
                        "time" : "15:30 - 17:30"
                    },                        
                ],                    
                "2023-08-18":[
                    {
                        "name" : "JD골프아카데미",
                        "location" : "서울 송파구 오금로 31길 11 B1",
                        "time" : "09:30 - 10:30"
                    },
                    {
                        "name" : "버디스크린골프존",
                        "location" : "서울특별시 송파구 오금동 2",
                        "time" : "11:00 - 12:30"
                    },
                    {
                        "name" : "G골프스튜디오",
                        "location" : "서울 송파구 오금로 31길 19 지하 1층",
                        "time" : "15:30 - 17:30"
                    },                        
                ],                                    
                "2023-08-25":[
                    {
                        "name" : "JD골프아카데미",
                        "location" : "서울 송파구 오금로 31길 11 B1",
                        "time" : "09:30 - 10:30"
                    },
                    {
                        "name" : "버디스크린골프존",
                        "location" : "서울특별시 송파구 오금동 2",
                        "time" : "11:00 - 12:30"
                    },
                    {
                        "name" : "G골프스튜디오",
                        "location" : "서울 송파구 오금로 31길 19 지하 1층",
                        "time" : "15:30 - 17:30"
                    },                        
                ],                   
                "2023-08-13":[
                    {
                        "name" : "JD골프아카데미",
                        "location" : "서울 송파구 오금로 31길 11 B1",
                        "time" : "09:30 - 10:30"
                    },
                    {
                        "name" : "버디스크린골프존",
                        "location" : "서울특별시 송파구 오금동 2",
                        "time" : "11:00 - 12:30"
                    },
                    {
                        "name" : "G골프스튜디오",
                        "location" : "서울 송파구 오금로 31길 19 지하 1층",
                        "time" : "15:30 - 17:30"
                    },                        
                ],                                        
            }        
            setSchedule(testData || []);
        }catch(e){
            setSchedule([]);   
        }
    }

    //effect
    useEffect(() => {
        if(isFocused){
            init();
        } 
    }, [isFocused]);

    useEffect(() => {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }, [chkDate])

    //memo
    const calendarGear = useMemo(() => {
        return <CalendarView initDate = {new Date()} dateChange = {setChkDate} scheduleData = {schedule}/>;
    }, [schedule]);

    const listGear = useMemo(() => {
        if(!chkDate) return null;

        const now = new Date(chkDate);
        const date = now.getDate();
        const day = now.getDay();
        return (
            <>
            <StyledDateView>
                <StyledDateText>{date}.</StyledDateText>
                <StyledDayText> {koreanDay[day]}</StyledDayText>
            </StyledDateView>
                <StyledListView>
                    {
                        (chkDate in schedule) ? 
                        (
                            schedule[chkDate].map((item, index) => (
                                <StyledListItem key={index}>
                                    <StyledItemName>
                                        <Text>{item.name}</Text>
                                    </StyledItemName>
                                    <StyledItemLocation>
                                        <Text>{item.location}</Text>
                                    </StyledItemLocation>
                                    <StyledItemTime>
                                        <StyledTimeIcon name="clock-time-four-outline"/><Text> {item.time}</Text>
                                    </StyledItemTime>
                                    <StyledItemDesc>
                                        <StyledItemDescText>상세보기</StyledItemDescText>
                                    </StyledItemDesc>
                                </StyledListItem>
                            ))
                        ) : <StyledListItem><StyledItemMsg>예약 내역이 존재하지 않습니다.</StyledItemMsg></StyledListItem>
                    }
                </StyledListView>  
            </>
        );
    }, [chkDate, schedule/* refresh list data everytime schedule is updated */]);    

    //render
    return(
        <StyledConatainer>
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
const StyledListView = styled.View`
    border-color: #999;
    border-left-width: 1.5px;
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
    padding:15px 25px;
    border-color: #F33562;
    border-width: 1.5px;
    border-radius: 50px;
`;
const StyledItemDescText = styled.Text`
    color:#F33562;
    font-size:15px;
    font-weight:600;
`;