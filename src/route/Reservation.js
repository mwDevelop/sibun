//------------------------------ MODULE --------------------------------
import { useLayoutEffect, useMemo, useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components/native';
import { useStore, useUser} from '@/hooks';
import { CheckBox, CouponSlide } from '@/component';
import { apiCall, mobileMask, numberFilter, numberToTime, timeToNumber, timeToText, textCut } from '@/lib';
import { koreanDay, globalMsg } from '@/data/constants';
import AwesomeAlert from 'react-native-awesome-alerts';
import { alertDefaultSetting } from '@/data/constants';
import { useReservationMutate } from '@/hooks';

//---------------------------- COMPONENT -------------------------------
export default function Reservation({route}){
    //init
    const storeIdx = route?.params?.id;
    const cellphoneRef = useRef(); 
    const timeTable = [2,3,4]; // 1 for 60min 
    const reservationMutation = useReservationMutate();

    //data
    const [store] = useStore(storeIdx);
    const [user] = useUser();

    //state
    const [datePicked, setDatePicked] = useState(() => {
        const holidays = store?.store_closed_days.split(',').map((d, i) => d==7 ? 0 : Number(d));
        if(holidays?.length > 6) return null; //case everyday disabled
        let td = new Date();
        while(holidays.includes(td.getDay())) td.setDate(td.getDate()+1);
        return td;
    });
    const [timePicked, setTimePicked] = useState(null);
    const [usingTimePicked, setUsingTimePicked] = useState(null);
    const [roomPicked, setRoomPicked] = useState(null);
    const [couponPicked, setCouponPicked] = useState(null);
    const [dateStatus, setDateStatus] = useState(null);
    const [room, setRoom] = useState(null);
    const [coupon, setCoupon] = useState(null);
    const [terms, setTerms] = useState([
        {title: "선톡 이용약관", desc:"terms1", required:true, selected:false},
        {title: "개인(신용)정보 이용", desc:"terms2", required:true, selected:false},
        {title: "선톡 서비스 이용약관", desc:"terms3", required:false, selected:false},
    ]);
    const [cellphone, setCellphone] = useState(user?.mb_cellphone);
    const [cellphoneEdit, setCellphoneEdit] = useState(false);
    const [requestText, setRequestText] = useState('');
    const [alert, setAlert] = useState('');
    const [confirm, setConfirm] = useState('');

    //function
    const onEditClick = (letters) => {
        if(letters.length < 10){
            cellphoneRef.current.focus();
            return setAlert(globalMsg['invalidPhone']);
        }
        setCellphoneEdit(!cellphoneEdit);
    }

    const callRoom = () => {
        apiCall.get(`/store/${storeIdx}/room`)
            .then((res) => {
                if(res.data.result == "000") setRoom(res?.data?.list);
            });
    }

    const callDateStatus = useCallback(() => {
        const params = { reservation_date:timeToText(datePicked, 'y-mm-dd')};
        apiCall.get(`/store/${storeIdx}/reservation`, {params})
            .then((res) => {
                if(res.data.result == "000") setDateStatus(res?.data?.list);
            });
    }, [datePicked]);

    const callCoupon = useCallback(() => {
        const params = {};
        if(datePicked) {
            const dayId = datePicked.getDay() == 0 ? "7" : String(datePicked.getDay());
            params.store_voucher_date = timeToText(datePicked, 'y-mm-dd');
            params.store_voucher_available_days = dayId;
        }             
        if(timePicked) params.store_voucher_time = String(timePicked);
        apiCall.get(`/store/${storeIdx}/voucher`, {params})
            .then((res) => {
                if(res.data.result == "000") setCoupon(res?.data?.list);
                else{setCoupon(null)}
            });
    }, [datePicked, timePicked]);

    const submitChk = () => {
        //data chk...
        if(!datePicked) return setAlert(globalMsg['isNotSelectedDate']);
        if(!timePicked) return setAlert(globalMsg['isNotSelectedTime']);
        if(!usingTimePicked) return setAlert(globalMsg['isNotSelectedUsing']);
        if(!roomPicked) return setAlert(globalMsg['isNotSelectedRoom']);
        if(!cellphone || cellphone.length<11) return setAlert(globalMsg['invalidPhone']);
        terms.forEach((d) => {
            if(d.required && !d.selected) return setAlert(globalMsg['selectRequired']);
        })
        
        //coupon chk...
        let couponText = "없음";
        if(couponPicked && coupon?.length){
            couponText = coupon.find((obj) => obj.store_voucher_idx == couponPicked)['store_voucher_title'];
        }

        //set confirm open
        return setConfirm(`날짜 :    ${timeToText(datePicked, 'y-mm-dd')}\n시간 :    ${numberToTime(timePicked)}~${numberToTime(timePicked+usingTimePicked)}\n쿠폰 :    ${couponText}`);
    };

    const save = () => {
        let params = { 
            reservation_user_name: user.mb_name,
            reservation_user_cellphone: cellphone,
            reservation_store_idx: storeIdx,
            reservation_room_idx: roomPicked,
            reservation_voucher_idx: couponPicked,
            reservation_date: datePicked,
            reservation_time: timePicked,
            reservation_period: usingTimePicked,
        };

        reservationMutation.mutate({type:"add", params:params}, {onSuccess: async(res) => {
            if(res.data.result == "000"){
            }else{
            }
        }});        
    };

    //memo
    const storeGear = useMemo(() => {
        return (
            <StyledSection>
                <StyledSectionTitle>매장 정보</StyledSectionTitle>
                <StyledStoreName>
                    {store.store_name}
                    <StyledStoreAddr>{"   "}{store.store_addr}</StyledStoreAddr>
                </StyledStoreName>
            </StyledSection>
        )
    }, [store]);
    
    const dateGear = useMemo(() => {
        const holidays = store?.store_closed_days.split(',').map((d, i) => d==7 ? 0 : Number(d));
        return (
            <StyledSubsection>
                <StyledSubsectionTitle>날짜</StyledSubsectionTitle>
                <StyledSubsectionContent>
                    <StyledSubsectionDateList horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                            Array.from({ length: 20 }, (v, i) => {
                                const td = new Date();
                                td.setDate(td.getDate()+i);
                                const dayId = td.getDay();
                                const tdChk = datePicked?.getDate() == td.getDate();
                                const holidayChk = holidays.includes(dayId);
                                const status = tdChk ? 'picked' : (!holidayChk ? 'able' : 'unable');
                                return (
                                    <StyledSubsectionDateItem 
                                        key={i}
                                        status={status}
                                        onPress={() => holidayChk ? null : setDatePicked(td)}
                                        suppressHighlighting={true}
                                    >
                                        {td.getMonth()+1}/{td.getDate()}({koreanDay[dayId]})
                                    </StyledSubsectionDateItem>
                                );
                            })
                        }
                    </StyledSubsectionDateList>
                </StyledSubsectionContent>
            </StyledSubsection>            
        );
    }, [store, datePicked]);

    const timeGear = useMemo(() => {
        const now = new Date();
        const openTime = store.store_open_time;
        const closeTime = store.store_close_time;
        const spreadLength = (closeTime+1-openTime/* +1 to show exact close time as block */)-Math.min(...timeTable) /* the last block selected must be time before minimum using time until close*/;
        const passedTimeChk = now.getDate()==datePicked?.getDate() ? timeToNumber(now) : null;
        return (
            <StyledSubsection>
                <StyledSubsectionTitle>방문시간</StyledSubsectionTitle>
                <StyledSubsectionComment>*예약가능한 시간만 표시합니다.</StyledSubsectionComment>
                <StyledSubsectionContent>
                    <StyledSubsectionBlockList>
                        {
                            Array.from({ length: spreadLength }, (v, i) => {
                                const item = openTime+i;
                                const pickChk = timePicked == item;
                                const ableChk = !passedTimeChk || passedTimeChk <= item;
                                const status = pickChk ? 'picked' : (ableChk ? 'able' : 'unable');
                                return (
                                    <StyledSubsectionBlockItem 
                                        style={{width:'25%'}}
                                        key={i} 
                                        front={i%4==0}
                                        rear={(i-3)%4==0 || i==spreadLength-1}
                                        activeOpacity={1}
                                        status={status}
                                        onPress={() => status=='able'?setTimePicked(item) : null}
                                    >
                                        <StyledSubsectionBlockItemText status={status}>
                                            {numberToTime(item)}
                                        </StyledSubsectionBlockItemText>
                                    </StyledSubsectionBlockItem>
                                );
                            })
                        }
                    </StyledSubsectionBlockList>                        
                </StyledSubsectionContent>                    
            </StyledSubsection>            
        )
    }, [datePicked, timePicked, store]);
    
    const couponGear = useMemo(() => {
        return (
            <StyledSubsection>
                <StyledSubsectionTitle>쿠폰선택</StyledSubsectionTitle>
                <StyledSubsectionComment>*날짜 및 시간에 따라 사용 가능한 쿠폰만 표시합니다.</StyledSubsectionComment>
                <StyledSubsectionContent>
                    <CouponSlide couponList = {coupon} pick={setCouponPicked} pickedId={couponPicked}/>
                </StyledSubsectionContent>
            </StyledSubsection>            
        )
    }, [coupon, couponPicked]);

    const usingTimeGear = useMemo(() => {
        const closeTime = store.store_close_time;
        const leftTime = closeTime-timePicked;

        return (
            <StyledSubsection>
                <StyledSubsectionTitle>이용시간</StyledSubsectionTitle>
                <StyledSubsectionComment>*60분부터 예약가능합니다.</StyledSubsectionComment>
                <StyledSubsectionContent>
                    <StyledSubsectionBlockList>
                        {
                            timeTable.map((v, i) => {
                                const pickChk = usingTimePicked == v; 
                                const ableChk = timePicked && leftTime >= v;
                                const status = pickChk ? 'picked' : (ableChk ? 'able' : 'unable');
                                return(
                                    <StyledSubsectionBlockItem 
                                        style={{width:'20%'}}
                                        key={i} 
                                        front={i==0}
                                        rear={i==timeTable.length-1}
                                        activeOpacity={1}
                                        status={status}
                                        onPress={() => status=='able'?setUsingTimePicked(v) : null}
                                    >
                                        <StyledSubsectionBlockItemText status={status}>
                                            {v*30}분
                                        </StyledSubsectionBlockItemText>
                                    </StyledSubsectionBlockItem>
                                )
                            })
                        }
                    </StyledSubsectionBlockList>
                </StyledSubsectionContent>                    
            </StyledSubsection>            
        )
    }, [store, timePicked, usingTimePicked]);
    
    const roomGear = useMemo(() => {
        return !room ? null : (
            <StyledSubsection>
                <StyledSubsectionTitle>방선택</StyledSubsectionTitle>
                <StyledSubsectionComment>*방번호는 임의로 신청한 번호로 실제 번호와 다를 수 있습니다.</StyledSubsectionComment>
                <StyledSubsectionContent>
                    <StyledSubsectionBlockList>
                    {
                        room.map((v, i) => {
                            const pickChk = roomPicked == v.store_room_idx; 
                            const ableChk = usingTimePicked;
                            const status = pickChk ? 'picked' : (ableChk ? 'able' : 'unable');
                            return (
                                <StyledSubsectionBlockItem 
                                    style={{width:'20%'}}
                                    key={i} 
                                    front={i%5==0}
                                    rear={(i+1)%5==0 || i==room.length-1}
                                    activeOpacity={1}
                                    status={status}
                                    onPress={() => status=='able'?setRoomPicked(v.store_room_idx) : null}
                                >
                                    <StyledSubsectionBlockItemText status={status} style={{fontSize:12, height:20}}>
                                        {textCut(v.store_room_name, 5)}
                                    </StyledSubsectionBlockItemText>
                                    <StyledRoomStatus status={status} style={{fontSize:12}}>
                                        {status == 'unable' ? '예약중' : '예약가능'}
                                    </StyledRoomStatus>
                                </StyledSubsectionBlockItem>                                
                            )
                        })
                    }
                    </StyledSubsectionBlockList>
                </StyledSubsectionContent>                    
            </StyledSubsection>            
        );
    }, [usingTimePicked, roomPicked, room]);

    const guestGear = useMemo(() => {
        return(
            <StyledSection style={{borderBottomWidth:0}}>
                <StyledSectionTitle>예약자 정보</StyledSectionTitle>
                <StyledGuestRow>
                    <StyledGuestLabel>이름</StyledGuestLabel>
                    <StyledGuestInfo>{user?.mb_name}</StyledGuestInfo>
                    <StyledGuestButton></StyledGuestButton>
                </StyledGuestRow>
                <StyledGuestRow>
                    <StyledGuestLabel>연락처</StyledGuestLabel>
                    {
                        cellphoneEdit ? 
                        <StyledGuestPhoneEdit 
                            ref={cellphoneRef}
                            maxLength={13} 
                            returnKeyType={'done'} 
                            keyboardType='numeric' 
                            value={mobileMask(cellphone)} 
                            onChangeText={(text) => setCellphone(numberFilter(text))}
                            onSubmitEditing = {() => onEditClick(cellphone)}
                        /> :
                        <StyledGuestInfo>{mobileMask(cellphone)}</StyledGuestInfo>
                    }
                    <StyledGuestButton onPress={() => onEditClick(cellphone)} suppressHighlighting={true}>{cellphoneEdit ? '저장' : '수정'}</StyledGuestButton>
                </StyledGuestRow>
            </StyledSection>
        )
    }, [user, cellphone, cellphoneEdit]);    

    const requestGear = useMemo(() => {
        return (
            <StyledSection style={{borderBottomWidth:0}}>
                <StyledSectionTitle>요청사항</StyledSectionTitle>
                <StyledRequestInput value={requestText} onChangeText={(text)=>setRequestText(text)} multiline = {true} placeholder="가게 사장님께 요청할 내용을 적어주세요."/>
            </StyledSection>
        );
    }, [requestText]);

    const termsGear = useMemo(() => {
        return (
            <StyledSection style={{borderBottomWidth:0}}>
                <StyledSectionTitle>약관 동의</StyledSectionTitle>
                <CheckBox list={terms} termsHandler={setTerms}/>
            </StyledSection>
        );
    }, terms);

    const submitGear = useMemo(() => {
        let activeChk = roomPicked ? true : false;
        terms.forEach((d) => {
            if(d.required && !d.selected) activeChk = false;
        });
        return <StyledSubmit suppressHighlighting={true} active={activeChk} onPress={activeChk ? submitChk : null}>예약하기</StyledSubmit>;
    }, [roomPicked, terms]);

    const alertGear = useMemo(() => (
        <AwesomeAlert
            {...alertDefaultSetting}
            showCancelButton={false}
            show={alert ? true : false}
            title={alert}
            confirmText="확인"
            onCancelPressed={() => {
                setAlert('');
            }}
            onConfirmPressed={() => setAlert('')}
            onDismiss={() => setAlert('')}
        />
    ), [alert]);

    const confirmGear = useMemo(() => (
        <AwesomeAlert
            {...alertDefaultSetting}
            show={confirm ? true : false}
            title='해당 내용으로 예약하시겠습니까?'
            message={confirm}
            confirmText="예약하기"
            onCancelPressed={() => {
                setConfirm('');
            }}
            onConfirmPressed={() => {
                setConfirm('');
                save();
            }}
            onDismiss={() => setConfirm('')}
        />
    ), [confirm]);    

    //effect
    useLayoutEffect(() => {
        callRoom();
    }, []);

    useLayoutEffect(() => {
        console.log("------- STORE STATUS --------");
        console.log(store);
        console.log("----------------------------");
    }, [store]);    

    useLayoutEffect(() => {
        if(!dateStatus) return;
        console.log("------- DATE STATUS --------");
        console.log(dateStatus);
        console.log("----------------------------");
    }, [dateStatus]);

    useLayoutEffect(() => {
        if(!coupon) return;
        console.log("------- COUPON STATUS --------");
        console.log(coupon);
        console.log("----------------------------");
    }, [coupon]);

    useLayoutEffect(() => {
        if(!room) return;
        console.log("------- ROOM STATUS --------");
        console.log(room);
        console.log("----------------------------");
    }, [room]);    

    useLayoutEffect(() => {
        if(!datePicked) return;
        //update
        callDateStatus();
        //refresh
        setTimePicked(null);
        setCoupon(null);
        setCouponPicked(null);
    }, [datePicked]);

    useLayoutEffect(() => {
        if(!timePicked) return;
        //update
        callCoupon();
        //refresh
        setCouponPicked(null);
        setUsingTimePicked(null);
    }, [timePicked]);    

    useLayoutEffect(() => {
        setRoomPicked(null);
    }, [usingTimePicked]);        

    useEffect(() => {
        if(cellphoneEdit && cellphoneRef.current) cellphoneRef.current.focus();
    }, [cellphoneEdit]);

    //render
    return (
        <>
        <StyledConatainer>
            {storeGear}
            <StyledSection>
                <StyledSectionTitle>예약 정보</StyledSectionTitle>
                {dateGear}
                {timeGear}
                {couponGear}
                {usingTimeGear}
                {roomGear}
            </StyledSection>
            {guestGear}
            {requestGear}
            {termsGear}
        </StyledConatainer>
        {submitGear}
        {alertGear}
        {confirmGear}
        </>
    )
}

//------------------------------- STYLE --------------------------------
const blockStatus = {
    "picked" : {
        "color" : "#F33562",
        "z" : "3",
        "bg" : "rgba(243, 53, 98, 0.1)"
    },
    "able" : {
        "color" : "#444",
        "z" : "2",
        "bg" : "#fff"
    },
    "unable" : {
        "color" : "#D7D7D7",
        "z" : "1",
        "bg" : "#fff"
    }
}

const StyledConatainer = styled.ScrollView`
    flex:1;
    background:#fff;
`;
const StyledSection = styled.View`
    background:#fff;
    border-bottom-width:7px;
    border-color:#E9E9E9;
    padding:15px 20px;
`;
const StyledSectionTitle = styled.Text`
    color:#222;
    font-size:18px;
    font-weight:600;
    padding-bottom:10px;
`;
const StyledStoreName = styled.Text`
    color:#444;
    font-weight:600;
`;
const StyledStoreAddr = styled.Text`
    color:#7D7D7D;
    font-size:12px;
    font-weight:400;
`;
const StyledGuestRow = styled.View`
    flex-direction:row;
    padding:5px 0;
`;
const StyledGuestLabel = styled.Text`
    flex:1;
    color:#7D7D7D;
    font-weight:600;
`;
const StyledGuestInfo = styled.Text`
    flex:1.5;
    color:#333;
    font-weight:500;
`;
const StyledGuestPhoneEdit = styled.TextInput`
    flex:1.5;
    color:#333;
    font-weight:500;
    background:#eee;
    border-radius:5px;
    padding:0 5px;
`;
const StyledGuestButton = styled.Text`
    flex:2;
    color:#486Cb1;
    font-weight:500;
    text-align:right;
`;
const StyledRequestInput = styled.TextInput`
    background:#F5F5F5;
    height:100px;
    padding:10px;
`;
const StyledSubmit = styled.Text`
    background:${(props) => props.active ? '#F33562' : '#aaa'};
    color:#fff;
    line-height:50px;
    text-align:center;
    font-size:16px;
    font-weight:600;
`;
const StyledSubsection = styled.View`
    margin: 10px 0;
`;
const StyledSubsectionTitle = styled.Text`
    color:#444;
    font-weight:600;
    font-size:16px;
    margin-bottom:5px;
`;
const StyledSubsectionComment = styled.Text`
    font-size:10px;
    font-weight:500;
    color:#aaa;
`;
const StyledSubsectionContent = styled.View`
`;
const StyledSubsectionDateList = styled.ScrollView`
    overflow:visible;
    margin: 5px 0;
`;
const StyledSubsectionDateItem = styled.Text`
    padding:10px 5px;
    text-align:center;
    color:${(props) => blockStatus[props.status].color};
    border-color:${(props) => blockStatus[props.status].color};
    z-index:${(props) => blockStatus[props.status].z};
    border-radius:5px;
    border-width:1px;
    margin-right:10px;
    font-weight:500;
`;
const StyledSubsectionBlockList = styled.View`
    flex-direction:row;
    width:100%;
    flex-wrap : wrap;
    margin-top:15px;
`;
const StyledSubsectionBlockItem = styled.TouchableOpacity`
    border-width:1px;
    border-color:${(props) => blockStatus[props.status].color};
    z-index:${(props) => blockStatus[props.status].z};
    background:${(props) => blockStatus[props.status].bg};
    padding:10px;
    margin-bottom:8px;
    margin-right:-1px;
    align-items:center;
    ${(props) => props.front ? 'border-top-left-radius:5px; border-bottom-left-radius:5px;' : null}
    ${(props) => props.rear ? 'border-top-right-radius:5px; border-bottom-right-radius:5px;border-right-width:1px;' : null}
`;
const StyledSubsectionBlockItemText = styled.Text`
    color:${(props) => blockStatus[props.status].color};
`;
const StyledRoomStatus = styled.Text`
    color:${(props) => blockStatus[props.status].color};
`;