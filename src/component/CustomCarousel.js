//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Dimensions } from 'react-native';
import { useState, useMemo, useRef } from 'react';
import FastImage from 'react-native-fast-image';
import { Text } from 'react-native';

//---------------------------- COMPONENT -------------------------------
export default function CustomCarousel({children, carouselOption={}}){
    //init
    const SLIDER_WIDTH = Dimensions.get('window').width;

    //render
    return children? (
        <Carousel
            activeSlideAlignment="start"
            data={children.length ? children : [children]}
            renderItem={({item}) => item}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={(SLIDER_WIDTH)}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            //loop={loop}
            //autoplay={autoplay}
            //autoplayInterval={5000}
            //inactiveSlideScale={inactiveScale}
            //layoutCardOffset={layout == "stack" || layout == "tinder" ? 30 : null}
            {...carouselOption}
        />
    ) : <Text>need children</Text>
}

//------------------------------- STYLE --------------------------------
