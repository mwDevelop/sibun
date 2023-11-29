//------------------------------ MODULE --------------------------------
import React from 'react';
import { useState, useMemo } from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { StarScore, ImageModal } from '@/component';
import { profile_default } from '@/assets/img';

//---------------------------- COMPONENT -------------------------------
//render
export default React.memo(({data=null, zIndex=-1}) => {
    //state
    const [modalData, setModalData] = useState(null);

    //memo
    const listGear = useMemo(() => data?.length ? ( 
            <StyledConatainer zIndex={zIndex}>
                {data.map((item, index) => {
                    const ImageData = Array();
                    if(item.review_img1) ImageData.push(item.review_img1);
                    if(item.review_img2) ImageData.push(item.review_img2);
                    if(item.review_img3) ImageData.push(item.review_img3);

                    return (
                        <StyledSection key={index}>
                            <StyledSectionRow>
                                <StyledProfileImage source={item.mb_profile_img ? {uri:item.mb_profile_img} : profile_default} defaultSource={profile_default} />
                                <StyledSectionCol>
                                    <StyledSectionColRow>
                                        <StyledProfileText>{item.mb_nickname}</StyledProfileText>
                                        <StyledRegDate>
                                            {item.review_reg_dt.substr(2,2)}.
                                            {item.review_reg_dt.substr(5,2)}.
                                            {item.review_reg_dt.substr(8,2)}
                                        </StyledRegDate>
                                    </StyledSectionColRow>
                                    <StyledSectionColRow>
                                        <StarScore score={item.review_rating} showText={true}/>
                                    </StyledSectionColRow>
                                </StyledSectionCol>
                            </StyledSectionRow>
                            {   /* IMAGE AREA */
                                (!item.review_img1 && !item.review_img2 && !item.review_img3 ) ? null :
                                <StyledSectionRow>
                                    {ImageData.map( 
                                        (src, idx) => (
                                            <StyledReviewImagePress key={idx} activeOpacity={1} onPress={() => setModalData({data:ImageData, startIdx:idx})}>
                                                <StyledReviewImage source={{uri:src}} resizeMode="cover"/>
                                            </StyledReviewImagePress>
                                        )
                                    )}
                                </StyledSectionRow>                    
                            }
                            {
                                item.review_tags ? (
                                    <StyledSectionRow>
                                        {
                                            item.review_tags.split(',').map((text, index) => (
                                                <StyledHashTagText key={index}>#{text}</StyledHashTagText>        
                                            ))
                                        }              
                                    </StyledSectionRow>
                                ) : null
                            }
                            {   /* CONTENT AREA */
                                !item.review_content ? null : (
                                    <StyledSectionRow>
                                        <StyledReviewText>
                                            {item.review_content}
                                        </StyledReviewText>
                                    </StyledSectionRow>                    
                                )
                            }
                        </StyledSection>
                    )                    
                })}
            </StyledConatainer>
    ) : null, [data]);

    //render
    return (
        <>
            {listGear}
            <ImageModal data={modalData?.data} startIdx={modalData?.startIdx} close={() => setModalData(null)}/>
        </>
    )
});

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    margin:5px 0;
    z-index:${(props) => props.zIndex};
`;
const StyledSection = styled.View`
    border-top-width:1px;
    border-color:#E9E9E9;
    padding:15px 0;
`;
const StyledSectionRow = styled.View`
    flex-direction:row;
    margin:5px;
`;
const StyledProfileImage = styled(FastImage)`
    width:50px;
    height:50px;
    border-radius:25px;
`;
const StyledSectionCol = styled.View`
    justify-content:space-evenly;
    flex:1;
    margin-left:10px;
`;
const StyledSectionColRow = styled.View`
    flex-direction:row;
    justify-content:space-between;
`;
const StyledProfileText = styled.Text`
    color:#222;
    font-weight:500;
`;
const StyledRegDate = styled.Text`
    color:#7D7D7D;
    font-size:12px;
    font-weight:500;
`;
const StyledReviewImagePress = styled.TouchableOpacity`
    width:80px;
    height:80px;
    border-radius:5px;
    margin-right:5px;
    background:#eee;
    overflow:hidden;
`;
const StyledReviewImage = styled(FastImage)`
    height:100%;
`;
const StyledHashTagText = styled.Text`
    font-size:12px;
    color:#444;
    background:#E9E9E9;
    padding:2px 5px;
    font-weight:500;
`;
const StyledReviewText = styled.Text`
`;