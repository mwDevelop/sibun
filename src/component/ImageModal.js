//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ImageCarousel } from '@/component';

//---------------------------- COMPONENT -------------------------------
export default function ImageModal({data = null, close = () => {console.log("close event is not set")}, startIdx=0}){
    //render
    return !data ? null : (
        <StyledModal visible={data ? true : false} >
            <StyledContainer>
                <StyledCarouselBox>
                    <ImageCarousel data={data} firstItem={startIdx}/>
                </StyledCarouselBox>
            </StyledContainer>
            <StyledCloseButton name="close-outline" onPress={close} suppressHighlighting={true}/>
        </StyledModal>
    );
}

//------------------------------- STYLE --------------------------------
const StyledModal = styled.Modal`
`;
const StyledContainer = styled.View`
    background:#444;
    flex:1;
    justify-content:center;
`;
const StyledCarouselBox = styled.View`
    height:400px;
`;
const StyledCloseButton = styled(Icon)`
    font-size:40px;
    position:absolute;
    top:8%;
    right:5%;
    color:#fff;
`;