//------------------------------ MODULE --------------------------------
import { useLayoutEffect } from 'react';
import styled from 'styled-components/native';
import { useReservation } from '@/hooks';
import { ReservationListView } from '@/component';

//---------------------------- COMPONENT -------------------------------
export default function ReservationReady(){
    //data
    const [reservation, reservationUpdate] = useReservation(null, {'reservation_stt':'1,2', 'type':'reservation_date', 'col':'reservation_date,reservation_time'});

    //effcet
    useLayoutEffect(() => {
        reservationUpdate();
    }, [])

    //render
    return (
        <StyledConatainer>
            <ReservationListView data={reservation}/>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
`;