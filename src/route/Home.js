//------------------------------ MODULE --------------------------------
import { useNavigation, useIsFocused } from '@react-navigation/native';
import styled from 'styled-components/native';
import { CustomInnerLoading, ImageCarousel, StoreUnitBlock1, StoreUnitBlock2 } from '@/component';
import { useLayoutEffect, useMemo } from 'react';
import FastImage from 'react-native-fast-image';
import { useBanner, useCategory, useStore, useUser } from '@/hooks';
import { timeToNumber } from '@/lib';
import { korean_logo } from '@/assets/img';

//---------------------------- COMPONENT -------------------------------
export default function Home(){
    //init
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    //data
    const [ banners, bannersUpdate ] = useBanner();
    const [ category, categoryUpdate ] = useCategory();
    const [ available, availableUpdate ] = useStore(null, {store_oper_time:timeToNumber(new Date()), rpp:10});
    const [ newList, newListUpdate ] = useStore(null, {rpp:10, col:'store_reg_dt', colby:'desc'});
    const [ user, userUpdate ] = useUser();

    //function
    const tokenCheck = async() => {
        /*
        const headers = {"Authorization" : "access"};
        const testResult = await apiCall.get(`/user/me`, {headers});
        console.log("RESPONSE OUTPUT");
        console.log(testResult.data);
        */
        //queryClient.invalidateQueries(['store']);
    }

    //memo
    const headerGear = useMemo(() => (
        <StyledHeader>
            <StyledHeaderImage source={korean_logo} resizeMode='contain'/>
        </StyledHeader>
    ), []);

    const bannerGear = useMemo(() => banners?.length ? (
        <StyledSection style={{height:200}}>
            <ImageCarousel data={banners.map((i) => i.bn_img_src)} renderStyle={{borderRadius:10, width:'90%'}} loop={true} carouselOption={{autoPlay:true, autoPlayInterval:3000}}/>
        </StyledSection>
    ): null, [banners]);

    const categoryGear = useMemo(() => (
        <StyledSection>
            <StyledSectionHeader>                
                <StyledSectionTitle>예약할 {<StyledHighLight>종목</StyledHighLight>}을 선택하세요!</StyledSectionTitle>
                <StyledSectionHeaderRear>전체보기</StyledSectionHeaderRear>
            </StyledSectionHeader>
            <StyledSectionContent>
                <StyledCategoryRow>
                    {
                    category?.length ? (
                        category.map((item, index) => (
                            <StyledCategoryItems key={index}  onPress={() => navigation.navigate("마이페이지")}>
                                <StyledCategoryIconView><StyledCategoryImg source={{uri:item.ctg_icon_img, priority: FastImage.priority.normal}}/></StyledCategoryIconView>
                                <StyledCategoryText>{item.ctg_title}</StyledCategoryText>
                            </StyledCategoryItems>
                        ))
                    )
                    :null
                    }
                </StyledCategoryRow>
            </StyledSectionContent>                
        </StyledSection>        
    ), [category]);

    const nowListGear = useMemo(() => !available ? null : (
        <StyledSection>
            <StyledSectionHeader>                
                <StyledSectionTitle>지금 바로 {<StyledHighLight>예약가능한</StyledHighLight>} 매장</StyledSectionTitle>
            </StyledSectionHeader>
            <StyledSectionContent style={{paddingTop:15}}> 
                {
                    <StyledFlatList 
                        data={available}
                        keyExtractor={(item) => item.store_idx}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        renderItem= {({item, index}) => {
                            return (
                                <StoreUnitBlock1 unit={item} containerStyle={{width:150, marginLeft:index == 0 ? 20 : 0}}/>
                            )
                        }}
                    />
                }
            </StyledSectionContent>
        </StyledSection>
    ), [available]);

    const newListGear = useMemo(() => !newList ? null : (
        <StyledSection>
            <StyledSectionHeader>                
                <StyledSectionTitle>새로 {<StyledHighLight>입점한</StyledHighLight>} 신규 매장</StyledSectionTitle>
            </StyledSectionHeader>
            <StyledSectionContent style={{paddingTop:15}}> 
                {
                    <StyledFlatList 
                        data={newList}
                        keyExtractor={(item) => item.store_idx}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        renderItem= {({item, index}) => {
                            return (
                                <StoreUnitBlock2 unit={item} containerStyle={{width:190, marginLeft:index == 0 ? 20 : 0}}/>
                            )
                        }}
                    />
                }
            </StyledSectionContent>
        </StyledSection>
    ), [newList]);

    //effect
    useLayoutEffect(() => {
        if(isFocused){
            bannersUpdate();
            categoryUpdate();
            availableUpdate();
            newListUpdate();
            userUpdate();
        } 
    }, [isFocused]);

    //render
    return(
        <StyledWindow>
            <CustomInnerLoading paddingTop="70%"/>
            <StyledConatainer>
                {headerGear}
                {/* ------------------- BANNER SECTION -------------------- */}                
                {bannerGear}
                {/* --------------------- CATEGORY SECTION ---------------------- */}
                {/*categoryGear*/}
                {/* --------------------- SECTION 2 ---------------------- */}                
                {nowListGear}
                {/* --------------------- SECTION 3 ---------------------- */}                
                {newListGear}
                {/* --------------------- SECTION 4 ---------------------- */}                
            </StyledConatainer>
        </StyledWindow>
    );
}

//------------------------------- STYLE --------------------------------
const StyledWindow = styled.ScrollView`
    background:#FFF;
`;
const StyledConatainer = styled.View`
    flex-direction:column;
    padding:20px 0px;
`;
const StyledHeader = styled.View`
    flex-direction:row;
    justify-content:space-between;
    align-items:flex-end;
    padding: 10px 20px;
`;
const StyledHeaderImage = styled(FastImage)`
    width:100px;  
    height:50px;  
    margin-left:10px;
`;
const StyledSection = styled.View`
    padding: 10px 0px;
    justify-content:center;
`;
const StyledSectionHeader = styled.View`
    flex-direction:row;
    justify-content:space-between;
    padding: 5px 20px;
`;
const StyledSectionTitle = styled.Text`
    font-size:20px;
    font-weight:600;
`;
const StyledSectionHeaderRear = styled.Text`
    font-size:13px;
    top:5px;
`;
const StyledHighLight = styled.Text`
    color:#F33562;
`;
const StyledSectionContent = styled.View`
    padding:5px 0;
`;
const StyledCategoryRow = styled.View`
    flex-direction:row;
    margin:5px 20px;
    align-items:center;
`;
const StyledCategoryItems = styled.TouchableOpacity`
    margin-right:20px;
    align-items:center;
    flex-direction:column;
`;
const StyledCategoryIconView = styled.View`
    background:#f1f1f1;
    padding:8px;
    border-radius:8px;
`;
const StyledCategoryImg = styled(FastImage)`
    width:50px;
    height:50px;  
`;
const StyledCategoryText = styled.Text`
    margin:5px 0;
    font-weight:600;
`;
const StyledFlatList = styled.FlatList`
    overflow:visible;
`;