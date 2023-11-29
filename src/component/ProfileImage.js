//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { photo_edit } from '@/assets/img';
import React from 'react';
import { profile_default } from '@/assets/img';
import { ImageUpload } from '@/component';
import { useState } from 'react';

//---------------------------- COMPONENT -------------------------------
export default React.memo(({src=profile_default, changeHandler=()=>{}, customStyle={}}) => {
    //state
    const [uploadOpen, setUploadOpen] = useState(false);

    //function
    const imageHandler = (arr) => changeHandler(arr[0]);

    //render
    return (
        <StyledImageBox style={customStyle}>
            <StyledProfileImg source={src ? {uri:src} : profile_default} defaultSource={profile_default}/>
            <StyledProfileEditButton onPress={() => setUploadOpen(true)}>
                <StyledProfileEditButtonImage source={photo_edit}/>
            </StyledProfileEditButton>        
            <ImageUpload size={200} open={uploadOpen} close={() => setUploadOpen(false)} dataHandler = {imageHandler} title="프로필 사진을 업로드 해 주세요!"/>
        </StyledImageBox>
    );
});

//------------------------------- STYLE --------------------------------
const StyledImageBox = styled.View`
    position:relative;
    align-self:center;
`;
const StyledProfileImg = styled(FastImage)`
    width:70px;
    height:70px;
    border-radius:35px;
    border-color:#eee;
    border-width:1px;
`;
const StyledProfileEditButton = styled.TouchableOpacity`
    position:absolute;
    bottom:7%;
    left:14%;
`;
const StyledProfileEditButtonImage = styled(FastImage)`  
    width:25px;
    height:25px;
`;