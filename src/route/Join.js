//------------------------------ MODULE --------------------------------
import { useLayoutEffect, useState, useMemo, useRef } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import DatePicker from 'react-native-date-picker';
import { timeToText } from '@/lib';
import { StopWatch } from '@/component';
import { globalMsg } from '@/data/constants';
import { apiCall, mobileMask, numberFilter, specialCharFilter } from '@/lib';

//---------------------------- COMPONENT -------------------------------
export default function Join({route}){
    //init
    const navigation = useNavigation();
    const { page } = route.params;
    const  joinInfo = page ? route.params.joinInfo : { phoneData : '', nameData : '', genderData : 'm', birthData : ''}; //default datas
    const endPage = 2;
    const titleList = [
        "휴대폰번호를\n인증해 주세요",
        "정보를\n입력해 주세요",
        "이메일을\n입력해 주세요",
    ];

    //ref
    const nameInput = useRef(null);

    //state
    const [phone, setPhone] = useState(joinInfo.phoneData);
    const [realPhone, setRealPhone] = useState(joinInfo.phoneData);
    const [pin, setPin] = useState('');
    const [name, setName] = useState(joinInfo.nameData);
    const [dateModalOpen, setDateModalOpen] = useState(false);
    const [gender, setGender] = useState(joinInfo.genderData);
    const [birth, setBirth] = useState(joinInfo.birthData);
    const [mailFront, setMailFront] = useState(joinInfo.mailFront);
    const [mailRear, setMailRear] = useState(joinInfo.mailRear);

    /* status : ready -> refresh -> ing -> (certPass or certFail or certOver ) */
    const [phoneChk, setPhoneChk] = useState('ready'); 
    const [infoChk, setInfoChk] = useState(''); 

    //function
    const moveNext = async() => {
        if(page == endPage){ //the last page
            console.log({mail:mailFront+"@"+mailRear, ...joinInfo});
            /* post data to server and make joininig target member ...... */
            return navigation.replace("JoinSuccess");
        }

        if(page == 0){ //phone chk
            if(!phone) return setPhoneChk("isNotPhone");
            if(!realPhone) return setPhoneChk("needCert");
            if(!pin) return setPhoneChk("isNotCert");

            const certResult = await checkCert(realPhone, pin);
            if(!certResult) return;
        }
        if(page == 1){ //name, birth, gender chk
            if(!name) return setInfoChk("isNotName");
            if(!birth) return setInfoChk("isNotBirth");
        }
        relayObj = {
            phoneData : realPhone,
            nameData : name,
            genderData : gender,
            birthData : birth,
        }
        navigation.replace("로그인 / 회원가입", {page:page+1, joinInfo : relayObj});   
    }

    const sendCert = async(p) => {
        if(p){
            setPin('');
            try{
                // send
                if(p.length < 10) return setPhoneChk('isNotFormal');
                let params = { receiver_cellphone:p };
                const sendResult = await apiCall.post('/auth/login/sms/send', {...params});      
                if(sendResult.data.result === "000"){
                    setPhoneChk('refresh'); 
                    setRealPhone(p);
                }else{
                    setPhoneChk('error'); 
                }
            }catch(e){
                console.log(e);
                setPhoneChk('error'); 
            }
        }else{
            setPhoneChk('isNotPhone');
        };
    }

    const checkCert = async(p, code) => {
        let result = false;
        try{
            let params = { receiver_cellphone:p, auth_code:code };
            const certResult = await apiCall.post('/auth/login/sms/check', {...params});
            if(certResult.data.result == "000") {
                setPhoneChk("certPass");
                result = true;
            }else if(certResult.data.result == "007") setPhoneChk("certFail");
            else setPhoneChk('error');
        }catch(e){
            console.log(e);
            result = false;
        }
        return result;
    }

    //memo
    const phoneGear = useMemo(() => {
        return (
            <>
                <StyledInput returnKeyType={'done'} maxLength={13} keyboardType='numeric' value={mobileMask(phone)} onChangeText={(text) => setPhone(numberFilter(text))} placeholder="휴대폰 번호 입력"/>
                <StyledInput returnKeyType={'done'} maxLength={6} keyboardType='numeric' value={pin} onChangeText={(text) => setPin(numberFilter(text))} placeholder="인증번호"/>
                {
                    phoneChk == "ing" || phoneChk == "certFail" || phoneChk == "isNotCert" ? (
                        <StopWatch 
                            limit={180}
                            format="i:ss"
                            customStyle={{
                                position:'absolute',
                                color:'#FF3A46',
                                top:'60%',
                                right:'35%'
                            }}
                            endEvent = {() => setPhoneChk("certOver")}
                        />                           
                    ) : null
                }
                <StyledInnerButton onPress={() => sendCert(phone)}>
                    <StyledInnerButtonText>인증번호 발송</StyledInnerButtonText>
                </StyledInnerButton>
                <StyledInputMessage passed={phoneChk == "certPass"}>{phoneChk in globalMsg ? '* '+globalMsg[phoneChk] : ' '}</StyledInputMessage>
            </>
        );
    }, [phone, pin, phoneChk]);

    const infoGear = useMemo(() => {
        const targetDate = birth || null;
        return (
            <>
                <StyledInput ref={nameInput} value={name} onChangeText={(text) => setName(text)} placeholder="이름"/>
                <StyledInput onPressIn={() => setDateModalOpen(true)} value ={timeToText(targetDate, 'y  /  mm  /  dd')} placeholder="생년월일"/>
                <StyledButtonArea>
                    <StyledButtonText selected={gender == "m"} onPress={() => setGender('m')} suppressHighlighting={true}>남자</StyledButtonText>
                    <StyledButtonText selected={gender == "w"} onPress={() => setGender('w')} suppressHighlighting={true}>여자</StyledButtonText>
                </StyledButtonArea>
                <StyledInputMessage passed={false}>{infoChk in globalMsg ? '* '+globalMsg[infoChk] : ' '}</StyledInputMessage>
            </>
        )
    }, [birth, name, gender, infoChk]);
    
    const emailGear = useMemo(() => {
        return (
            <>
                <StyledEmailArea>
                    <StyledInput style={{flex:1}} value={mailFront} onChangeText={(text) => setMailFront(specialCharFilter(text))}/>
                    <StyledEmailMiddleText>
                        @
                    </StyledEmailMiddleText>
                    <AutocompleteDropdown
                        clearOnFocus={false}
                        closeOnBlur={true}
                        closeOnSubmit={false}
                        //initialValue={{ id: '1' }}
                        onSelectItem={(v) => setMailRear(v && v.title)}
                        onChangeText={(v) => setMailRear(v)}
                        dataSet={[
                            { id: '1', title: 'gmail.com' },
                            { id: '2', title: 'naver.com' },
                            { id: '3', title: 'daum.net' },
                            { id: '4', title: 'hanmail.net' },
                            { id: '5', title: 'yahoo.co.kr' },
                        ]}
                        textInputProps={{
                            placeholder: 'example.com',
                        }}                        
                        inputContainerStyle={{
                            backgroundColor: '#fff',
                            borderRadius: 5,
                            height:50,
                            borderColor:'#eee',
                            borderWidth:1,
                            width:170,
                            alignItems:"center",
                        }}
                    />    
                </StyledEmailArea>
            </>
        )
    }, [mailFront, mailRear]);   
    
    const dateModalGear = useMemo(() => {
        const selectedDate = birth || new Date();
        return (
            <DatePicker
                modal
                open={dateModalOpen}
                date={selectedDate}
                mode="date"
                onConfirm={(date) => {
                    setDateModalOpen(false);
                    setBirth(date);
                }}
                onCancel={() => {
                    setDateModalOpen(false)
                }}
            />
        )
    }, [dateModalOpen]);

    const memoGroup = [phoneGear, infoGear, emailGear];

    //effect
    useLayoutEffect(() => {
    }, []);

    useLayoutEffect(() => {
        if(phoneChk == "refresh") setPhoneChk("ing");
    }, [phoneChk]);

    //render
    return (
        <StyledConatainer>
            <StyledHeader>
                <StyledHeaderTitle>
                    <StyledHeaderTitleText>
                        {titleList[page]}
                    </StyledHeaderTitleText>
                </StyledHeaderTitle>                    
                <StyledHeaderPage>
                    <StyledHeaderPageFront>{page+1}</StyledHeaderPageFront>
                    <StyledHeaderPageRear>/3</StyledHeaderPageRear>
                </StyledHeaderPage>
            </StyledHeader>
            <StyledBody>
                <StyledSection>
                    {memoGroup[page]}
                </StyledSection>
            </StyledBody>
            <StyledFooter>
                <StyledFooterNext onPress={moveNext}>
                    <StyledFooterNextText>
                        {page < endPage? "다음" : "완료"}
                    </StyledFooterNextText>
                    <StyledFooterNextIcon name="chevron-forward"/>
                </StyledFooterNext>
            </StyledFooter>
            {dateModalGear}
        </StyledConatainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    flex:1;
    background:white;
    padding:10px 20px;
`;
const StyledHeader = styled.View`
    flex:0.15;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
`;
const StyledHeaderTitle = styled.View`
`;
const StyledHeaderTitleText = styled.Text`
    font-size:20px;
    font-weight:600;
`;
const StyledHeaderPage = styled.View`
    flex-direction:row;
`;
const StyledHeaderPageFront = styled.Text`
    color:#F33562;
    font-size:16px;
    font-weight:500;
`;
const StyledHeaderPageRear = styled.Text`
    color:#7D7D7D;
    font-size:16px;
    font-weight:500;
`;
const StyledBody = styled.View`
    flex:0.7;
`;
const StyledFooter = styled.View`
    flex:0.15;
    align-items:flex-end;
`;
const StyledFooterNext = styled.TouchableOpacity`
    flex-direction:row;
    align-items:center;
`;
const StyledFooterNextText = styled.Text`
    font-size:16px;
    font-weight:500;
`;
const StyledFooterNextIcon = styled(Icon)`
    font-size:24px;
    margin-left:10px;
`;
const StyledSection = styled.View`
`;
const StyledInput = styled.TextInput`
    width:100%;
    height:50px;
    background:#ECECEC;
    border-radius:5px;
    margin:5px 0;
    padding:0 20px;
`;
const StyledEmailArea = styled.View`
    flex-direction:row;
    align-items:center;
`;
const StyledEmailMiddleText = styled.Text`
    text-align:center;
    font-size:20px;
    color:#555;
    line-height:50px;
    flex:0.2;
`;
const StyledInnerButton = styled.TouchableOpacity`
    background: #fff;
    position:absolute;
    top:53%;
    right:5%;
    border-radius:50px;
    padding:10px;
    border-width:1px;
    border-color:#D9D9D9;
`;
const StyledInnerButtonText = styled.Text`
    color:#444;
    font-size:12px;
`;
const StyledInputMessage = styled.Text`
    color:${(props) => props.passed ? '#2D5198' : 'red'};
    font-size:10px;
    font-weight:600;
    margin: 2px 0;
`;
const StyledButtonArea = styled.View`
    flex-direction:row;
    justify-content:space-between;
    margin: 5px 0;
`;
const StyledButtonText = styled.Text`
    width:48%;
    line-height:48px;
    border-radius:5px;
    overflow:hidden;
    background:${(props) => props.selected ? "#F33562" : "#fff"};
    color:${(props) => props.selected ? "#fff" : "#222"};;
    border-width:1px;
    border-color:#D9D9D9;
    font-size:14px;
    font-weight:400;
    text-align:center;
`;