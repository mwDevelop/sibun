//------------------------------ MODULE --------------------------------
import NaverMapView, { Marker } from 'react-native-nmap';
import { CustomInnerLoading } from '@/component';
import { map_loading } from '@/assets/animation';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { map_target, map_list } from '@/assets/img';
import { useRef, useLayoutEffect, useMemo, useState, useEffect } from 'react';
import Geolocation from "react-native-geolocation-service";
import { permissionCheck, timeToNumber } from '@/lib';
import { defaultLocation } from '@/data/constants';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { star_filled, golf_active, golf_heart_active, onerror } from '@/assets/img';
import { useNavigation } from '@react-navigation/native';
import { useRecoilState } from 'recoil';
import { DevicePositionAtom } from '@/data/global';
import Toast from 'react-native-toast-message';

//---------------------------- COMPONENT -------------------------------
export default function MapView({
    markerData = [], 
    onCenterChange = () => {}, 
    listOpen = () => {}, 
    targetStore=null,
}){
    //init
    const mapRef = useRef();
    const navigation = useNavigation();
    //const setPosition = useSetRecoilState(DevicePositionAtom);
    const [position, setPosition] = useRecoilState(DevicePositionAtom);

    //state
    const [shop, setShop] = useState(null);

    //function
    const selfTarget = async() => {
        try{
            const chkResult = await permissionCheck('location');//chk

            return (chkResult != "granted") ? //set location
                Toast.show({
                    type: 'bad',
                    text1: '위치정보 사용을 위해 권한을 허용해 주세요.',
                    topOffset: 120,
                    visibilityTime: 1000
                }) : 
                Geolocation.getCurrentPosition(
                    pos => {
                        const info = pos.coords;
                        const centerInfo = {latitude : info.latitude, longitude : info.longitude, zoom:14};
    
                        //move map
                        mapRef?.current.animateToCoordinate(centerInfo);

                        //save cache
                        setPosition(info);
                    },
                    error => {
                        console.log(error);
                        Toast.show({
                            type: 'bad',
                            text1: '다시 시도해 주세요'/*error.message*/,
                            topOffset: 120,
                            visibilityTime: 1000
                        });                                          
                    },
                    {
                        enableHighAccuracy: false,
                        timeout: 2000,
                        maximumAge: 0,
                    },
                );
        }catch(e){
            console.log(e);
        }
    }; 

    //memo
    const mapGear = useMemo(() => {
        return (
        <>
            <NaverMapView 
                ref = {mapRef}
                style={{width: '100%', height: '100%'}}
                showsMyLocationButton={false}
                center={defaultLocation}
                onCameraChange={e => onCenterChange({latitude:e.latitude, longitude:e.longitude, zoom:e.zoom, cover:e.coveringRegion})}
                minZoomLevel={13}
                maxZoomLevel={16}
                //nightMode={true}
                onTouch={e => setShop(null)}
                onMapClick={e => setShop(null)}
                useTextureView={true} /*Marker Disappearing Issue in android*/
            >   
            {
                markerData.map((item, index) => {
                    //const imageIcon = shop?.store_idx != item.store_idx ? (item.like ? golf_heart : golf) : (item.like ? golf_heart_active : golf_active);
                    const imageIcon = item.like ? golf_heart_active : golf_active;
                    //const imageWidth = item.like ? 43 : 35;
                    //const imageHeight = item.like ? 39 : 33;
                    return (
                        <Marker 
                            key={index}
                            coordinate={{latitude:Number(item.store_addr_y), longitude:Number(item.store_addr_x)}}
                            onClick={() => setShop(item)}
                            image={imageIcon}
                            width={item.like ? 34: 29}
                            height={31}
                            /*
                            caption={{
                                height:20,
                                width:20,
                                text: "TEST",
                                //align: Align,
                                textSize: 15,
                                color: "red",
                                //haloColor: "red",
                                //offset: number,
                                //requestedWidth: number,
                                //minZoom: number,
                                //maxZoom: number,
                            }}
                            onClick={() => console.warn('onClick! p0')}
                            */
                        />
                    )
                })
            }
            {
                position ? 
                <Marker //current position marker
                    coordinate={position}                
                    width={30}
                    height={40}
                    pinColor="blue"
                    caption={{
                        text: "내 위치",
                    }}
                /> : null
            }
                {/*<Path coordinates={[P0, P1]} onClick={() => console.warn('onClick! path')} width={10}/>*/}
                {/*<Polyline coordinates={[P1, P2]} onClick={() => console.warn('onClick! polyline')}/>*/}
                {/*<Circle coordinate={P0} color={"rgba(255,0,0,0.3)"} radius={200} onClick={() => console.warn('onClick! circle')}/>*/}
                {/*<Polygon coordinates={[P0, P1, P2]} color={`rgba(0, 0, 0, 0.5)`} onClick={() => console.warn('onClick! polygon')}/>*/}
            </NaverMapView>    
            <StyledCustomArea >
                <StyledButton onPress={selfTarget}>
                    <StyledTargetImage source={map_target}/>
                </StyledButton>
                <StyledButton onPress={() => listOpen(true)}>
                    <StyledListImage source={map_list}/>
                </StyledButton>
            </StyledCustomArea>
        </> 
        )
    }, [markerData, shop]);

    const shopGear = useMemo(() => {
        if(!shop) return null;

        const td = new Date().getDay() || 7;
        const now = Number(timeToNumber(new Date()));
        const tags = shop.store_amenities.split(',');

        //available filter
        if(
            Number(shop.store_open_time) < now && 
            Number(shop.store_close_time)-2 > now && //set 60 minutes(minimum usage) before until closed
            !(shop.store_closed_days.split(',').includes(String(td)))
        ) tags.unshift('즉시가능');

        //voucher filter
        if(shop.store_voucher_use_yn == 'y') tags.unshift('할인중');

        return (
            <StyledShopBox entering={FadeInDown.duration(300)}>
                <StyledShopTouch onPress={() => navigation.navigate('Desc', shop)} activeOpacity={1}>
                <StyledShopHeader>
                    <StyledShopImageBox>
                        <StyledShopImage source={shop.store_main_simg ? {uri:shop.store_main_simg} : onerror} resizeMode="cover" defaultSource={onerror}/>
                    </StyledShopImageBox>
                    <StyledShopReviewArea>
                        <StyledStarImage source={star_filled}/>
                        <StyledShopReviewText>
                            <StyledReviewHighLight> {Number(shop.store_review_avg).toFixed(1)} </StyledReviewHighLight> 리뷰 {shop.store_review_cnt}개
                        </StyledShopReviewText>
                    </StyledShopReviewArea>
                </StyledShopHeader>
                <StyledShopBody>
                    <StyledShopTitle>
                        {shop.store_name}
                    </StyledShopTitle>
                    <StyledShopAddr>
                        {shop.store_addr}
                    </StyledShopAddr>
                </StyledShopBody>
                <StyledShopFooter>
                    {
                        tags.map((t, i) => (t && i < 4) ? (
                            <StyledShopTag key={i} highligth={t=="할인중" || t=="즉시가능"}>{t}</StyledShopTag>
                        ) : (i == 4 ? <StyledPlusTagText key={i}>+{tags.length-4}</StyledPlusTagText> : null))
                    }
                </StyledShopFooter>
                </StyledShopTouch>
            </StyledShopBox>
        )
    }, [shop])

    //effect
    useEffect(() => {
        selfTarget();
    }, []);

    useLayoutEffect(() => {
        setShop(null);
    }, [markerData]);

    useLayoutEffect(() => {
        if(targetStore) mapRef.current.animateToCoordinate(targetStore);
    }, [targetStore]);

    //render
    return (
        <>
            <CustomInnerLoading lottie={map_loading} delay={3000}/>   
            {mapGear}
            {shopGear}
        </>
    )
}

//------------------------------- STYLE --------------------------------
const StyledCustomArea = styled.View`
    position:absolute;
    right:5%;
    top:3%;
`;
const StyledButton = styled.TouchableOpacity`
`;
const StyledTargetImage = styled(FastImage)`
    width:40px;
    height:40px;
`;
const StyledListImage = styled(FastImage)`
    width:40px;
    height:40px;
`;
const StyledShopBox = styled(Animated.View)`
    width:85%;
    position:absolute;
    background:#fff;
    align-self:center;
    border-radius:5px;
    bottom:20%;
    shadow-color:black; 
    shadow-offset:5px; 
    shadow-opacity:0.3; 
    shadow-radius:8px;
    elevation:1;
    padding:15px 25px;
`;
const StyledShopTouch = styled.TouchableOpacity`
`;
const StyledShopHeader = styled.View`
`;
const StyledShopImageBox = styled.View`
    background:#fff;
    width:120px;
    height:120px;
    shadow-color: black; 
    shadow-offset: 3px; 
    shadow-opacity: 0.4; 
    shadow-radius:5px;
    elevation:1;
    bottom:10px;
    left:-8px;
    border-radius:5px;
    position:absolute;
`;
const StyledShopImage = styled(FastImage)`
    height:100%;
    border-radius:5px;
`;
const StyledShopReviewArea = styled.View`
    flex-direction:row;
    padding-top:15px;
    padding-bottom:25px;
    padding-right:10px;
    align-self:flex-end;
`;
const StyledStarImage = styled(FastImage)`
    height:25px;
    width:25px;
`;
const StyledShopReviewText = styled.Text`
    line-height:25px;
    color:#444;
    font-weight:500;
`;
const StyledReviewHighLight = styled.Text`
    color:#F33562;
    font-size:20px;
    font-weight:700;
`;
const StyledShopBody = styled.View`
`;
const StyledShopTitle = styled.Text`
    color:#222;
    font-size:14px;
    font-weight:700;
    padding-bottom:5px;
`;
const StyledShopAddr = styled.Text`
    color:#7D7D7D;
    font-weight:400;
    padding-bottom:5px;
`;
const StyledShopFooter = styled.View`
    flex-direction:row;
`;
const StyledShopTag = styled.Text`
    font-size:12px;
    font-weight:500;
    border-radius:5px;
    background:${(props) => props.highligth ? '#FFA0B1': '#E9E9E9'};
    color:${(props) => props.highligth ? '#fff': '#444'};
    padding:3px 5px;
    margin-right:5px;
    overflow:hidden;
`;
const StyledPlusTagText = styled.Text`
    font-size:12px;
    font-weight:700;
    color:#444;
    padding:2px 0;
`;