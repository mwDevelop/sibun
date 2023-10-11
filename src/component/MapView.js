//------------------------------ MODULE --------------------------------
import NaverMapView, { Marker, Path, Polyline, Circle, Polygon } from 'react-native-nmap';
import { CustomInnerLoading } from '@/component';
import { map_loading } from '@/assets/animation';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { map_target, map_list } from '@/assets/img';
import { useRef, useLayoutEffect, useMemo, useState } from 'react';
import Geolocation from "react-native-geolocation-service";
import { permissionCheck } from '@/lib';
import { Platform } from 'react-native';
import { defaultLocation } from '@/data/constants';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { star_filled, marker_wish } from '@/assets/img';

//---------------------------- COMPONENT -------------------------------
export default function MapView({markerData = [], onCenterChange = () => {}, listOpen = () => {}}){
    //init
    const mapRef = useRef();

    //state
    const [shop, setShop] = useState(null);

    //function
    const selfTarget = async() => {
        const chkResult = await permissionCheck(Platform.OS, 'location');//chk

        return (chkResult != "granted") ? //set location
            null : 
            Geolocation.getCurrentPosition(
                pos => {
                    const info = pos.coords;
                    const centerInfo = {latitude : info.latitude, longitude : info.longitude, zoom:14};

                    //move map
                    mapRef?.current.animateToRegion(centerInfo);                    

                    //send
                    onCenterChange(centerInfo);                    
                },
                error => {
                    console.log(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 3600,
                    maximumAge: 3600,
                },
            );
    }     

    //memo
    const mapGear = useMemo(() => {
        /*
        markerData.forEach((d) => {
            console.log(d.name);  
        });
        */
        return (
        <>
            <NaverMapView 
                ref = {mapRef}
                style={{width: '100%', height: '100%'}}
                showsMyLocationButton={false}
                center={defaultLocation}
                onCameraChange={e => onCenterChange({latitude:e.latitude, longitude:e.longitude, zoom:e.zoom})}
                minZoomLevel={14}
                maxZoomLevel={16}
                //nightMode={true}
                onTouch={e => setShop(null)}
                onMapClick={e => setShop(null)}
            >   
            {
                markerData.map((item, index) => (
                    <Marker 
                        key={index}
                        coordinate={item} 
                        onClick={() => setShop(item)}
                        image={marker_wish}
                        /*
                        width={30}
                        height={30}
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
                ))
                
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
    }, [markerData]);

    const shopGear = useMemo(() => {
        return !shop ? null : (
            <StyledShopBox entering={FadeInDown.duration(300)}>
                <StyledShopHeader>
                    <StyledShopImageArea>
                        <StyledShopImage source={{uri:shop.img}} resizeMode="contain"/>
                    </StyledShopImageArea>
                    <StyledShopReviewArea>
                        <StyledStarImage source={star_filled}/>
                        <StyledShopReviewText>
                            <StyledReviewHighLight> {shop.reviewAvg.toFixed(1)} </StyledReviewHighLight> 리뷰 {shop.reviewCnt}개
                        </StyledShopReviewText>
                    </StyledShopReviewArea>
                </StyledShopHeader>
                <StyledShopBody>
                    <StyledShopTitle>
                        {shop.name}
                    </StyledShopTitle>
                    <StyledShopAddr>
                        {shop.addr}
                    </StyledShopAddr>
                </StyledShopBody>
                <StyledShopFooter>
                    {
                        shop.tag.map((t, i) => (t && i < 4) ? ( 
                            <StyledShopTag key={i} highligth={t=="할인중" || t=="즉시가능"}>{t}</StyledShopTag>
                        ) : (i == 4 ? <StyledPlusTagText key={i}>+{shop.tag.length-4}</StyledPlusTagText> : null))
                    }
                </StyledShopFooter>
            </StyledShopBox>
        )
    }, [shop])

    //effect
    useLayoutEffect(() => {
        selfTarget();
    }, []);

    useLayoutEffect(() => {
        setShop(null);
    }, [markerData]);

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
    bottom:15%;
    shadow-color:black; 
    shadow-offset:5px; 
    shadow-opacity:0.3; 
    shadow-radius:8px;
    elevation:1;
    padding:15px 25px;
`;
const StyledShopHeader = styled.View`
    flex-direction:row;
`;
const StyledShopImageArea = styled.View`
    flex:1;
    shadow-color: black; 
    shadow-offset: 3px; 
    shadow-opacity: 0.4; 
    shadow-radius:5px;
    elevation:1;
`;
const StyledShopImage = styled(FastImage)`
    width:120px;
    height:120px;
    background:black;
    position:absolute;
    bottom:10px;
    left:-8px;
    border-radius:5px;
`;
const StyledShopReviewArea = styled.View`
    flex:1;
    flex-direction:row;
    padding-top:15px;
    padding-bottom:25px;
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