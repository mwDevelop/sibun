//------------------------------ MODULE --------------------------------
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import styled from 'styled-components/native';

//------------------------------ Config --------------------------------
export default toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
        />
    ),
    error: (props) => (
        <ErrorToast
            {...props}
        />
    ),
    good: ({text1, props}) => (
        <StyledView style={{backgroundColor:"#0F9D58"}}>
            <StyledText>😄  {text1}</StyledText>
        </StyledView>
    ),
    bad: ({text1, props}) => (
        <StyledView style={{backgroundColor:"#4285F4"}}>
            <StyledText>😣  {text1}</StyledText>
        </StyledView>
    ),    
    normal: ({text1, props}) => (
        <StyledView style={{backgroundColor:"#F4B400"}}>
            <StyledText>🤖  {text1}</StyledText>
        </StyledView>
    ),        
    error: ({text1, props}) => (
        <StyledView style={{backgroundColor:"#DB4437"}}>
            <StyledText>👿  {text1}</StyledText>
        </StyledView>
    ),            
    plain: ({text1, props}) => (
        <StyledView style={{backgroundColor:"#7D7D7D", borderRadius:10}}>
            <StyledText style={{paddingTop:3, paddingBottom:3, paddingRight:15, paddingLeft:15, textAlign:'center'}}>{text1}</StyledText>
        </StyledView>
    ),            
}

//------------------------------- STYLE --------------------------------
const StyledView = styled.View`
    padding:10px 30px;
    border-radius:30px;
`;
const StyledText = styled.Text`
    align-items:center;
    justify-content:center;
    color:white;
`;