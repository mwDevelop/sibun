//------------------------------ MODULE --------------------------------
import { useLayoutEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useReservation, useReservationMutate, useUser } from '@/hooks';
import Icon from 'react-native-vector-icons/Ionicons';
import { numberToTime, timeToText, mobileMask } from '@/lib';
import { location_black } from '@/assets/img';
import FastImage from 'react-native-fast-image';
import { koreanDay, reservationStatus } from '@/data/constants';
import AwesomeAlert from 'react-native-awesome-alerts';
import { alertDefaultSetting } from '@/data/constants';
import Toast from 'react-native-toast-message';
import QRCode from 'react-native-qrcode-svg';
import { rh } from '@/data/globalStyle';

//---------------------------- COMPONENT -------------------------------
export default function ReservationDesc({route}){
    //init
    const reservationId = route?.params?.id;
    const navigation = useNavigation();
    const reservationMutation = useReservationMutate();
    
    //data
    const [reservation, reservationUpdate, reservationStale] = useReservation(reservationId);
    const [user] = useUser();

    //state
    const [confirm, setConfirm] = useState(false);

    //function
    const cancel = () => {
        reservationMutation.mutate({type:"modify", id:reservationId}, {onSuccess: async(res) => {
            if(res.data.result == "000"){
                Toast.show({
                    type: 'good',
                    text1: '예약이 취소되었습니다',
                    topOffset: 120,
                    visibilityTime: 1000
                })                
            }else{
                Toast.show({
                    type: 'bad',
                    text1: '취소할 수 없는 예약입니다.',
                    topOffset: 120,
                    visibilityTime: 1000
                })                
            }
        }});        
    }   

    const moveStore = () => {
        navigation.navigate('Desc', {store_idx : reservation.reservation_store_idx});
    }

    //effect
    useLayoutEffect(() => {
        return () => reservationStale(); //refresh when unmount
    }, []);

    useLayoutEffect(() => {
        if(user === null) navigation.reset({routes: [{name: "Login", params:{expired: '로그인 정보가 만료되었습니다'}}]});;
    }, [user]);

    //memo
    const reservationGear = useMemo(() => {
        if(!reservation) return null;

        //status
        const status = reservation.reservation_stt;

        //time
        const reservationDate = new Date(reservation.reservation_date);
        const reservationDay = reservationDate.getDay();
        const dateText = timeToText(reservationDate, 'y. mm. dd');
        const dayText = koreanDay[reservationDay];
        const timeArr = numberToTime(reservation.reservation_time).split(':'); //ex) ['13', '00']
        const timeText = (
            (Number(timeArr[0]) > 11 ? '오후 ' : '오전 ') 
            + `${timeArr[0] == 12 ? '12' : (Number(timeArr[0]) % 12)}시 `
            +(timeArr[1]=="00" ? '':'30분')
        );

        return (
            <StyledConatainer>
                <StyledSection>
                    <StyledSectionRow style={{justifyContent:'space-between'}}>
                        <StyledReservationStatus status={status}>{reservationStatus[status]}</StyledReservationStatus>
                        {
                            status==1 || status==2 ? 
                            <StyledReservationChange suppressHighlighting={true} onPress={() => setConfirm(true)}>예약취소</StyledReservationChange> : 
                            (
                                status==5 ? 
                                <StyledReservationChange  suppressHighlighting={true} onPress={moveStore}>재방문</StyledReservationChange> 
                                : null
                            )
                        }
                    </StyledSectionRow>
                    <StyledSectionRow style={{justifyContent:'space-between', paddingBottom:0}}>
                        <StyledStoreTitle onPress={moveStore} suppressHighlighting={true}>{reservation.store_name}</StyledStoreTitle>
                        <StyledStoreButton name="chevron-forward-outline" size={20} onPress={moveStore} suppressHighlighting={true}/>
                    </StyledSectionRow>
                    <StyledSectionRow style={{paddingTop:0}}>
                        <StyledStoreAddr>{reservation.store_addr}</StyledStoreAddr>
                        <StyledLocationImage source={location_black} resizeMode="contain"/>
                    </StyledSectionRow>
                    <StyledSectionRow>
                        <StyledReservationTime>
                            {dateText}&nbsp;
                            ({dayText})&nbsp;
                            {timeText}
                        </StyledReservationTime>
                    </StyledSectionRow>                                
                </StyledSection>      
                <StyledSection style={{borderTopWidth:1, borderColor:'#eee'}}>
                    <StyledSectionRow style={{paddingBottom:20}}>
                        <StyledInfoTitle>예약정보</StyledInfoTitle>
                    </StyledSectionRow>
                    <StyledSectionRow>
                        <StyledInfoTag>예약번호</StyledInfoTag>
                        <StyledInfoData>{reservation.reservation_code}</StyledInfoData>
                    </StyledSectionRow>
                    <StyledSectionRow>
                        <StyledInfoTag>예약자 이름</StyledInfoTag>
                        <StyledInfoData>{user.mb_name}</StyledInfoData>
                    </StyledSectionRow>                                
                    <StyledSectionRow>
                        <StyledInfoTag>예약자 번호</StyledInfoTag>
                        <StyledInfoData>{mobileMask(user.mb_cellphone)}</StyledInfoData>
                    </StyledSectionRow>                                                    
                </StyledSection>                  
                {
                    status == 2 ? ( //Show the QR section only for case reservation confirmed
                        <StyledQRBox>
                            <QRCode 
                                value={String(reservationId)}
                                logoSize={40}
                                logoBackgroundColor='transparent'
                                color='#333'
                                size={rh * 120}
                            />
                        </StyledQRBox>
                    ) : null
                }
            </StyledConatainer>
        )
    }, [reservation, user]);

    const confirmGear = useMemo(() => (
        <AwesomeAlert
            {...alertDefaultSetting}
            show={confirm}
            title='예약을 취소하시겠습니까?'
            confirmText="예약취소"
            cancelText="아니오"
            onCancelPressed={() => {
                setConfirm(false);
            }}
            onConfirmPressed={() => {
                setConfirm(false);
                cancel();
            }}
            onDismiss={() => setConfirm(false)}
        />
    ), [confirm]);

    //render
    return (
        <>
            {reservationGear}
            {confirmGear}
        </>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
`;
const StyledSection = styled.View`
    margin:5px 20px;
    padding:10px 0;
`;
const StyledSectionRow = styled.View`
    flex-direction:row;
    padding:10px 0;
    align-items:center;
`;
const StyledReservationStatus = styled.Text`
    font-size:20px;
    color:${(props) => props.status == 2 ? '#F33562' : '#7D7D7D'};
    font-weight:600;
`;
const StyledReservationChange = styled.Text`
    color:#333;
    font-size:12px;
    background:#E9E9E9;
    padding:5px 10px;
    font-weight:500;
    border-radius:5px;
    overflow:hidden;
`;
const StyledStoreTitle = styled.Text`
    font-size:16px;
    font-weight:700;
    color:#333;
`;
const StyledStoreButton = styled(Icon)`
`;
const StyledStoreAddr = styled.Text`
    color:#7D7D7D;
    font-weight:400;
    font-size:12px;
    padding:5px 0;
`;
const StyledLocationImage = styled(FastImage)`
    width:20px;
    height:20px;
    margin-left:10px;
`;
const StyledReservationTime = styled.Text`
    color:#333;
    font-size:14px;
    font-weight:600;
    text-align:center;
    width:100%;
    line-height:42px;
    border-radius:5px;
    border-width:1px;
    border-color:#D7D7D7;
`;
const StyledInfoTitle = styled.Text`
    color:#333;
    font-size:16px;
    font-weight:500;
`;
const StyledInfoTag = styled.Text`
    width:100px;
    font-size:14px;
    font-weight:400;
    color:#7D7D7D;
`;
const StyledInfoData = styled.Text`
    color:#333;
    font-size:14px;
    font-weight:500;
`;
const StyledQRBox = styled.View`
    align-self:center;
    top:40px;
`;