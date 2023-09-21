//------------------------------ MODULE --------------------------------
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Animated } from 'react-native';

//---------------------------- COMPONENT -------------------------------
export default function CustomSelect({option = [], selected=0, onSelect=() => {}, align='end', width=100}){
    //init
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const xAnim = useRef(new Animated.Value(width/1.5)).current;
    const yAnim = useRef(new Animated.Value(-width)).current;

    //state
    const [selectedId, setSelectedId] = useState(selected);
    const [open, setOpen] = useState(false);

    //function
    const selectOption = (i) => {
        setSelectedId(i);
        setOpen(false);
    }

    const fadeExcute = (v, d) => {
        Animated.spring(fadeAnim, {
            toValue : v,
            friction : d,
            useNativeDriver : true
        }).start();
    }

    const scaleExcute = (v, d) => {
        Animated.spring(scaleAnim, {
            toValue : v,
            friction : d,
            useNativeDriver : true
        }).start();
    }

    const xExcute = (v, d) => {
        Animated.spring(xAnim, {
            toValue : v,
            friction : d,
            useNativeDriver : true
        }).start();        
    }

    const yExcute = (v, d) => {
        Animated.spring(yAnim, {
            toValue : v,
            friction : d,
            useNativeDriver : true
        }).start();        
    }    

    //effect
    useEffect(() => {
        onSelect(selectedId);
    }, [selectedId]);

    useEffect(() => {
        if(open){
            scaleExcute(1, 1000);
            fadeExcute(1, 100);
            xExcute(0, 1000);
            yExcute(0, 1000);
        }else{
            scaleExcute(0, 1000);
            fadeExcute(0, 100);
            xExcute(width/1.5, 1000);
            yExcute(-width, 1000);
        } 
    }, [open]);    

    //render
    return (       
        <StyledConatainer align={align} width={width}>
            <StyledSelected activeOpacity={1} onPress={() => setOpen(!open)}>
                <StyledSelectedText >
                    {option[selectedId]} <Icon name={`chevron-${open ? 'up' : 'down'}`}/>
                </StyledSelectedText>
            </StyledSelected>
            <StyledSelectBox width={width} style={[{opacity: fadeAnim}, {transform:[{scale: scaleAnim}, {translateX: xAnim}, {translateY: yAnim}]}]}>
                {option.map((item, index) => (
                    <StyledSelectRow key={index} align={align} onPress={() => selectOption(index)} firstRow={index==0}>
                        <StyledSelectRowText>
                            {item}
                        </StyledSelectRowText>
                    </StyledSelectRow>
                ))}
            </StyledSelectBox>
        </StyledConatainer>
    );
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    background:#fff;
    width:${(props) => props.width}px;
    align-items:flex-${(props) => props.align};
`;
const StyledSelected = styled.TouchableOpacity`
`;
const StyledSelectedText = styled.Text`
`;
const StyledSelectBox = styled(Animated.View)`
    display:flex;
    position:absolute;
    top:20px;
    background:#f8f8f8;
    z-index:1;
    width:${(props) => props.width}px;
    padding:0 5px;
    border-radius:10px;
`;
const StyledSelectRow = styled.TouchableOpacity`
    align-items:flex-${(props) => props.align};
    padding:5px 0;
    border-top-width:${(props) => props.firstRow ? '0' : '0.5'}px;
    border-color:#ccc;
`;
const StyledSelectRowText = styled.Text`
    color:#222;
`;