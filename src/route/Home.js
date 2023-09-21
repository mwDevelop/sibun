//------------------------------ MODULE --------------------------------
import { useNavigation, useIsFocused } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomInnerLoading, ImageCarousel, CustomCarousel } from '@/component';
import { useLayoutEffect, useMemo } from 'react';
import FastImage from 'react-native-fast-image';
import { useBanner, useCategory, useStore, useUser } from '@/hooks';
import { defaultImage } from '@/data/constants';

//---------------------------- COMPONENT -------------------------------
export default function Home(){
    //init
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    //data
    const [ banners, bannersUpdate ] = useBanner();
    const [ category, categoryUpdate ] = useCategory();
    const [ visited, visitedUpdate ] = useStore();
    const [ user, userUpdate ] = useUser();

    //function
    const tokenCheck = async() => {
        //visitedUpdate();
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
                <StyledNowTemplateImage source={{uri:info.store_main_simg || defaultImage}} resizeMode="contain"/>
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
                <StyledHeaderTitleText onPress={tokenCheck}>SUNTALK</StyledHeaderTitleText>
                <StyledHeaderSubText onPress={() => openModal()}>광진구 중곡동 156-6 <Icon name="caret-down-sharp" /></StyledHeaderSubText>
                <StyledHeaderSearchIcon name ="md-search-outline" onPress={() => openModal()}/>
        </StyledHeader>
    ), []);

    const bannerGear = useMemo(() => banners?.length ? (
        <StyledSection style={{height:200}}>
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

    const nowListGear = useMemo(() => !visited ? null : (
        <StyledSection>
            <StyledSectionHeader>                
                <StyledSectionTitle>지금 바로 {<StyledHighLight>예약가능한</StyledHighLight>} 매장</StyledSectionTitle>
                <StyledSectionHeaderRear><Icon name="refresh" size={20}/></StyledSectionHeaderRear>
            </StyledSectionHeader>
            <StyledSectionContent style={{padding:0}}> 
                {
                    <CustomCarousel carouselOption={{itemWidth:150}}>
                        {visited.map((i, index) => nowListTemplate(i, index))}
                    </CustomCarousel>
                }
            </StyledSectionContent>
        </StyledSection>
    ), [visited]);

    //effect
    useLayoutEffect(() => {
        if(isFocused){
            console.log('focused');
            bannersUpdate();
            categoryUpdate();
            visitedUpdate();
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
    padding:20px 0px;
`;
const StyledHeader = styled.View`
    flex-direction:row;
    justify-content:space-between;
    align-items:flex-end;
    padding: 0 20px;
`;
const StyledHeaderTitleText = styled.Text`
    font-weight:500;
    font-size:30px;  
`;
const StyledHeaderSubText = styled.Text`
    padding-bottom: 4px;
    right:15px;
`;
const StyledHeaderSearchIcon = styled(Icon)`
    font-size:25px;
    padding-bottom: 4px;
`;
const StyledSection = styled.View`
    margin: 10px 0px;
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
`;
const StyledHighLight = styled.Text`
    color:#F33562;
`;
const StyledSectionContent = styled.View`
    margin:5px 0;
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

const StyledNowTemplateView = styled.TouchableOpacity`
    padding-left:20px;
`;
const StyledNowTemplateImage = styled(FastImage)`
    height:130px;
    background:black;
    border-radius:8px;
`;
const StyledNowTemplateTitle = styled.Text`
    font-weight:500;
    color:#222;
    padding-top:5px;
`;
const StyledNowTemplateSub = styled.Text`
    font-weight:500;
    color:#7D7D7D;
    font-size:12px;
    padding-top:5px;
`;
const StyledNowTemplateCnt = styled.Text`
    padding-top:5px;
    font-size:12px;
`;