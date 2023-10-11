//------------------------------ MODULE --------------------------------
import { useLayoutEffect } from 'react';
import styled from 'styled-components/native';

//---------------------------- COMPONENT -------------------------------
export default function ReviewMyList(){
    //data
    //const [reservation, reservationUpdate] = useReservation(null, {'reservation_stt':'5', 'type':'reservation_date', 'col':'reservation_date,reservation_time'});

    //effcet
    useLayoutEffect(() => {
        //reservationUpdate();
    }, []);

    //render
    return (
        <StyledConatainer>
        </StyledConatainer>
    );
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:#F1F1F1;
`;