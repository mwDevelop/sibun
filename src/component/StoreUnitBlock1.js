//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import React, { useLayoutEffect } from 'react';
import FastImage from 'react-native-fast-image';
import { onerror } from '@/assets/img';
import { useNavigation } from '@react-navigation/native';
import { useCoupon } from '@/hooks';

//---------------------------- COMPONENT -------------------------------
export default React.memo(({unit, containerStyle={}}) => {
    //init
    const navigation = useNavigation();    

    //data
    const [voucher, voucherUpdate] = useCoupon(unit?.store_idx, {/*nowAvailable:true*/});

    //render
    return unit ? (
        <StyledContainer style={{...containerStyle}}>
            <StyledTouchArea onPress={() => navigation.navigate('Desc', unit)}>
                <StyledImage source={unit.store_main_simg ? {uri: unit.store_main_simg} : onerror} defaultSource={onerror}>
                    {voucher ? <StyledDiscount>{voucher.reduce((pre, cur) => Math.max(pre, Number(cur.store_voucher_discount_rate)), 0)}% 할인</StyledDiscount> : null}
                </StyledImage>
                <StyledInfo>
                    <StyledTitle>{unit.store_name}</StyledTitle>
                    <StyledAddr>{unit.store_addr}</StyledAddr>
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
    padding-right:20px;
`;
const StyledTouchArea = styled.TouchableOpacity`
`
const StyledImage = styled(FastImage)`
    width:100%;
    aspect-ratio:1;
    border-radius:20px;
`;
const StyledInfo = styled.View`
    padding-top:10px;
`;
const StyledTitle = styled.Text`
    color:#222;
    font-weight:500;
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
const StyledDiscount = styled.Text`
    position:absolute;
    background:#F33562;
    color:#fff;
    width:80px;
    bottom:0;
    text-align:center;
    line-height:25px;
    font-weight:600;
    overflow:hidden;
`;