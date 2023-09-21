//------------------------------ MODULE --------------------------------
import { useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
import { alertDefaultSetting } from '@/data/constants';
import { logout } from '@/lib';
import { useUserMutate } from '@/hooks';

//---------------------------- COMPONENT -------------------------------
export default function Leave(){
    //init
    const navigation = useNavigation();
    const userMutation = useUserMutate();

    //state
    const [leaveAlert, setLeaveAlert] = useState(false);
    const [checkList, setCheckList] = useState(
        [
            {
                title: "사용을 잘 안하게 돼요",
                checked:false
            },
            {
                title: "예약하고 싶은 매장이 없어요",
                checked:false
            },
            {
                title: "예약, 취소, 혜택받기 등 사용이 어려워요",
                checked:false
            },
            {
                title: "혜택(쿠폰, 포인트)이 너무 적어요",
                checked:false
            },
            {
                title: "개인정보 보호를 위해 삭제할 정보가 있어요",
                checked:false
            },
            {
                title: "기타",
                checked:false
            },                                                            
        ]
    );

    //function
    const check = (idx) => {
        const copyList = [...checkList];
        copyList[idx].checked = !copyList[idx].checked;
        setCheckList(copyList);
    }

    const leave = async() => {
        try{
            userMutation.mutate({type:"remove"}, {onSuccess: async(res) => {
                if(res.data.result == "000"){
                    logout(() => navigation.reset({routes: [{name: "Login", params:{expired: '회원탈퇴가 완료되었습니다.'}}]}));
                }else{
                }
            }});
        }catch(e){
            console.log(e);
        }
    }

    //memo
    const headerGear = useMemo(() => (
        <StyledHeader>
            <StyledHeaderTitle>
                <StyledHighLightText>선톡</StyledHighLightText>을 탈퇴하는 이유가 {"\n"}무엇인가요?
            </StyledHeaderTitle>
        </StyledHeader>
    ), []);

    const bodyGear = useMemo(() => (
        <StyledBody>
            {
                checkList.map((item, index) => (
                    <StyledItem onPress={() => check(index)} key={index}>
                        <StyledItemTitle>{item.title}</StyledItemTitle>
                        <StyledItemCheckBox checked={item.checked}>
                            <StyledItemChkIcon name="chevron-down-sharp" checked={item.checked}/>
                        </StyledItemCheckBox>
                    </StyledItem>
                ))
            }
        </StyledBody>
    ), [checkList]);

    const footerGear = useMemo(() => (
        <StyledFooter>
            <StyledSubmitButton onPress={() => setLeaveAlert(true)}>
                <StyledSubmitButtonText>탈퇴하기</StyledSubmitButtonText>
            </StyledSubmitButton>
        </StyledFooter>
    ), []);        

    const leaveAlertGear = useMemo(() => (
        <AwesomeAlert
            {...alertDefaultSetting}
            show={leaveAlert}
            title="정말로 떠나실건가요?"
            message="예약내역 및 회원정보가 모두 삭제됩니다"
            confirmText="떠나기"
            onCancelPressed={() => {
                setLeaveAlert(false);
            }}
            onConfirmPressed={() => {
                setLeaveAlert(false);
                leave();
            }}
            onDismiss={() => {
                setLeaveAlert(false);
            }}
        />
    ), [leaveAlert]);

    //render
    return (
        <StyledConatainer>
            {headerGear}
            {bodyGear}
            {footerGear}
            {leaveAlertGear}
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    justify-content:space-between;
    background:white;
`;
const StyledHeader = styled.View`
    height:180px;
    justify-content:center;
`;
const StyledHeaderTitle = styled.Text`
    font-size:25px;
    font-weight:600;
    padding:0 20px;
    color:#222;
`;
const StyledHighLightText = styled.Text`
    color:#F33562;
`;
const StyledBody = styled.View`
    flex:0.9;
    justify-content:space-between;
    padding: 0 35px;
    padding-bottom: 100px;
`;
const StyledItem = styled.TouchableOpacity`
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
`;
const StyledItemTitle = styled.Text`
    font-size:16px;
    color:#222;
    font-weight:500;
`;
const StyledItemCheckBox = styled.View`
    background:${(props) => props.checked ? '#F33562':'#F1F1F1'};
    border-radius:15px;
    width:20px;
    height:20px;
    align-items:center;
`;
const StyledItemChkIcon = styled(Icon)`
    font-size:18px;
    color:${(props) => props.checked ? '#FFF':'#B8B8B8'};
    margin-top:2px;
`;
const StyledFooter = styled.View`
    height:90px;
`;
const StyledSubmitButton = styled.TouchableOpacity`
    background:#222;
    height:100%;
    align-items:center;
    justify-content:center;
`;
const StyledSubmitButtonText = styled.Text`
    color:white;
    font-size:20px;
    font-weight:500;
`;