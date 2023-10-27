//------------------------------ MODULE --------------------------------
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { intro_map, intro_coupon, intro_schedule } from '@/assets/img';
import { Dimensions, Animated } from 'react-native';
import { useRef, useMemo, useState } from 'react';
import { rw, rh } from '@/data/globalStyle';

//---------------------------- COMPONENT -------------------------------
export default function Intro(){
    //init
    const pagesConfig = [
        {
            title : "가까운 매장",
            desc : "내 위치에서 가장 가까운 매장을 바로!\n일일이 검색하지 않아도 손쉽게 가까운 매장을\n찾아볼 수 있어요.",
            img : intro_map
        }, 
        {
            title : "할인쿠폰",
            desc : "특정 시간, 특정 요일에는 사장님이 준비한\n할인 쿠폰이 있으니 잘 찾아보세요!",
            img : intro_coupon
        }, 
        {
            title : "스케줄 관리",
            desc : "내가 예약한 내역을 한눈에!\n언제, 어떤 매장을 예약했는지 바로 볼 수 있어요.",
            img : intro_schedule
        }, 
    ];
    const navigation = useNavigation();
    const flatListRef = useRef();
    const dot0 = useRef(new Animated.Value(rw*12)).current;
    const dot1 = useRef(new Animated.Value(rw*12)).current;
    const dot2 = useRef(new Animated.Value(rw*12)).current;

    //state
    const [pageId, setPageId] = useState(0);

    //function
    const pass = () => navigation.replace("PermissionCard");

    const move = (targetPage) => {
        if(targetPage == pagesConfig.length) pass();
        else{
            flatListRef.current.scrollToIndex({index: targetPage});
            setPageId(targetPage);
        }
    }

    //memo
    const paginationGear = useMemo(() => {
        Animated.timing(dot0, {
            toValue: pageId == 0 ? rw*25 : rw*12,
            duration: 250,
            useNativeDriver: false
        }).start();     
        Animated.timing(dot1, {
            toValue: pageId == 1 ? rw*25 : rw*12,
            duration: 250,
            useNativeDriver: false
        }).start();     
        Animated.timing(dot2, {
            toValue: pageId == 2 ? rw*25 : rw*12,
            duration: 250,
            useNativeDriver: false
        }).start();                           

        return (
            <StyledPaginationContainer>
                <StyledPassButton onPress={pass}>건너뛰기</StyledPassButton>
                <StyledPaginationDotBox>
                    {
                        pagesConfig.map((d, i) => (
                            <StyledPaginationDotTouch key={i} onPress={() => i != pageId ? move(i) : null}>
                                <StyledPaginationDot
                                    style={{
                                        backgroundColor:(i == pageId) ? '#F33562' : '#D9D9D9',
                                        width: i==0 ? dot0 : (i==1? dot1 : dot2)
                                    }}
                                />
                            </StyledPaginationDotTouch>
                        ))
                    }
                </StyledPaginationDotBox>
                <StyledNextButton onPress={() => move(pageId+1)}>다음</StyledNextButton>                
            </StyledPaginationContainer>
        )
    }, [pageId]);

    //render
    return(
        <>
        <SwiperFlatList
            ref={flatListRef}
            index = {0}
            showPagination={true}
            data={pagesConfig}
            PaginationComponent={() => paginationGear}
            onMomentumScrollEnd={(p) => setPageId(p.index)}
            renderItem={({ item }) => (
                <StyledContainer>
                    <StyledHeader>
                        <StyledTitle>{item.title}</StyledTitle>
                        <StyledDesc>{item.desc}</StyledDesc>
                    </StyledHeader>
                    <StyledBody>
                        <StyledImage source={item.img} resizeMode='contain'/>
                    </StyledBody>
                </StyledContainer>
            )}
        />
        </>
    );
};

//------------------------------- STYLE --------------------------------
const { width } = Dimensions.get('window');
const StyledContainer = styled.View`
    background:#FFF;
    width:${width}px;
    height:100%;
    padding:${rh*80}px ${rw*20}px;
`;
const StyledHeader = styled.View`
`;
const StyledTitle = styled.Text`
    color:#222;
    font-size:25px;
    font-weight:600;
`;
const StyledDesc = styled.Text`
    color:#444;
    font-size:${rw*14}px;
    font-weight:400;
    line-height:${rh*19}px;
    margin:${rh*15}px 0;
`;
const StyledBody = styled.View`
    height:${rw*270}px;
    width:${rw*270}px;
    align-self:center;
    margin-top:${rh*10}px;
`;
const StyledImage = styled(FastImage)`
    height:100%;
`;
const StyledPassButton = styled.Text`
    color:#7D7D7D;
    font-weight:400;
    font-size:${rw*15}px;
`;
const StyledNextButton = styled.Text`
    font-weight:400;
    font-size:${rh*15}px;
    color:#F33562;
`;
const StyledPaginationContainer = styled.View`
    flex-direction:row;
    background:black;
    justify-content:space-between;
    padding:${rh*40}px ${rw*25}px;
    background:#fff;
    align-items:center;
`;
const StyledPaginationDotBox = styled.View`
    flex-direction:row;
    align-items:flex-end;
`;
const StyledPaginationDotTouch = styled.TouchableOpacity`
`;
const StyledPaginationDot = styled(Animated.View)`
    height:${rw*12}px;
    width:${rw*12}px;
    border-radius:8px;
    margin:0 ${rw*4}px;
`;