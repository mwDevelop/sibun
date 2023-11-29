//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { onerror } from '@/assets/img';
import { useNavigation } from '@react-navigation/native';

//---------------------------- COMPONENT -------------------------------
export default React.memo(({unit, containerStyle={}}) => {
    //init
    const navigation = useNavigation();
    
    //render
    return unit ? (
        <StyledContainer style={{...containerStyle}}>
            <StyledTouchArea onPress={() => navigation.navigate('Desc', unit)}>
                <StyledImage source={unit.store_main_simg ? {uri: unit.store_main_simg} : onerror} defaultSource={onerror}/>
                <StyledInfo>
                    <StyledTitle>{unit.store_name}</StyledTitle>
                    <StyledAddr numberOfLines={1} ellipsizeMode="tail">{unit.store_addr}</StyledAddr>
                    <StyledReview>
                        <StyledStar>★ </StyledStar>
                        {Number(unit.store_review_avg).toFixed(1)}
                    </StyledReview>
                </StyledInfo>
            </StyledTouchArea>
        </StyledContainer>
    ) : null;
});

//------------------------------- STYLE --------------------------------
const StyledContainer = styled.View`
    margin-right:30px;
    aspect-ratio:0.8;
`;
const StyledTouchArea = styled.TouchableOpacity`
    background:#fff;
    shadow-color: black; 
    shadow-offset: 3px; 
    shadow-opacity: 0.2; 
    shadow-radius:5px;
    elevation:1;
    border-radius:20px;
`
const StyledImage = styled(FastImage)`
    height:50%;
    width:100%;
    border-top-right-radius:20px;
    border-top-left-radius:20px;
`;
const StyledInfo = styled.View`
    padding:10px;
`;
const StyledTitle = styled.Text`
    color:#222;
    font-weight:500;
    line-height:20px;
`;
const StyledAddr = styled.Text`
    padding-top:5px;
    font-weight:500;
    color:#7D7D7D;
    font-size:12px;
`;
const StyledReview = styled.Text`
    color:#B9B9B9;
    padding-top:3px;
`;
const StyledStar = styled.Text`
    color:#F4DF1F;
`;