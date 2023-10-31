//------------------------------ MODULE --------------------------------
import React, {useState, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

//---------------------------- COMPONENT -------------------------------
//render
export default React.memo(({fullText='전체 동의', list=[], termsHandler=()=>{}}) => {
    //state
    const [fullAgree, setFullAgree] = useState(false);

    //function
    const fullCheck = (data) => {
        setFullAgree(data);
        termsHandler(list.map((item, index) => {
            const switchObj = {...item};
            switchObj.selected = data;
            return switchObj;
        }));
    }

    const eachCheck = (target, data) => {
        let extraChk = true;
        termsHandler(list.map((item, index) => {
            const switchObj = {...item};
            if(index===target) switchObj.selected = data;
            else if(extraChk) extraChk = switchObj.selected;
            return switchObj;
        }));
        setFullAgree(data && extraChk ? true : false);
    }

    //effect
    useLayoutEffect(() => {
        if(list?.length){
            let initFullChk = true;
            list.forEach((t) => {
                if(!t.selected) initFullChk = false;
            })
            setFullAgree(initFullChk);
        }
    },[]);

    //render
    return ( 
        <StyledConatainer>
            <StyledRow style={{backgroundColor:'#F5F5F5'}}>
                <StyledCheckBox name="checkbox" size={19} selected={fullAgree} suppressHighlighting={true} onPress={() => fullCheck(!fullAgree)}/>
                <StyledText style={{fontWeight:"700"}}>{fullText}</StyledText>
            </StyledRow>
            {
                list.map((item, index) => (
                    <StyledRow key={index}>  
                        <StyledCheckBox name="checkbox" size={19} selected={item.selected} onPress={() => eachCheck(index, !item.selected)} suppressHighlighting={true}/>
                        <StyledText>{item.title} {item.required? "(필수)" : "(선택)"}</StyledText>
                    </StyledRow>
                ))
            }
        </StyledConatainer>
    );
});

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
`;
const StyledRow = styled.View`
    padding:8px;
    border-radius:5px;
    flex-direction:row;
`;
const StyledCheckBox = styled(Icon)`
    color:${(props) => props.selected ? '#F33562' : '#D9D9D9'};
`;
const StyledText = styled.Text`
    line-height:19px;
    margin-left:10px;
    color:#444;
`;