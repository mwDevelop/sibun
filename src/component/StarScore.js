//------------------------------ MODULE --------------------------------
import React from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { star_filled, star_half, star_empty } from '@/assets/img';

//---------------------------- COMPONENT -------------------------------
//render
export default React.memo(({score=0, size=14, showText=false}) => {
    //function
    const starTemplate = () => {
        const starList = [];
        for(let i=0; i<5; i++){
            const chk = score-i;
            let icon;
            if(chk >= 1) icon = star_filled;
            else if(chk > 0) icon = star_half;
            else icon = star_empty;
            starList.push(<StyledStarUnit key={i} source={icon} size={size} endChk={i==4}/>);
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
                    <StyledScoreText>{score}{!Number.isInteger(score) ? '.0':''}</StyledScoreText>
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
const StyledStarUnit = styled(FastImage)`
    width:${(props) => props.size}px;
    height:${(props) => props.size}px;
    margin-right:${(props) => props.endChk ? '0' : '1.5'}%;
`;
const StyledScoreText = styled.Text`
    color:#F33562;
    font-weight:500;
    margin-left:5px;
`;