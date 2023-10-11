//------------------------------ MODULE --------------------------------
import React, { useState } from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modalbox';

//---------------------------- COMPONENT -------------------------------
export default React.memo(({
    title = "선택", 
    options = {}, 
    selected ='0', 
    selectEvent = () => {},
    modalOpen,
    modalCloseEvent = () => {},
}) => {
    if(!options) return null;

    //state
    const [checked, setChecked] = useState(selected);

    //render
    return (
        <StyledSelectModal
            isOpen={modalOpen}
            onClosed={() => {modalCloseEvent(); setChecked(selected);}} //reset if not changed
            backdropOpacity={0.4}
            position="bottom"
        >
            <StyledSelectModalContainer>
                <StyledSelectModalHeader>
                    <StyledSelectModalClose name="close" size={18} onPress={modalCloseEvent} suppressHighlighting={true}/>
                    <StyledSelectModalTitle>{title}</StyledSelectModalTitle>
                    <StyledSelectModalButton 
                        suppressHighlighting={true} 
                        onPress={() => {selectEvent(checked); modalCloseEvent()} }
                    >
                        저장
                    </StyledSelectModalButton>
                </StyledSelectModalHeader>
                <StyledSelectModalContent>
                    {
                        Object.entries(options).map(([key, data]) => (
                            <StyledSelectModalItem 
                                key={key} 
                                selected={key == checked} 
                                suppressHighlighting={true}
                                onPress={() => setChecked(key)}
                            >
                                {data}
                            </StyledSelectModalItem>
                        ))
                    }
                </StyledSelectModalContent>
                <StyledSelectModalComment>{`${options[checked]} 매장을 찾아드릴게요`}</StyledSelectModalComment>
            </StyledSelectModalContainer>
        </StyledSelectModal>
    )
});

//------------------------------- STYLE --------------------------------
const StyledSelectModal = styled(Modal)`
    border-top-right-radius:25px;
    border-top-left-radius:25px;
    height:180px;
    margin-top:5px;
    overflow:hidden;
`;
const StyledSelectModalContainer = styled.View`
    padding:20px;
`;
const StyledSelectModalHeader = styled.View`
    padding-bottom:15px;
    justify-content:space-between;
    flex-direction:row;
    border-bottom-width:1px;
    border-color:#D7D7D7;
`;
const StyledSelectModalClose = styled(Icon)`
`;
const StyledSelectModalTitle = styled.Text`
    font-size:16px;
    color:#444;
    font-weight:700;
`;
const StyledSelectModalButton = styled.Text`
    color:#F33562;
    font-size:16px;
    font-weight:500;
`;
const StyledSelectModalContent = styled.View`
    flex-direction:row;
    flex-wrap:wrap;
    padding:20px 0;
`;
const StyledSelectModalComment = styled.Text`
    color:#F33562;
    font-size:12px;
    font-weight:400;
`;
const StyledSelectModalItem = styled.Text`
    font-size:14px;
    font-weight:700;
    color:${(props) => props.selected ? '#F33562' : '#444'};;
    border-width:1px;
    border-color:${(props) => props.selected ? '#F33562' : '#D7D7D7'};
    border-radius:10px;
    padding:3px 10px 1px 10px;
    margin-right: 10px;
`;