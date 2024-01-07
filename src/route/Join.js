//------------------------------ MODULE --------------------------------
import { useLayoutEffect, useState, useMemo, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import DatePicker from 'react-native-date-picker';
import { StopWatch, ProfileImage, CheckBox } from '@/component';
import { globalMsg, mailList } from '@/data/constants';
import { apiCall, mobileMask, numberFilter, specialCharFilter, login, timeToText, errorAlert } from '@/lib';
import uuid from 'react-native-uuid';
import { useUserMutate } from '@/hooks';
import Modal from 'react-native-modalbox';

//---------------------------- COMPONENT -------------------------------
export default function Join({route}){
    //init
    const navigation = useNavigation();
    const userMutation = useUserMutate();
    const { page } = route.params;
    const relayInfo = page ? route.params.relayInfo : { 
        phoneData : '', 
        nameData : '', 
        genderData : 'm', 
        birthData : '', 
        mailFrontData : '', 
        mailRearData : '', 
        profileImgData: '',
        finalDestination : route.params.finalDestination
    }; //default datas
    const endPage = 2;
    const titleList = [
        ["휴대폰번호를\n인증해 주세요", "required"],
        ["정보를\n입력해 주세요", "required"],
        ["이메일을\n입력해 주세요", "selective"],
    ];

    //ref
    const nameInput = useRef(null);

    //state
    const [phone, setPhone] = useState(relayInfo.phoneData);
    const [realPhone, setRealPhone] = useState(relayInfo.phoneData);
    const [name, setName] = useState(relayInfo.nameData);
    const [gender, setGender] = useState(relayInfo.genderData);
    const [birth, setBirth] = useState(relayInfo.birthData);
    const [mailFront, setMailFront] = useState(relayInfo.mailFrontData);
    const [mailRear, setMailRear] = useState(relayInfo.mailRearData);
    const [profileImg, setProfileImg] = useState(relayInfo.profileImgData);
    const [finalDestination, setFinalDestination] = useState(relayInfo.finalDestination);
    const [pin, setPin] = useState('');
    const [dateModalOpen, setDateModalOpen] = useState(false);
    const [termsModalOpen, setTermsModalOpen] = useState(false);
    /* status : ready -> refresh -> ing -> (certPass or certFail or certOver ) */
    const [phoneChk, setPhoneChk] = useState('ready'); 
    const [infoChk, setInfoChk] = useState(''); 
    const [terms, setTerms] = useState([ //doesn't need to be registered to relayInfo cuz the state would change on the last page
        {title: "선톡 이용약관", desc:"terms1", required:true, selected:false},
        {title: "개인(신용)정보 이용", desc:"terms2", required:true, selected:false},
        {title: "마케팅 수신동의 이용약관", desc:"terms3", required:false, selected:false},
    ]);

    //function
    const finalSave = async() => {
        //terms check
        let agreementChk = true;
        terms.forEach((t) => {if(agreementChk && t.required && !t.selected) agreementChk = false}); //case required denied
        if(!agreementChk) return console.log("denied!");

        /* post data to server and make joininig target member ...... */
        let params = { 
            mb_id: uuid.v4().substring(0,18),
            mb_passwd: uuid.v4().substring(0,18),
            mb_cellphone: realPhone,
            mb_name: name,
            mb_gender: gender,
            mb_birth: birth,
            mb_profile_img: profileImg,
            mb_email: (mailFront && mailRear) ? mailFront+"@"+(mailRear) : null,
            mb_marketing_yn: terms[2].selected ? "y" : "n"
        };

        userMutation.mutate({type:"add", params:params}, {onSuccess: async(res) => {
            if(res.data.result == "000"){
                const loginResult = await login(realPhone);
                if(loginResult == "success") navigation.reset({routes: [{name: "JoinSuccess", params:{name:name, destination:finalDestination}}]});
                else errorAlert('로그인 과정에서', () => navigation.reset({routes: [{name: "Login"}]}));
            }else{
                errorAlert("회원가입 과정에서", () => navigation.reset({routes: [{name: "Login"}]}));
            }
        }});
        return;
    }

    const moveNext = async() => {
        try{
            if(page == endPage){ //the last page
                setTermsModalOpen(true);
                return;
            }
    
            if(page == 0){ //phone chk
                if(!phone) return setPhoneChk("isNotPhone");
                if(!realPhone) return setPhoneChk("needCert");
                if(!pin) return setPhoneChk("isNotCert");
    
                const certResult = await checkCert(realPhone, pin);
                if(!certResult) return;

                /* try login */
                const loginResult = await login(realPhone);
                if(loginResult == "success") {
                    return navigation.reset({routes: [{name: finalDestination}]});
                }
                if(loginResult == "error") return errorAlert('', () => navigation.reset({routes: [{name: "Login"}]}));
                if(loginResult == "join") console.log("join"); //continue to next block
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
                mailFrontData : mailFront,
                mailRearData : mailRear,
                profileImgData: profileImg,
                finalDestination : finalDestination,
            }
            navigation.replace("로그인 / 회원가입", {page:page+1, relayInfo : relayObj});
        }catch(e){
            console.log(e);
            errorAlert('', () => navigation.reset({routes: [{name: "Login"}]}));
        }
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
                <StyledInput 
                    returnKeyType={'done'} 
                    maxLength={13} 
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    value={mobileMask(phone)} 
                    onChangeText={(text) => 
                    setPhone(numberFilter(text))} 
                    placeholder="휴대폰 번호 입력"
                    placeholderTextColor='#aaa'
                />
                <StyledInputBox>
                <StyledInput 
                    returnKeyType={'done'} 
                    maxLength={4} 
                    keyboardType='numeric' 
                    value={pin} 
                    onChangeText={(text) => setPin(numberFilter(text))} 
                    placeholder="인증번호" 
                    placeholderTextColor='#aaa'
                    style={{
                        letterSpacing: 10,
                    }}
                />
                {
                    phoneChk == "ing" || phoneChk == "certFail" || phoneChk == "isNotCert" ? (
                        <StopWatch 
                            limit={180}
                            format="i:ss"
                            customStyle={{
                                position:'absolute',
                                color:'#FF3A46',
                                right:120
                            }}
                            endEvent = {() => setPhoneChk("certOver")}
                        />                           
                    ) : null
                }
                <StyledInnerButton onPress={() => sendCert(phone)}>
                    <StyledInnerButtonText>인증번호 발송</StyledInnerButtonText>
                </StyledInnerButton>                
                </StyledInputBox>
                <StyledInputMessage passed={phoneChk == "certPass"}>{phoneChk in globalMsg ? '* '+globalMsg[phoneChk] : ' '}</StyledInputMessage>
            </>
        );
    }, [phone, pin, phoneChk]);

    const infoGear = useMemo(() => {
        const targetDate = birth || null;
        return (
            <>
                <ProfileImage src={profileImg} changeHandler={setProfileImg}/>
                <StyledInput ref={nameInput} value={name} onChangeText={(text) => setName(text)} placeholder="이름" placeholderTextColor="#aaa" style={{marginTop:25}}/>
                <StyledDateText onPress={() => setDateModalOpen(true)} style={{color : targetDate ? 'black' : '#aaa'}} suppressHighlighting={true}>
                    {targetDate ? timeToText(targetDate, 'y  /  mm  /  dd') : '생년월일'}
                </StyledDateText>
                <StyledButtonArea>
                    <StyledButtonText selected={gender == "m"} onPress={() => setGender('m')} suppressHighlighting={true}>남자</StyledButtonText>
                    <StyledButtonText selected={gender == "w"} onPress={() => setGender('w')} suppressHighlighting={true}>여자</StyledButtonText>
                </StyledButtonArea>
                <StyledInputMessage passed={false}>{infoChk in globalMsg ? '* '+globalMsg[infoChk] : ' '}</StyledInputMessage>
            </>
        )
    }, [profileImg, birth, name, gender, infoChk]);
    
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
                        dataSet={mailList}
                        textInputProps={{
                            placeholder: 'example.com',
                            placeholderTextColor:"#aaa"
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
                locale='ko-KR'
                open={dateModalOpen}
                date={selectedDate}
                mode="date"
                onConfirm={(date) => {
                    setBirth(date);
                    setDateModalOpen(false);
                }}
                onCancel={() => {
                    setDateModalOpen(false)
                }}
            />
        )
    }, [dateModalOpen]);

    const termsModalGear = useMemo(() => (
        <StyledTermsModal
            isOpen={termsModalOpen}
            onClosed={() => {setTermsModalOpen(false)}}
            backdropOpacity={0.4}
            position="bottom"
        >
            <StyledTermsView>
                <CheckBox list={terms} termsHandler={setTerms}/>
                <StyledSubmit suppressHighlighting={true} onPress={finalSave}>확인</StyledSubmit>
            </StyledTermsView>
        </StyledTermsModal>
    ), [termsModalOpen, terms]);

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
                        {titleList[page][0]}
                        <StyledRequired>  ({titleList[page][1] == 'required' ? '필수' : '선택'})</StyledRequired>
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
            {page == 1 ? dateModalGear : null}
            {page == 2 ? termsModalGear : null}
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
    line-height:33px;
    font-weight:500;
`;
const StyledFooterNextIcon = styled(Icon)`
    font-size:24px;
    margin-left:10px;
`;
const StyledSection = styled.View`
`;
const StyledInputBox = styled.View`
    justify-content:center;
`;
const StyledInput = styled.TextInput`
    width:100%;
    height:50px;
    background:#ECECEC;
    border-radius:5px;
    margin:5px 0;
    padding:0 20px;
`;
const StyledDateText = styled.Text`
    width:100%;
    line-height:48px;
    background:#ECECEC;
    border-radius:5px;
    margin:5px 0;
    padding:0 20px;
    overflow:hidden;
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
    top:0;
    bottom:0;
    justify-content:center;
    margin:10px 0;
    right:15px;
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
const StyledTermsModal = styled(Modal)`
    height:300px;
    border-top-right-radius:25px;
    border-top-left-radius:25px;
`;
const StyledTermsView = styled.View`
    padding:20px;
`;
const StyledSubmit = styled.Text`
    border-radius:5px;
    line-height:48px
    background:#F33562;
    overflow:hidden;
    text-align:center;
    color:#fff;
    font-size:16px;
    font-weight:600;
    margin-top:20px;
`;
const StyledRequired = styled.Text`
    color:#999;
    font-size:14px;
`;