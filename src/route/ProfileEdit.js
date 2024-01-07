//------------------------------ MODULE --------------------------------
import { useLayoutEffect, useState, useMemo } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import DatePicker from 'react-native-date-picker';
import { apiCall, timeToText, mobileMask, numberFilter, specialCharFilter } from '@/lib';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { StopWatch, ProfileImage } from '@/component';
import { globalMsg, mailList } from '@/data/constants';
import { ProfileEditSaveAtom } from '@/data/global';
import { useRecoilState } from "recoil";
import Toast from 'react-native-toast-message';
import { useUser, useUserMutate } from '@/hooks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//---------------------------- COMPONENT -------------------------------
export default function ProfileEdit(){
    //init
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const userMutation = useUserMutate();

    //atom
    const [saveFlag, setSaveFlag] = useRecoilState(ProfileEditSaveAtom);

    //data
    const [ userData ] = useUser();

    //state
    const [profileImg, setProfileImg] = useState(null);
    const [name, setName] = useState(null);
    const [gender, setGender] = useState('m');
    const [birth, setBirth] = useState(null);
    const [phone, setPhone] = useState('');
    const [realPhone, setRealPhone] = useState('');
    const [savePhone, setSavePhone] = useState('');
    const [mailFront, setMailFront] = useState(null);
    const [mailRear, setMailRear] = useState(null);
    const [pin, setPin] = useState('');
    const [dateModalOpen, setDateModalOpen] = useState(false);
    const [realMailList, setRealMailList] = useState(mailList);
    const [initMailId, setInitMailId] = useState(null);

    /* status : ready -> refresh -> ing -> (certPass or certFail or certOver ) */
    const [phoneChk, setPhoneChk] = useState('ready'); 

    //function
    const loginExpired = () => navigation.reset({routes: [{name: "Login", params:{expired: '로그인 정보가 만료되었습니다'}}]});

    const imageUpload = (data) => {
        setProfileImg(data);
        setSaveFlag('active');
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

    const checkCert = async() => {
        try{
            let params = { receiver_cellphone:realPhone, auth_code:pin };
            const certResult = await apiCall.post('/auth/login/sms/check', {...params});
            if(certResult.data.result == "000") {
                setPhoneChk("certPass");
                setSavePhone(realPhone);
                result = true;
            }else if(certResult.data.result == "007") setPhoneChk("certFail");
            else setPhoneChk('error');
        }catch(e){
            console.log(e);
            setPhoneChk('error');
        }
    }

    const save = () => {
        let params = { 
            mb_name: name,
            mb_cellphone: savePhone,
            mb_gender: gender,
            mb_profile_img: profileImg,
            mb_birth: birth,
            mb_email: (mailFront && mailRear) ? (mailFront+"@"+mailRear) : null,
        };

        userMutation.mutate({type:"modify", params:params}, {onSuccess: async(res) => {
            if(res.data.result == "000"){
                Toast.show({
                    type: 'good',
                    text1: '프로필 정보가 변경되었습니다!',
                    topOffset: 120,
                    visibilityTime: 1000
                });
            }else{
            }
        }});
        /* save process end */
        setSaveFlag('ready');
    }

    //memo
    const profileImgGear = useMemo(() => {
        return(
            <StyledSection>
                <StyledSectionTitle>프로필 사진</StyledSectionTitle>
                <ProfileImage src={profileImg} changeHandler={imageUpload} customStyle={{alignSelf:"flex-start", marginTop:5, marginBottom:5}}/>
            </StyledSection>
        );
    }, [profileImg]);

    const nameGear = useMemo(() => {
        return(
            <StyledSection>
                <StyledSectionTitle>이름</StyledSectionTitle>
                <StyledInput value={name} onChangeText={(text) => setName(text)}/>
            </StyledSection>
        );
    }, [name]);    

    const genderGear = useMemo(() => {
        return(
            <StyledSection>
                <StyledSectionTitle>성별</StyledSectionTitle>
                <StyedButtonArea>
                    <StyledButtonText suppressHighlighting={true} selected={gender=="m"} onPress={() => setGender('m')}>남자</StyledButtonText>
                    <StyledButtonText suppressHighlighting={true} selected={gender=="w"} onPress={() => setGender('w')}>여자</StyledButtonText>
                </StyedButtonArea>
            </StyledSection>
        );
    }, [gender]);    

    const birthGear = useMemo(() => {
        const targetDate = birth || new Date;
        return(
            <StyledSection>
                <StyledSectionTitle>생년월일</StyledSectionTitle>
                <StyledBirthText suppressHighlighting={true} onPress={() => setDateModalOpen(true)}>{timeToText(targetDate, 'y  /  mm  /  dd')}</StyledBirthText>
            </StyledSection>
        );
    }, [birth]);

    const phoneGear = useMemo(() => {
        const chkEnabled = phoneChk == "ing" || phoneChk == "certFail";

        return(
            <StyledSection>
                <StyledSectionTitle>휴대폰번호</StyledSectionTitle>
                <StyledInput autoComplete="tel" maxLength={13} returnKeyType={'done'} keyboardType='numeric' value={mobileMask(phone)} onChangeText={(text) => setPhone(numberFilter(text))} />
                <StyledInputBox>
                <StyledInput maxLength={6} returnKeyType={'done'} keyboardType='numeric' value={pin} onChangeText={(text) => setPin(numberFilter(text))} />
                {
                    phoneChk == "ing" || phoneChk == "certFail" ? (
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
                <StyledInnerButton onPress={() => {sendCert(phone)}}>
                    <StyledInnerButtonText>인증번호 발송</StyledInnerButtonText>
                </StyledInnerButton>
                </StyledInputBox>
                <StyledOuterButton disabled={!chkEnabled} activeChk={chkEnabled} onPress={() => checkCert(/* 작업중 */)}>
                    <StyledOuterButtonText activeChk={chkEnabled}>인증확인</StyledOuterButtonText>
                </StyledOuterButton>
                <StyledInputMessage passed={phoneChk == "certPass"}>{phoneChk in globalMsg ? '* '+globalMsg[phoneChk] : ' '}</StyledInputMessage>
            </StyledSection>
        );
    }, [phone, phoneChk, pin]);

    const emailGear = useMemo(() => {
        return (
            <StyledSection>
                <StyledSectionTitle>이메일</StyledSectionTitle>
                <StyledEmailArea>
                    <StyledEmailFront value={mailFront} onChangeText={(text) => setMailFront(specialCharFilter(text))}/>
                    <StyledEmailMiddle>@</StyledEmailMiddle>
                    {
                        initMailId !== null ? 
                        <AutocompleteDropdown
                            clearOnFocus={false}
                            closeOnBlur={true}
                            closeOnSubmit={false}
                            initialValue={initMailId}
                            onSelectItem={(item) => setMailRear(item && item.title)}
                            onClear={(i) => {if(i === undefined) setMailRear(null)}}
                            onChangeText={(text) => setMailRear(text)}
                            dataSet={realMailList}
                            ClearIconComponent={null}
                            textInputProps={{
                                placeholder: 'example.com',
                            }}                        
                            inputContainerStyle={{
                                backgroundColor: '#fff',
                                borderRadius: 5,
                                height:50,
                                borderColor:'#eee',
                                borderWidth:1,
                                width:180,
                                alignItems:"center"
                            }}
                        /> : null
                    }                               
                </StyledEmailArea>
            </StyledSection>
        );
    }, [mailFront, mailRear, realMailList, initMailId]);

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
                    setDateModalOpen(false);
                    setBirth(date);
                    setSaveFlag("active");
                }}
                onCancel={() => {
                    setDateModalOpen(false)
                }}
            />
        )
    }, [dateModalOpen]);

    //effect
    useLayoutEffect(() => {
        setSaveFlag("ready");
    }, []);

    useLayoutEffect(() => {
        try{
            setProfileImg(userData.mb_profile_img);
            setName(userData.mb_name);
            setBirth(new Date(userData.mb_birth));
            setGender(userData.mb_gender);
            setPhone(userData.mb_cellphone);
            if(userData.mb_email){
                const mailArr = userData.mb_email.split("@");
                setMailFront(mailArr[0]);
                setMailRear(mailArr[1]);
                const idSearch = mailList.find((i) => i.title == mailArr[1]);
                if(idSearch){
                    setInitMailId(idSearch.id.toString());
                }else{
                    setRealMailList([...realMailList, {id:mailArr[1], title:mailArr[1]}]);
                    setInitMailId(mailArr[1]);
                } 
            }else{
                setInitMailId('');
            }
        }catch(e){
            console.log(e);
            loginExpired();
        } 
    }, [userData]);

    useLayoutEffect(() => {
        if(isFocused){
            //console.log("profileEdit");
        } 
    }, [isFocused]);

    useLayoutEffect(() => {
        if(saveFlag == 'execute') save();
    }, [saveFlag]);

    useLayoutEffect(() => {
        if(phoneChk == "refresh") setPhoneChk("ing");
    }, [phoneChk]);
    
    useLayoutEffect(() => { //save chk
        if(
            (name && name != userData.mb_name) ||
            (gender && gender != userData.mb_gender) ||
            (birth && timeToText(birth, 'y-mm-dd') != userData.mb_birth) ||
            (mailFront && mailRear && `${mailFront}@${mailRear}` != userData.mb_email) ||
            (savePhone && savePhone != userData.mb_cellphone)
        )
        {
            setSaveFlag('active');
        }else{
            setSaveFlag('ready');
        } 
    }, [name, gender, birth, mailFront, mailRear, savePhone]);
    
    //render
    return(
        <StyledWindow enableOnAndroid>
            <StyledConatainer>
                    {profileImgGear}
                    {nameGear}
                    {genderGear}
                    {birthGear}
                    {emailGear}
                    {phoneGear}
                    {dateModalGear}
            </StyledConatainer>                
        </StyledWindow>
    );
}

//------------------------------- STYLE --------------------------------
const StyledWindow = styled(KeyboardAwareScrollView)`
    background-color:#fff;
    flex:1;
`;
const StyledConatainer = styled.View`
    margin:10px 20px;
`;
const StyledSection = styled.View`
    margin:8px 0;
`;
const StyledSectionTitle = styled.Text`
    color:#7D7D7D;
    margin:3px 0;
`;
const StyledInput = styled.TextInput`
    height:50px;
    border-color:#eee;
    border-width:1px;
    border-radius:5px;
    padding:0 18px;
    margin:5px 0;
`;
const StyledInnerButton = styled.TouchableOpacity`
    position:absolute;
    top:0;
    bottom:0;
    margin:10px 0;
    right:10px;
    border-color:#D9D9D9;
    border-width:1px;
    padding:0 10px;
    border-radius:20px;
    justify-content:center;
`;
const StyledInputBox = styled.View`
    justify-content:center;
`;
const StyledInnerButtonText = styled.Text`
    color:#444;
    font-size:13px;
    line-height:26px;
`;
const StyledOuterButton = styled.TouchableOpacity`
    height:50px;
    align-items:center;
    justify-content:center;
    background:${(props) => props.activeChk ? "#444" : "#F0F0F0"};
    border-radius:5px;
    margin:5px 0;
`;
const StyledOuterButtonText = styled.Text`
    color:${(props) => props.activeChk ? "#FFF" : "#BBB"};
`;
const StyledInputMessage = styled.Text`
    color:${(props) => props.passed ? '#2D5198' : 'red'};
    font-size:10px;
    font-weight:600;
    margin: 2px 0;
`;
const StyedButtonArea = styled.View`
    margin-top:5px;
    flex-direction:row;
    border-width:1px;
    border-color:#eee;
    width:130px;
    border-radius:5px;
    align-items:center;
    overflow:hidden;
`;
const StyledButtonText = styled.Text`
    background:${(props) => props.selected? '#F33562': '#fff'};
    color:${(props) => props.selected? '#fff': '#555'};
    width:64px;
    text-align:center;
    line-height:50px;
    font-weight:600;
`;
const StyledEmailArea = styled.View`
    flex-direction:row;
    height:50px;
    border-color:#fff;
    border-width:1px;
    border-radius:5px;
    margin:5px 0;
    align-items:center;
`;
const StyledEmailFront = styled.TextInput`
    height:50px;
    border-color:#eee;
    border-width:1px;
    border-radius:5px;
    flex:0.8;
    padding:0 18px;
`;
const StyledEmailMiddle = styled.Text`
    flex:0.2;
    text-align:center;
    font-size:20px;
    color:#555;
`;
const StyledBirthText = styled.Text`
    height:50px;
    border-color:#eee;
    border-width:1px;
    border-radius:5px;
    padding:0 18px;
    margin:5px 0;
    line-height:48px;
`;
