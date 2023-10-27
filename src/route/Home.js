//------------------------------ MODULE --------------------------------
import { useNavigation, useIsFocused } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomInnerLoading, ImageCarousel, CustomCarousel } from '@/component';
import { useLayoutEffect, useMemo } from 'react';
import FastImage from 'react-native-fast-image';
import { useBanner, useCategory, useStore, useUser } from '@/hooks';
import { timeToNumber } from '@/lib';
import { korean_logo, onerror } from '@/assets/img';
import { rh, rw } from '@/data/globalStyle';

//---------------------------- COMPONENT -------------------------------
export default function Home(){
    //init
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    //data
    const [ banners, bannersUpdate ] = useBanner();
    const [ category, categoryUpdate ] = useCategory();
    const [ available, availableUpdate ] = useStore(null, {store_oper_time:timeToNumber(new Date()), rpp:10});
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

    const nowListTemplate = (info, index) => {
        return (
            <StyledNowTemplateView key={index} activeOpacity={1} onPress={() => navigation.navigate('Desc', info)}>
                <StyledNowTemplateImage source={{uri:info.store_main_simg}} defaultSource={onerror} resizeMode="contain"/>
                <StyledNowTemplateTitle>{info.store_name}</StyledNowTemplateTitle>
                <StyledNowTemplateSub>{info.store_addr}</StyledNowTemplateSub>
                <StyledNowTemplateCnt>
                    <Icon name="person-outline" color="black"/> {<StyledHighLight>{10}</StyledHighLight>} / {20}    
                </StyledNowTemplateCnt>
            </StyledNowTemplateView>
        )
    }    

    const openModal = () => navigation.navigate("ModalGroup");

    //memo
    const headerGear = useMemo(() => (
        <StyledHeader>
                <StyledHeaderImage source={korean_logo} resizeMode='contain'/>
                {
                /*
                <StyledHeaderSubText onPress={() => openModal()}>광진구 중곡동 156-6 <Icon name="caret-down-sharp" /></StyledHeaderSubText>
                <StyledHeaderSearchIcon name ="md-search-outline" onPress={() => openModal()}/>                    
                */
                }
        </StyledHeader>
    ), []);

    const bannerGear = useMemo(() => banners?.length ? (
        <StyledSection style={{height:rh*180}}>
            <ImageCarousel data={banners.map((i) => i.bn_img_src)} renderStyle={{borderRadius:10}} slideGap={60} carouselOption={{loop:true}}/>
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
                <StyledSectionHeaderRear><Icon name="refresh" size={rw*19}/></StyledSectionHeaderRear>
            </StyledSectionHeader>
            <StyledSectionContent style={{padding:0}}> 
                {
                    <CustomCarousel carouselOption={{itemWidth:rw*140}}>
                        {available.map((i, index) => nowListTemplate(i, index))}
                    </CustomCarousel>
                }
            </StyledSectionContent>
        </StyledSection>
    ), [available]);

    //effect
    useLayoutEffect(() => {
        if(isFocused){
            bannersUpdate();
            categoryUpdate();
            availableUpdate();
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
                {categoryGear}
                {/* --------------------- SECTION 2 ---------------------- */}                
                {nowListGear}
                {/* --------------------- SECTION 3 ---------------------- */}                
                
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
    padding:${rh*20}px 0px;
`;
const StyledHeader = styled.View`
    flex-direction:row;
    justify-content:space-between;
    align-items:flex-end;
    padding: 0 ${rw*20}px;
`;
const StyledHeaderImage = styled(FastImage)`
    width:${rw*100}px;  
    height:${rh*50}px;  
    margin-left:${rw*10}px;
`;
const StyledHeaderSubText = styled.Text`
    padding-bottom: ${rh*4}px;
    right:15px;
`;
const StyledHeaderSearchIcon = styled(Icon)`
    font-size:${rh*25}px;
    padding-bottom: 4px;
`;
const StyledSection = styled.View`
    margin: ${rh*10}px 0px;
    justify-content:center;
`;
const StyledSectionHeader = styled.View`
    flex-direction:row;
    justify-content:space-between;
    padding: ${rh*5}px ${rw*20}px;
`;
const StyledSectionTitle = styled.Text`
    font-size:${rw*20}px;
    font-weight:600;
`;
const StyledSectionHeaderRear = styled.Text`
    font-size:${rw*13}px;
    top:${rh*4}px;
`;
const StyledHighLight = styled.Text`
    color:#F33562;
`;
const StyledSectionContent = styled.View`
    margin:${rh*5}px 0;
`;
const StyledCategoryRow = styled.View`
    flex-direction:row;
    margin:${rh*5}px ${rw*20}px;
    align-items:center;
`;
const StyledCategoryItems = styled.TouchableOpacity`
    margin-right:${rw*20}px;
    align-items:center;
    flex-direction:column;
`;
const StyledCategoryIconView = styled.View`
    background:#f1f1f1;
    padding:${rw*8}px;
    border-radius:8px;
`;
const StyledCategoryImg = styled(FastImage)`
    width:${rw*48}px;
    height:${rw*48}px;  
`;
const StyledCategoryText = styled.Text`
    margin:${rw*5}px 0;
    font-weight:600;
`;

const StyledNowTemplateView = styled.TouchableOpacity`
    padding-left:${rw*20}px;
`;
const StyledNowTemplateImage = styled(FastImage)`
    height:${rh*120}px;
    background:black;
    border-radius:8px;
`;
const StyledNowTemplateTitle = styled.Text`
    font-weight:500;
    color:#222;
    padding-top:${rw*5}px;
`;
const StyledNowTemplateSub = styled.Text`
    font-weight:500;
    color:#7D7D7D;
    font-size:${rw*12}px;
    padding-top:${rh*5}px;
`;
const StyledNowTemplateCnt = styled.Text`
    padding-top:${rh*5}px;
    font-size:${rw*11}px;
`;