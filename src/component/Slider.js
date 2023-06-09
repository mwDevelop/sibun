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
    pagination=false, 
    autoplay=false, 
    bgColor='transparent',
    loop=true
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
                    width: 25,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: -5,
                    backgroundColor:'#555',
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        )
    }, [pageIndex]);

    //render
    return (
        <StyledContainer>
            <StyledSlider itemHeight={ITEM_HEIGHT}>
                <Carousel
                    layout={layout}
                    ref={carouselRef}
                    data={data}
                    renderItem={({item}) => (
                        <StyledSliderUnit bg={bgColor}>
                            <StyledSliderBox x={XRATIO} y={YRATIO}>
                                {'img' in item ? (
                                    <StyledSliderImage src={item.img}/>
                                ) : null}
                                {'title' in item ? (
                                    <StyledSliderTitle>{item.title}</StyledSliderTitle>
                                ) : null}
                                {'sub' in item ? (
                                    <StyledSliderSub>{item.sub}</StyledSliderSub>
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
    align-items:center;
    height:${(props) => props.itemHeight}px;
`;
const StyledSliderUnit = styled.View`
    background:${(props) => props.bg};
`;
const StyledSliderBox = styled.View`
    height:${(props) => props.y}%;
    width:${(props) => props.x}%;
    margin:auto;
`;
const StyledSliderImage = styled.Image`
    flex:7;
`;
const StyledSliderTitle = styled.Text`
    flex:1;
    font-size:20px;
    font-weight:bold;
    margin:5px 0;
`;
const StyledSliderSub = styled.Text`
    flex:1;
    font-size:15px;
    color:#555;
`;