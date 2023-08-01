//------------------------------ MODULE --------------------------------
import { useState, useLayoutEffect, useRef } from 'react';
import { Text } from 'react-native';

//---------------------------- COMPONENT -------------------------------
export default function StopWatch({limit=300, endEvent = () => {console.log("stopped")}, format="hh:ii:ss", customStyle = {}}){
    //init
    const intervalRef = useRef();

    //state
    const [leftSec, setLeftSec] = useState(limit);

    //function
    const timeFormat = (rawSec) => {
        let target = format;

        const matchObj = {
            h : parseInt(rawSec/3600),
            i : parseInt((rawSec%3600)/60),
            s : rawSec%60
        }

        for(const [key, value] of Object.entries(matchObj)){
            if(target.includes(`${key}${key}`)) target = target.replace(`${key}${key}`,value < 10 ? '0'+value : value);
            if(target.includes(key)) target = target.replace(key,value);        
        }
        
        return target;
    }

    //effect
    useLayoutEffect(() => {
        intervalRef.current = setInterval(() => {
            setLeftSec(leftSec => leftSec-1);
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, []);

    useLayoutEffect(() => {
        if(leftSec < 1) {
            clearInterval(intervalRef.current);
            endEvent();
        }
    }, [leftSec]);

    //render
    return (
        <Text style={customStyle}>{timeFormat(leftSec)}</Text>
    );
}
