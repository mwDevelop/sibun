//------------------------------ MODULE --------------------------------
import styled from 'styled-components/native';
import { useState, useLayoutEffect, useMemo, useRef } from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

//---------------------------- COMPONENT -------------------------------
//render
export default function AddressView(){
    //init
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    //ref
    const carouselRef = useRef(null);

    //state
    const [data, setData] = useState([]);

    //function
    const close = () => {
        navigation.goBack();
    };
    
    const goToNextPage = () => {
        carouselRef.current.snapToNext(); // Move to the next page
    };
    
    const goToPreviousPage = () => {
        carouselRef.current.snapToPrev(); // Move to the previous page
    };

    //memo
    const listGear = useMemo(() => {
        return(
            <StyledConatainer activeOpacity={1}>
                <StyledHeader>
                    <StyledContentBackButton onPress = {close}>
                        <StyledContentBackButtonIcon name="md-arrow-back-outline" />
                    </StyledContentBackButton>
                    <StyledHeaderTitle>주소설정</StyledHeaderTitle>
                    <StyledContentEditButton onPress = {goToNextPage}>
                        <StyledContentEditButtonText>
                            편집
                        </StyledContentEditButtonText>
                    </StyledContentEditButton>
                </StyledHeader>
                <StyledContent>
                    <StyledContentRowItem>
                        <StyledContentRowItem>
                            <StyledContentRowItemTitle>test</StyledContentRowItemTitle>
                            <StyledContentRowItemAddr>addr</StyledContentRowItemAddr>
                        </StyledContentRowItem>
                        <StyledContentRowExtra>
                            
                        </StyledContentRowExtra>
                    </StyledContentRowItem>
                </StyledContent>
            </StyledConatainer>
        )
    }, []);

    const settingGear = useMemo(() => {
        return(
            <StyledConatainer activeOpacity={1}>
                <StyledHeader>
                    <StyledContentBackButton onPress = {goToPreviousPage}>
                        <StyledContentBackButtonIcon name="md-arrow-back-outline" />            
                    </StyledContentBackButton>
                    <StyledHeaderTitle>주소관리</StyledHeaderTitle>
                    <StyledContentEditButton onPress = {goToNextPage}>
                        <StyledContentEditButtonText>
                            편집
                        </StyledContentEditButtonText>
                    </StyledContentEditButton>                    
                </StyledHeader>
                <StyledContent>
                </StyledContent>
            </StyledConatainer>
        )
    }, []);

    const searchGear = useMemo(() => {
        return(            
            <StyledConatainer activeOpacity={1}>
                <StyledHeader>
                    <StyledContentBackButton onPress = {goToPreviousPage}>
                        <StyledContentBackButtonIcon name="md-arrow-back-outline" />            
                    </StyledContentBackButton>
                    <StyledHeaderTitle>주소검색</StyledHeaderTitle>
                    <StyledContentEditButton onPress = {goToNextPage}>
                        <StyledContentEditButtonText>
                        </StyledContentEditButtonText>
                    </StyledContentEditButton>                    
                </StyledHeader>
                <StyledContent>
                </StyledContent>
            </StyledConatainer>
        )
    }, []);

    //effect
    useLayoutEffect(()=>{
        if(isFocused) {
            const pageData = [
                listGear,
                settingGear,
                searchGear
            ];            
            setData(pageData);
        }
    }, [isFocused]);

    //render
    return data.length ? ( 
        <StyledWindow>
                <Carousel
                    layout='default'
                    data={data}
                    scrollEnabled={false}
                    inactiveSlideOpacity={1}
                    renderItem={({item}) => (item)}
                    sliderWidth={windowWidth}
                    itemWidth={windowWidth}
                    inactiveSlideScale={1}
                    ref={carouselRef}
                    onSnapToItem={(d) => {
                        console.log(d);
                    }}
                />
        </StyledWindow>
    ) : null;
}

//------------------------------- STYLE --------------------------------
const StyledWindow = styled.View`
`;
const StyledConatainer = styled.TouchableOpacity`
`;
const StyledHeader = styled.View`
    width:100%;
    height:50px;
    align-items:center;
    border-color:#ddd;
    border-bottom-width:1px;
    flex-direction:row;
`;
const StyledHeaderTitle = styled.Text`
    font-size:18px;
    font-weight:600;
    flex:1.4;
    text-align:center;
`;
const StyledContent = styled.View`
    background:green;
`;
const StyledContentRow = styled.View`
    flex-direction:row;
`;
const StyledContentRowItem = styled.TouchableOpacity`
`;
const StyledContentRowItemTitle = styled.Text`
`;
const StyledContentRowItemAddr = styled.Text`
`;
const StyledContentRowExtra = styled.View`
`;
const StyledContentRowExtraButton = styled.TouchableOpacity`
`;
const StyledContentEditButton = styled.TouchableOpacity`
    flex:0.8;
`;
const StyledContentEditButtonText = styled.Text`
    color:#555;
    text-align:center;
    left:15px;
`;
const StyledContentBackButton = styled.TouchableOpacity`
    flex:0.8;
`;
const StyledContentBackButtonIcon = styled(Icon)`
    color:#555;
    text-align:left;
    font-size:25px;
    left:20px;
`;