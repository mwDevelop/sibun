//------------------------------ MODULE --------------------------------
import { useState, useLayoutEffect } from 'react';
import { permissionCheck } from '@/lib';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

//---------------------------- COMPONENT -------------------------------
export default function PermissionCard(){
    //init
    const navigation = useNavigation();
    const permissions = [
        ['location', '내 주변 즉시방문 가능한 매장을 알려드려요!'],
        ['camera', '매장 리뷰를 위한 카메라 사용이 필요해요!'],
        ['photo', '사진등록을 위한 저장소 사용이 필요해요!'],
    ]

    //state
    const [cardTitle, setCardTitle] = useState(permissions[0][1]);

    //function
    const recursiveReq = (cnt) => {
        try{
            permissionCheck(permissions[cnt][0]).then((data) => {
                try{
                    cnt++; 
                    if(cnt >= permissions.length) return navigation.replace("Login");
                    setCardTitle(permissions[cnt][1]);
                    recursiveReq(cnt);
                }catch(e){
                    return;
                }
                return;
            });
        }catch(e){
            console.log(e);
        }
    }

    //effect
    useLayoutEffect(() => {
        setTimeout(() => {
            recursiveReq(0);
        }, 300);
    }, []);

    //render
    return(
        <StyledConatainer>
            <StyledHeaderText>{cardTitle}</StyledHeaderText>
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1
    background:#111;
    padding:10%;
`;
const StyledHeaderText = styled.Text`
    font-weight:bold;
    color:#fff;
    font-size:25px;
`;