//------------------------------ MODULE --------------------------------
import {LocaleConfig, Calendar} from 'react-native-calendars';
import { useState, useLayoutEffect } from 'react';
import {timeToText} from '@/lib'
import styled from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';
import { under_balloon } from '@/assets/img';
import FastImage from 'react-native-fast-image';

//------------------------------ SETTING --------------------------------
LocaleConfig.locales['kr'] = {
    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    monthNamesShort: ['1월.', '2월.', '3월', '4월', '5월', '6월', '7월.', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    today: "오늘"
};
LocaleConfig.defaultLocale = 'kr';

//---------------------------- COMPONENT -------------------------------
export default function CalendarView({ initDate = null, dateChange = () => {}, scheduleData = [] }){
    //init
    const isFocused = useIsFocused();
    const monthRange = 3;

    //state
    const [selected, setSelected] = useState(null);
    const [dayset, setDayset] = useState(null);

    //function
    const init = () => {
        try{
            const currentDate = initDate ? initDate : new Date();

            const threeMonthsEarlier = new Date();
            threeMonthsEarlier.setMonth(currentDate.getMonth() - monthRange);
        
            const threeMonthsLater = new Date();
            threeMonthsLater.setMonth(currentDate.getMonth() + monthRange);
        
            setDayset({
                td : currentDate,
                sd : threeMonthsEarlier,
                ed : threeMonthsLater
            });
            setSelected(selected || timeToText(currentDate, 'y-mm-dd'));
            dateChange(selected || timeToText(currentDate, 'y-mm-dd'));
        }catch(e){
            console.log(e);
            setDayset({
                td : null,
                sd : null,
                ed : null
            });
        }
    }

    const bubbleCount = (cnt) => {
        return (
            <StyledBubbleView>
                <StyledBubbleImage source={under_balloon} resizeMode='contain'>
                    <StyledBubbleText>+{cnt}</StyledBubbleText>
                </StyledBubbleImage>
            </StyledBubbleView>
        )
    }

    const markDate = () => {
        try{            
            //day1 and saturday css exception
            const extraChk = (new Date(selected).getDate() == 1 && new Date(selected).getDay() == 5);

            //selectedStyle
            const selectedStyle = {
                backgroundColor: 'white',
                borderColor: 'red',
                borderWidth: 1,
                margin: extraChk ? 1 : -1,
                width:30,
                height:30,
                top: extraChk ? -2 : 0,
            };

            //selected
            const selectedObj = {
                [selected]: {
                    selected: true, 
                    disableTouchEvent: true, 
                    customStyles: {
                        container: selectedStyle,
                        text : {color: '#2d4150'}
                    },
                }
            };

            //sunday
            const sundayObj = {};
            let targetDate = new Date(dayset.sd);
            const endDate = new Date(dayset.ed);
            while (targetDate <= endDate) {
                const dateString = targetDate.toISOString().split('T')[0];
                if (targetDate.getDay() === 0) {
                    sundayObj[dateString] = { 
                        customStyles: {
                            container : dateString == selected ? selectedStyle : null,
                            text : { color:'red' }
                        } 
                    };
                    targetDate.setDate(targetDate.getDate() + 6);
                }
                targetDate.setDate(targetDate.getDate() + 1);
            }

            //markedDay
            const markedObj = {...scheduleData};
            for(let key in markedObj){
                markedObj[key] = {                    
                    customStyles: {
                        container: key == selected ? selectedStyle : {
                            backgroundColor: 'white',
                            borderColor: 'transparent',
                            borderWidth: 1,
                            margin: extraChk ? 1 : -1,
                            width:30,
                            height:30,
                            top: extraChk ? -2 : 0,
                        },
                        text : { color: new Date(key).getDay() === 0 ? 'red' : '#2d4150'},
                        underView: () => bubbleCount(scheduleData[key].length) //to use this option, customized "renderUnder()" function inside "react-native-calendars/src/calendar/day/basic/index.js"
                    },
                }
            }

            return ({...selectedObj, ...sundayObj, ...markedObj }); //order is important!
        }catch(e){
            console.log(e);
            return Object();
        }
    }

    //effect
    useLayoutEffect(() => {
        //if(isFocused) init(); //everytime init(dayset, selected refresh) when focused
        init(); 
    }, [/*isFocused*/]);

    //render
    return dayset ? (
        <Calendar
            style={{
                borderWidth:0.5,
                borderColor: '#eee',
                padding:5,
                paddingTop:10,
            }}
            theme={{
                'stylesheet.calendar.main': {
                    week: {
                        marginTop: 5,
                        marginBottom: 17,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    },
                },
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                todayTextColor: '#2d4150',
                dayTextColor: '#2d4150',
                textDisabledColor: '#eee',
                textDayFontSize: 15,
                textDayFontWeight: '500',
                arrowColor: '#F33562',
                textMonthFontSize: 18,
                textMonthFontWeight: '500',
            }}
            current={timeToText(dayset.td, 'y-mm-dd')}
            minDate={timeToText(dayset.sd, 'y-mm-dd')}
            maxDate={timeToText(dayset.ed, 'y-mm-dd')}
            monthFormat={'M월'} 
            onDayPress={day => {
                setSelected(day.dateString);
                dateChange(day.dateString);
            }}
            onMonthChange={day => {
                /*  //set first date when month changed
                const firstDate = `${day.year}-${day.month < 10 ? '0'+day.month : day.month}-01`;
                setSelected(firstDate);
                dateChange(firstDate);
                */
            }}
            markingType={'custom'}
            markedDates={markDate()}
            hideExtraDays={true}
        />
    ) : null;
}

//------------------------------- STYLE --------------------------------
const StyledBubbleView = styled.TouchableOpacity`
    right:8px;
`;
const StyledBubbleImage = styled(FastImage)`
    width:22px;
    height:18px;
    position:absolute;
    left:-3px;
    top:-2px;
    align-items:center;
    justify-content:center;
`;
const StyledBubbleText = styled.Text`
    font-size:10px;
    color:white;
    top:1.8px;
`;
