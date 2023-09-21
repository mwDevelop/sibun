//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import React from 'react';

//---------------------------- COMPONENT -------------------------------
//render
export default React.memo(({couponList = null, pick=()=>{}, pickedId=null}) => {
    //render
    return (
        <StyledSubsectionCoupon horizontal={true} showsHorizontalScrollIndicator={false}>
            {
                !couponList ? null : couponList.map((v, i) => (
                    <StyledSubsectionCouponText key={i} onPress={() => pick(v.store_voucher_idx)} status={pickedId == v.store_voucher_idx} suppressHighlighting={true}>
                        {v.store_voucher_title} <StyledSubsectionCouponHighLight>최대{v.store_voucher_discount_rate}%</StyledSubsectionCouponHighLight>
                    </StyledSubsectionCouponText>
                ))
            }
        </StyledSubsectionCoupon> 
    )
});

//------------------------------- STYLE --------------------------------
const StyledSubsectionCoupon = styled.ScrollView`
    overflow:visible;
    margin: 15px 0;
`;
const StyledSubsectionCouponText = styled.Text`
    padding: 0 40px;
    line-height:60px;
    background:${(props) => props.status ? "rgba(243,53,98,0.4)" : "#E9E9E9"};
    text-align:center;
    border-radius:10px;
    overflow:hidden;
    font-size:18px;
    font-weight:500;
    color:#222;
    margin-right:20px;
`;
const StyledSubsectionCouponHighLight = styled.Text`
    font-weight:700;
    color:#F33562;
`;