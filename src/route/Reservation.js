//------------------------------ MODULE --------------------------------
import { useLayoutEffect, useMemo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { useStore, useUser} from '@/hooks';
import { CheckBox, CouponSlide } from '@/component';
import { apiCall, mobileMask, numberFilter, numberToTime, timeToNumber, timeToText } from '@/lib';
import { koreanDay, globalMsg } from '@/data/constants';
import AwesomeAlert from 'react-native-awesome-alerts';
import { alertDefaultSetting } from '@/data/constants';
import { useReservationMutate } from '@/hooks';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

//---------------------------- COMPONENT -------------------------------
export default function Reservation({route}){
    //init
    const storeIdx = route?.params?.id;
    const cellphoneRef = useRef(); 
    const timeTable = [2,3,4]; // 1 for 60min 
    const reservationMutation = useReservationMutate();
    const navigation = useNavigation();

    //data
    const [store] = useStore(storeIdx);
    const [user] = useUser();

    //state
    const [datePicked, setDatePicked] = useState(new Date());
    const [timePicked, setTimePicked] = useState(null);
    const [usingTimePicked, setUsingTimePicked] = useState(null);
    const [roomPicked, setRoomPicked] = useState(null);
    const [couponPicked, setCouponPicked] = useState(null);
    const [bookStatus, setBookStatus] = useState(null);
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
    const [confirm, setConfirm] = useState(false);
    const [confirmMsg, setConfirmMsg] = useState(null);

    //function
    const badToast = (msg) => {
        return Toast.show({
            type: 'bad',
            text1: msg || '문제가 발생했습니다\n\n관리자에게 문의 해 주세요!',
            topOffset: 120,
            visibilityTime: 2000
        })
    };

    const onEditClick = (letters) => {
        if(letters.length < 10){
            cellphoneRef.current.focus();
            return badToast(globalMsg['invalidPhone']);
        }
        setCellphoneEdit(!cellphoneEdit);
    }

    const callRoom = () => {
        apiCall.get(`/store/${storeIdx}/room`)
            .then((res) => {
                if(res.data.result == "000") setRoom(res?.data?.list);
            });
    }

    const callBookStatus = (target) => {
        //time range option
        const start = target-3;
        const end = target+3;
        let timeInParam = `${start}`;
        for(let i=start+1; i <= end; i++) timeInParam += `,${i}`;
        
        //get current reservation in the range
        const params = { 
            reservation_date:timeToText(datePicked, 'y-mm-dd'),
            reservation_time_in:timeInParam,
            reservation_stt_in:'1,2,5' // ready, confirm, enter
        };
        apiCall.get(`/store/${storeIdx}/reservation`, {params})
            .then((res) => {
                const bookMemo = {};
                if(res.data.result == "000"){
                    if(res?.data?.list){
                        //make object of rooms(set data) booked by time(key)
                        const copiedList = JSON.parse(JSON.stringify(res.data.list));
                        copiedList.sort((a,b) => Number(a.reservation_time)-Number(b.reservation_time));
                        copiedList.forEach((obj) => {
                            const loopStart = Number(obj.reservation_time);
                            const loopEnd = loopStart + Number(obj.reservation_period); //not included
                            for(let i=loopStart; i<loopEnd; i++){
                                if(i < target) continue; //only for meaningful time
                                if(!(i in bookMemo)) bookMemo[i] = new Set();
                                bookMemo[i].add(obj.reservation_room_idx);
                            }
                        });
                    }
                }
                //fill empty date & setState
                for(let i=target; i<end; i++){
                    if(!(i in bookMemo)) bookMemo[i] = new Set();
                }
                setBookStatus(bookMemo);                 
            }).catch((e) => {
                console.log(e);
            });
    };

    const callCoupon = async() => {
        //call coupon list 
        const params = {};
        if(datePicked) {
            const dayId = datePicked.getDay() == 0 ? "7" : String(datePicked.getDay());
            params.store_voucher_date = timeToText(datePicked, 'y-mm-dd');
            params.store_voucher_available_days = dayId;
        }             
        if(timePicked) params.store_voucher_time = String(timePicked);
        const vRes = await apiCall.get(`/store/${storeIdx}/voucher`, {params});
        if(vRes.data.result == "000"){
            let couponList = vRes.data.list?.length ? vRes.data.list : null;
            if(couponList){
                //call reservations discounted by coupons in the coupon list
                const params = { 
                    reservation_date : timeToText(datePicked, 'y-mm-dd'),
                    reservation_voucher_idx_in : vRes.data.list.map((item) => item.store_voucher_idx).join(),
                    reservation_stt_in:'1,2,4,5' // ready, confirm, noshow, enter
                };
                const rRes = await apiCall.get(`/store/${storeIdx}/reservation`, {params});                    
                if(rRes.data.result == "000" && rRes.data.list?.length){
                    //filtering fully used daily coupon
                    couponList = couponList.filter((couponData) => 
                        rRes.data.list.filter((bookData) => 
                            bookData.reservation_voucher_idx == couponData.store_voucher_idx
                        ).length < couponData.store_voucher_daily_total_cnt);
                }
            }
            setCoupon(couponList);
        }else{setCoupon(null)}
    };

    const submitChk = () => {
        //data chk...
        if(!datePicked) return badToast(globalMsg['isNotSelectedDate']);
        if(!timePicked) return badToast(globalMsg['isNotSelectedTime']);
        if(!usingTimePicked) return badToast(globalMsg['isNotSelectedUsing']);
        if(!roomPicked) return badToast(globalMsg['isNotSelectedRoom']);
        if(!cellphone || cellphone.length<11) return badToast(globalMsg['invalidPhone']);
        terms.forEach((d) => {
            if(d.required && !d.selected) return badToast(globalMsg['selectRequired']);
        })
        
        //coupon chk...
        let couponText = "없음";
        if(couponPicked && coupon?.length){
            couponText = coupon.find((obj) => obj.store_voucher_idx == couponPicked)['store_voucher_title'];
        }

        //set confirm open
        setConfirmMsg(`날짜 :    ${timeToText(datePicked, 'y-mm-dd')}\n시간 :    ${numberToTime(timePicked)}~${numberToTime(timePicked+usingTimePicked)}\n쿠폰 :    ${couponText}`);
        setConfirm(true);
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
                navigation.replace('예약상세', {id:res.data.data.lastInsertId});
            }else{
                badToast();
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
        const holidays = store?.store_closed_days ? store.store_closed_days?.split(',').map((d, i) => d==7 ? 0 : Number(d)) : [];
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
        //check reserved rooms
        let ableMax = 4;
        if(bookStatus && room) Object.entries(bookStatus).some(([key, item], index) => { //version chk for build(ordered by key from ver ES11)
            if(item.size >= room.length){
                ableMax = index;
                return true;
            }
        });
        //check close time
        const closeTime = store.store_close_time;
        const leftTime = closeTime-timePicked;

        //render
        return (
            <StyledSubsection>
                <StyledSubsectionTitle>이용시간</StyledSubsectionTitle>
                <StyledSubsectionComment>*60분부터 예약가능합니다.</StyledSubsectionComment>
                <StyledSubsectionContent>
                    <StyledSubsectionBlockList>
                        {
                            timeTable.map((v, i) => {
                                const pickChk = usingTimePicked == v; 
                                const ableChk = timePicked && leftTime >= v && v <= ableMax;
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
    }, [store, timePicked, usingTimePicked, bookStatus, room]);
    
    const roomGear = useMemo(() => {
        //check reserved room
        let unableRoomSet = new Set();
        if(bookStatus && usingTimePicked){
            Object.entries(bookStatus).some(([key, item], index) => {
                unableRoomSet = new Set([...unableRoomSet, ...item]);
                if(index+1 >= usingTimePicked) return true;
            });
        }

        return !room ? null : (
            <StyledSubsection>
                <StyledSubsectionTitle>방선택</StyledSubsectionTitle>
                <StyledSubsectionComment>*방번호는 임의로 신청한 번호로 실제 번호와 다를 수 있습니다.</StyledSubsectionComment>
                <StyledSubsectionContent>
                    <StyledSubsectionBlockList>
                    {
                        room.map((v, i) => {
                            const pickChk = roomPicked == v.store_room_idx; 
                            const ableChk = usingTimePicked && !unableRoomSet.has(String(v.store_room_idx));
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
                                    <StyledSubsectionBlockItemText numberOfLines={1} ellipsizeMode="tail" status={status} style={{fontSize:12, height:20}}>
                                        {v.store_room_name}
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
    }, [usingTimePicked, roomPicked, room, bookStatus]);

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

    const confirmGear = useMemo(() => (
        <AwesomeAlert
            {...alertDefaultSetting}
            show={confirm}
            title='해당 내용으로 예약하시겠습니까?'
            message={confirmMsg}
            confirmText="예약하기"
            onCancelPressed={() => {
                setConfirm(false);
            }}
            onConfirmPressed={() => {
                setConfirm(false);
                save();
            }}
            onDismiss={() => setConfirm(false)}
        />
    ), [confirm, confirmMsg]);    

    //effect
    useLayoutEffect(() => {
        callRoom();
    }, []);

    useLayoutEffect(() => {
        if(store?.store_closed_days){
            const holidays = store?.store_closed_days.split(',').map((d, i) => d==7 ? 0 : Number(d));
            let td = new Date();
            while(holidays.includes(td.getDay())) td.setDate(td.getDate()+1);
            setDatePicked(td);
        }
    }, [store]);

    useLayoutEffect(() => {
        if(!datePicked) return;
        //refresh
        setTimePicked(null);
        setCoupon(null);
        setCouponPicked(null);
    }, [datePicked]);

    useLayoutEffect(() => {
        if(!timePicked) return;
        //update
        callCoupon();
        callBookStatus(timePicked);
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
    text-align-vertical:top;
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