//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Dimensions } from 'react-native';
import { useState, useMemo, useRef } from 'react';

//---------------------------- COMPONENT -------------------------------
export default function Slider({
    data, 
    size, 
    layout='default', 
    inactiveScale=1, 
    inactiveSlideOpacity=1,
    center=true, 
    pagination=false, 
    autoplay=false, 
    bgColor='transparent',
    loop=true,
    boxBorder=[],
    imageBorder=[],
    shadow=false,
    ImageHeight=null,
}){
    //init
    const SLIDER_WIDTH = size && 'sw' in size? size.sw : Dimensions.get('window').width + 80;
    const ITEM_WIDTH = size && 'iw' in size ? size.iw : Math.round(SLIDER_WIDTH * 0.7);
    const ITEM_HEIGHT = size && 'ih' in size ? size.ih : 100;
    const XRATIO = size && 'x' in size ? size.x : 100;
    const YRATIO = size && 'y' in size ? size.y : 100;

    //ref
    const carouselRef = useRef(null);

    //state
    const [pageIndex, setPageIndex] = useState(0);

    //memo
    const paginationGear = useMemo(() => {
        return (
            <Pagination
                dotsLength={data.length}
                activeDotIndex={pageIndex}
                containerStyle={{ paddingVertical: 15 }}
                carouselRef={carouselRef}
                tappableDots={true} 
                dotStyle={{
                    width: 8,
                    height: 8,
                    borderRadius: 5,
                    marginHorizontal: -5,
                    backgroundColor:'#888',
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.8}
            />
        )
    }, [pageIndex]);

    //render
    return (
        <StyledContainer>
            <StyledSlider itemHeight={ITEM_HEIGHT} center={center}>
                <Carousel
                    activeSlideAlignment={center ? "center" : "start"}
                    layout={layout}
                    ref={carouselRef}
                    data={data}
                    inactiveSlideOpacity={inactiveSlideOpacity}
                    renderItem={({item}) => (
                        <StyledSliderUnit bg={bgColor} shadow={shadow} onPress={ () => {'event' in item ? item.event() : null} }>
                            <StyledSliderBox x={XRATIO} y={YRATIO} boxBorder={boxBorder} shadow={shadow} center={center}>
                                {'img' in item ? (
                                    <StyledSliderImage src={item.img} imageBorder={imageBorder} ImageHeight={ImageHeight}/>
                                ) : null}
                                {'title' in item ? (
                                    <StyledSliderTitle>{item.title}</StyledSliderTitle>
                                ) : null}
                                {'sub' in item ? (
                                    <StyledSliderSub>{item.sub}</StyledSliderSub>
                                ) : null}
                                {'custom' in item ? (
                                    <StyledSliderCustom>
                                    {item.custom}
                                    </StyledSliderCustom>
                                ) : null}                                
                            </StyledSliderBox>
                        </StyledSliderUnit>
                    )}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    onSnapToItem={(index) => setPageIndex(index)}
                    loop={loop}
                    autoplay={autoplay}
                    autoplayInterval={5000}
                    inactiveSlideScale={inactiveScale}
                    layoutCardOffset={layout == "stack" || layout == "tinder" ? 30 : null}
                />
            </StyledSlider>
            {pagination ? paginationGear : null}
        </StyledContainer>
    )
}

//------------------------------- STYLE --------------------------------
const StyledContainer = styled.View`
`;
const StyledSlider = styled.View`
    ${(props) => props.center ? "align-items:center;" : null}
    height:${(props) => props.itemHeight}px;
`;
const StyledSliderUnit = styled.TouchableOpacity`
    background:${(props) => props.bg ? props.bg : "white"};
    ${(props) => props.shadow ? 
        (
            "shadow-color: black; shadow-offset: 10px; shadow-opacity: 0.1; shadow-radius:8px;"
        ) : null
    };
`;
const StyledSliderBox = styled.View`
    height:${(props) => props.y}%;
    width:${(props) => props.x}%;
    background:white;
    ${(props) => props.shadow ? `elevation:1;` : null}
    ${(props) => props.center ? `margin:auto;` : null}
    ${(props) => props.boxBorder.length ? (`border-top-right-radius: ${props.boxBorder[0]}; border-top-left-radius: ${props.boxBorder[0]};border-bottom-right-radius: ${props.boxBorder[0]}; border-bottom-left-radius: ${props.boxBorder[0]};`) :null}
    ${(props) => props.boxBorder.length > 1 ? (`border-bottom-right-radius: ${props.boxBorder[1]}; border-bottom-left-radius: ${props.boxBorder[1]};`) :null}
`;
const StyledSliderImage = styled.Image`
    ${(props) => props.ImageHeight ? `height:${props.ImageHeight};` : `flex:1;`}
    ${(props) => props.imageBorder.length ? (`border-top-right-radius: ${props.imageBorder[0]}; border-top-left-radius: ${props.imageBorder[0]};border-bottom-right-radius: ${props.imageBorder[0]}; border-bottom-left-radius: ${props.imageBorder[0]};`) :null}
    ${(props) => props.imageBorder.length > 1 ? (`border-bottom-right-radius: ${props.imageBorder[1]}; border-bottom-left-radius: ${props.imageBorder[1]};`) :null}
`;
const StyledSliderTitle = styled.Text`
    font-size:15px;
    font-weight:600;
    margin:3px 0;
`;
const StyledSliderSub = styled.Text`
    font-size:13px;
    color:#555;
`;
const StyledSliderCustom = styled.View`
    
`;