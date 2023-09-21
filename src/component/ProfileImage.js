//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { photo_edit } from '@/assets/img';
import { Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { permissionCheck } from '@/lib';
import React from 'react';
import { profile_default } from '@/assets/img';

//---------------------------- COMPONENT -------------------------------
export default React.memo(({src=profile_default, changeHandler=()=>{}, customStyle={}}) => {
    //function
    const imageUpload = async() => {
        const chkResult = await permissionCheck(Platform.OS, 'photo');
        if(chkResult != "granted" && chkResult != "limited") return;
        ImagePicker.openPicker({
            width: 70,
            height: 70,
            cropping: true,
            includeBase64: true,
            writeTempFile: false
        }).then(image => {
            changeHandler(`data:image/${image.mime};base64,${image.data}`);
        });
    }

    //render
    return (
        <StyledImageBox style={customStyle}>
            <StyledProfileImg source={src ? {uri:src} : profile_default}/>
            <StyledProfileEditButton onPress={imageUpload}>
                <StyledProfileEditButtonImage source={photo_edit}/>
            </StyledProfileEditButton>        
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