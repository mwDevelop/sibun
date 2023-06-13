//------------------------------ MODULE --------------------------------
import { permissionCheck } from '@/lib';
import { useEffect } from 'react';
import { MapView } from '@/component';
import { Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

//---------------------------- COMPONENT -------------------------------
export default function Search(){
    //init
    const isFocused = useIsFocused();

    //effect
    useEffect(() => {
        permissionCheck(Platform.OS, 'location');
        if(isFocused) console.log('Search');
    }, [isFocused]);

    //render
    return (
        <MapView/>
    )
}

//------------------------------- STYLE --------------------------------
