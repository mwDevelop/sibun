//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import React, { useLayoutEffect } from 'react';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Ionicons';
import { permissionCheck } from '@/lib';
import ImagePicker from 'react-native-image-crop-picker';

//---------------------------- COMPONENT -------------------------------
//render
export default React.memo(({open = false, close=()=>{}, dataHandler=() => {}, title="업로드 방법을 선택 해 주세요!", size=100, max=1}) => {
    //function
    const connectAlbum = async() => {
        const chkResult = await permissionCheck('photo');
        if(chkResult != "granted" && chkResult != "limited") return close();
        ImagePicker.openPicker({
            compressImageMaxWidth: size,
            compressImageMaxHeight: size,
            mediaType:'photo',
            includeBase64: true,
            writeTempFile: false,
            multiple: true,
            maxFiles: max,
        }).then(image => {
            close();
            dataHandler(image.map((i) => `data:image/${i.mime};base64,${i.data}`));
        }).catch((e) => {
            console.log(e);
        });
    }    

    const connectCamera = async() => {
        const chkResult = await permissionCheck('camera');
        if(chkResult != "granted" && chkResult != "limited") return close();
        ImagePicker.openCamera({
            compressImageMaxWidth: size,
            compressImageMaxHeight: size,
            mediaType:'photo',
            includeBase64: true,
            writeTempFile: false,
        }).then(image => {
            close();
            dataHandler([`data:image/${image.mime};base64,${image.data}`]);
        }).catch((e) => {
            console.log(e);
        });
    }

    useLayoutEffect(() => {
        ImagePicker.clean().then(() => {
            //console.log('removed all tmp images from tmp directory');
        }).catch(e => {
            alert(e);
        });
    }, []);

    //render
    return (
        <StyledModal
            isOpen={open}
            onClosed={close}
            backdropOpacity={0.4}
            position="bottom"
            coverScreen={true}
        >
            <StyledHeader>
                <StyledCloseButton name="close" size={20} color="#999" onPress={close}/>
            </StyledHeader>
            <StyledTitle>{title}</StyledTitle>
            <StyledBody>
                <StyledCameraButton suppressHighlighting={true} onPress={connectCamera}>사진 찍기</StyledCameraButton>
                <StyledAlbumButton suppressHighlighting={true} onPress={connectAlbum}>사진 선택</StyledAlbumButton>
            </StyledBody>
        </StyledModal>
    )
});

//------------------------------- STYLE --------------------------------
const StyledModal = styled(Modal)`
    height:200px;
    border-top-right-radius:25px;
    border-top-left-radius:25px;    
    padding:10px;
`;
const StyledHeader = styled.View`
`;
const StyledCloseButton = styled(Icon)`
    align-self:flex-end;
    margin:10px;
`;
const StyledTitle = styled.Text`
    align-self:center;
    font-weight:500;
`;
const StyledBody = styled.View`
    flex-direction:row;
    align-self:center;
    margin:10px;
`;
const StyledCameraButton = styled.Text`
    flex:1;
    font-weight:500;
    color:#F33562;
    padding:15px;
    border-color:#F33562;
    border-width:1px;
    margin:10px;
    border-radius:10px;
    text-align:center;
`;
const StyledAlbumButton = styled.Text`
    flex:1;
    border-color:#F33562;
    border-width:1px;
    font-weight:500;
    color:#fff;
    background:#F33562;
    padding:15px;
    margin:10px;
    border-radius:10px;
    overflow:hidden;
    text-align:center;
`;
/*
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
*/