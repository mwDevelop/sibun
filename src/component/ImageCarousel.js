//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Dimensions } from 'react-native';
import { useState, useMemo, useRef } from 'react';
import FastImage from 'react-native-fast-image';

//---------------------------- COMPONENT -------------------------------
export default function ImageCarousel({data, renderStyle={}, carouselOption={}, slideGap=0}){
    //init
    const SLIDER_WIDTH = Dimensions.get('window').width;

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
            <StyledConatainer>
                <Carousel
                    ref={carouselRef}
                    data={data}
                    renderItem={({item}) => (
                        <StyledSliderImage style={renderStyle} source={{uri: item}} resizeMode="contain"/>                        
                    )}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={SLIDER_WIDTH-slideGap}
                    onSnapToItem={(index) => setPageIndex(index)}
                    {...carouselOption}
                />
                {paginationGear}
            </StyledConatainer>       
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    height:100%;
`;
const StyledSliderImage = styled(FastImage)`
    height:100%;
    background:#eee;
`;