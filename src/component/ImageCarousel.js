//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { useState, useMemo, useRef } from 'react';
import FastImage from 'react-native-fast-image';
import { onerror } from '@/assets/img';
import Carousel from 'react-native-reanimated-carousel';

//---------------------------- COMPONENT -------------------------------
export default function ImageCarousel({data, renderStyle={}, carouselOption={}, firstItem=0, loop=false}){
    //init
    const SLIDER_WIDTH = Dimensions.get('window').width;

    //ref
    const carouselRef = useRef(null);

    //state
    const [pageIndex, setPageIndex] = useState(firstItem);

    //memo
    const paginationGear = useMemo(() => {
        return data?.length > 1 ? (
            <StyledPageBox>
                {
                     data.map((d, i) => (
                        <StyledPageDot 
                            key={i} 
                            style={{backgroundColor : i == pageIndex ? '#F33562' : '#ccc'}}
                            onPress={() => {
                                setPageIndex(i);
                                carouselRef.current.scrollTo({index: i, animated:true});
                            }}
                        />
                    ))
                }
            </StyledPageBox>
        ) : null
    }, [pageIndex, data]);

    //render
    return (
        <>
            <StyledConatainer>
                <Carousel
                    ref={carouselRef}
                    loop={loop}
                    width={SLIDER_WIDTH}
                    defaultIndex={firstItem}
                    height='100%'
                    data={data}
                    scrollAnimationDuration={500}
                    onSnapToItem={(p) => {setPageIndex(p)}}
                    renderItem={({ item }) => {
                        item = item?.replace('http','https');
                        return (
                            <StyledSliderImage style={renderStyle} source={item ? {uri:item} : onerror} resizeMode="contain" defaultSource={onerror}/>
                        )
                    }}
                    {...carouselOption}
                />
            </StyledConatainer>       
            {paginationGear}
        </>
    )
}

//------------------------------- STYLE --------------------------------
const StyledConatainer = styled.View`
    height:95%;
`;
const StyledSliderImage = styled(FastImage)`
    height:100%;
    width:100%;
    background:#eee;
    align-self:center;
`;
const StyledPageBox = styled.View`
    flex-direction:row;
    height:20px;
    align-items:flex-end;
    justify-content:center;
`;
const StyledPageDot = styled.TouchableOpacity`
    width:8px;
    height:8px;
    border-radius:4px;
    margin: 0 5px;
`;