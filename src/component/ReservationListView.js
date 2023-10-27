//------------------------------ MODULE --------------------------------
import React from 'react';
import styled from 'styled-components/native';
import { numberToTime, timeToText } from '@/lib';
import { useNavigation } from '@react-navigation/native';

//---------------------------- COMPONENT -------------------------------
//render
export default React.memo(({data=null, theme="default"}) => {
    //init
    const navigation = useNavigation();

    //render
    return data ? (
        Object.keys(data)?.length ? (
            <StyledConatainer>
                {
                    Object.keys(data).map((k, kIndex) => (
                        <StyledSection key={kIndex}>
                            <StyledSectionDate theme={theme}>{timeToText(new Date(k), 'yy.mm.dd')}</StyledSectionDate>
                            {
                                data[k].map((d, dIndex) => (
                                    <StyledItem key={dIndex} onPress={() => navigation.navigate('예약상세', {id:d.reservation_idx})}>
                                        <StyledTime>
                                            <StyledTimeText theme={theme}>{numberToTime(d.reservation_time)}</StyledTimeText>
                                        </StyledTime>
                                        <StyledInfo>
                                            <StyledInfoName theme={theme}>{d.store_name}</StyledInfoName>
                                            <StyledInfoAddr>{d.store_addr}</StyledInfoAddr>
                                        </StyledInfo>
                                    </StyledItem>
                                ))
                            }
                        </StyledSection>
                    ))                
                } 
            </StyledConatainer>
        ) : (<StyledEmptyText>예약 내역이 없습니다.</StyledEmptyText>)
    ) : null
});

//------------------------------- STYLE --------------------------------
const themeColor = {
    default: {
        date : '#444',
        time : '#F33562',
        title : '#222'
    },
    gray : {
        date : '#7D7D7D',
        time : '#7D7D7D',
        title : '#7D7D7D'
    }
};

const StyledConatainer = styled.ScrollView`
    flex:1;
    background:white;
`;
const StyledEmptyText = styled.Text`
    margin-top:50px;
    align-self:center;
    color:#222;
`;
const StyledSection = styled.View`
    margin:10px 15px;
`;
const StyledSectionDate = styled.Text`
    margin:5px;
    color:${(props) => themeColor[props.theme].date};
    font-size:12px;
    font-weight:400;
`;
const StyledItem = styled.TouchableOpacity`
    border-width:1px;
    border-color:#D7D7D7;
    border-radius:8px;
    margin:5px;
    flex-direction:row;
    padding:12px 10px;
`;
const StyledTime = styled.View`
    justify-content:center;
`;
const StyledTimeText = styled.Text`
    color:${(props) => themeColor[props.theme].time};
    font-size:18px;
    font-weight:600;
`;
const StyledInfo = styled.View`
    margin-left:20px;
`;
const StyledInfoName = styled.Text`
    color:${(props) => themeColor[props.theme].title};
    font-size:16px;
    font-weight:700;
    padding-bottom:5px;
`;
const StyledInfoAddr = styled.Text`
    color:#7D7D7D;
    font-size:12px;
    font-weight:400;
`;