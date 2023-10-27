//------------------------------ MODULE --------------------------------
import React from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { star_filled, star_half, star_empty } from '@/assets/img';

//---------------------------- COMPONENT -------------------------------
//render
export default React.memo(({score=0, size=14, showText=false, textColor='#F33562', textSize='14px', scoreCatch=() => {}, starGap='1.5%'}) => {
    //function
    const starTemplate = () => {
        const starList = [];
        for(let i=0; i<5; i++){
            const chk = score-i;
            let icon;
            if(chk >= 1) icon = star_filled;
            else if(chk > 0) icon = star_half;
            else icon = star_empty;
            starList.push(
                <StyledStarUnitCover key={i} onPress={() => scoreCatch(i+1)} >
                    <StyledStarUnit source={icon} size={size} endChk={i==4} starGap={starGap}/>
                </StyledStarUnitCover>
            );
        }        
        return starList;
    }
    
    //render
    return ( 
        <StyledConatainer>
            <StyledStarRow>
                {starTemplate()}
                {
                    showText ? 
                    <StyledScoreText color={textColor} size={textSize}>{score}{!Number.isInteger(score) ? '.0':''}</StyledScoreText>
                    : null
                }                
            </StyledStarRow>
        </StyledConatainer>
    );
});

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
`;
const StyledStarRow = styled.View`
    flex-direction:row;
    justify-content:space-between;
`;
const StyledStarUnitCover = styled.TouchableOpacity`
    justify-content:center;
`;
const StyledStarUnit = styled(FastImage)`
    width:${(props) => props.size}px;
    height:${(props) => props.size}px;
    margin-right:${(props) => props.endChk ? '0' : props.starGap};
`;
const StyledScoreText = styled.Text`
    color:${props => props.color};
    font-weight:500;
    margin-left:5px;
    font-size:${props => props.size};
`;