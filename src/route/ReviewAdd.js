//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import { ReviewEdit } from '@/component';

//---------------------------- COMPONENT -------------------------------
export default function ReviewAdd({route}){
    //init
    const { reservationData } = route.params;

    //render
    return (
        <StyledConatainer>
            <ReviewEdit reservationData={reservationData}/>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
`;