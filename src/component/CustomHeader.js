//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';

//---------------------------- COMPONENT -------------------------------
export default function CustomHeader({children}){
    //render
    return (
        <StyledHeader>
            {children}
        </StyledHeader>
    );
}

//------------------------------- STYLE --------------------------------
const StyledHeader = styled.View`
    padding-top:15%;
    height:105;
    border-bottom-width:1px;
    border-color:#ddd;
`;