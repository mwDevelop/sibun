//------------------------------ MODULE --------------------------------
import { useNavigation, useIsFocused } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Slider, AddressView } from '@/component';
import { useState, useLayoutEffect, useMemo } from 'react';
import { apiCall, openUrl } from '@/lib';
import FastImage from 'react-native-fast-image';

//---------------------------- COMPONENT -------------------------------
export default function Home(){
    //init
    const navigation = useNavigation();
    const isFocused = useIsFocused();   
    const mediaData = [
        {
            img : "https://picsum.photos/400/400",
            title: "컨텐츠 1",
            sub: "컨텐츠 1 입니다."
        },
        {
            img : "https://picsum.photos/400/400",
            title: "컨텐츠 2",
            sub: "컨텐츠 2 입니다."
        },
        {
            img : "https://picsum.photos/400/400",
            title: "컨텐츠 3",
            sub: "컨텐츠 3 입니다."
        },
        {
            img : "https://picsum.photos/400/400",
            title: "컨텐츠 4",
            sub: "컨텐츠 4 입니다."
        },
        {
            img : "https://picsum.photos/400/400",
            title: "컨텐츠 5",
            sub: "컨텐츠 5 입니다."
        },
    ];        

    //state
    const [ banners, setBanners ] = useState([]);
    const [ category, setCategory ] = useState([]);
    const [ visited, setVisited ] = useState([]);

    //function
    const initData = async() => {
        try{
            //banner
            const bannerResult = await apiCall.get(`/banner`);      
            if(bannerResult.data.result === '000'){
                setBanners(bannerResult.data.list.map(ori => {
                    let newBanners = {};
                    newBanners['img'] = ori['bn_img_src'];
                    newBanners['event'] = () => openUrl(ori['bn_link']);
                    return newBanners;
                }));
            }

            //category
            const cateResult = await apiCall.get(`/category`);      
            if(cateResult.data.result === '000') setCategory(cateResult.data.list);

            //shop visited
            const vistedResult = await apiCall.get(`/store`);      
            if(vistedResult.data.result === '000') setVisited(vistedResult.data.list);
        }catch(e){
            console.log(e);
        }
    }

    //effect
    useLayoutEffect(()=>{
        if(isFocused){
            console.log('home');
            initData();
        } 
    }, [isFocused]);


    //function
    const visitedListTemplate = (info) => {
        return (
            <StyledRecentTemplateView>
                <StyledRecentTemplateName>
                    {info.store_name}
                </StyledRecentTemplateName>
                <StyledRecentTemplateAddr>
                    {info.store_addr}
                </StyledRecentTemplateAddr>
                <StyledRecentTemplateScore>
                    {info.store_review_avg}
                </StyledRecentTemplateScore>
                <StyledRecentTemplateSeat>
                    <Icon name="person-outline" color="black"/> {<StyledHighLight>{10}</StyledHighLight>}/{20}
                </StyledRecentTemplateSeat>
            </StyledRecentTemplateView>
        )
    }

    const nowListTemplate = (info) => {
        return (
            <StyledNowTemplateView>
                <StyledNowTemplateName>
                    {info.store_name}
                </StyledNowTemplateName>
                <StyledNowTemplateAddr>
                    {info.store_addr}
                </StyledNowTemplateAddr>
                <StyledNowTemplateSeat>
                <Icon name="person-outline" color="black"/> {<StyledHighLight>{10}</StyledHighLight>}/{20}
                </StyledNowTemplateSeat>
            </StyledNowTemplateView>
        )
    }    

    const openModal = () => {
        const component = <AddressView/>;
        navigation.navigate("ModalGroup",  {component});
    }

    //memo
    const headerGear = useMemo(() => (
        <StyledHeader>
            <StyledHeaderTitle>
                <StyledHeaderTitleText>SUNTALK</StyledHeaderTitleText>
            </StyledHeaderTitle>
            <StyledHeaderSub onPress={() => openModal()}>
                <StyledHeaderSubText>광진구 중곡동 156-6 <Icon name="caret-down-sharp" /></StyledHeaderSubText>
            </StyledHeaderSub>
            <StyledHeaderSearch onPress={() => openModal()}>
                <StyledHeaderSearchIcon name ="md-search-outline"/>
            </StyledHeaderSearch>
        </StyledHeader>
    ), []);

    const bannerGear = useMemo(() => banners.length ? (
        <StyledSection>
            <Slider data={banners} size={{iw:350, ih:150, x:95, y:100}} pagination={true} autoplay={true} imageBorder={["10px"]}/>
        </StyledSection>
    ): null, [banners]);

    const categoryGear = useMemo(() => (
        <StyledSection>
            <StyledSectionHeader>
                <StyledSectionFront>
                    <StyledSectionTitle>
                        <StyledSectionTitleText>예약할 {<StyledHighLight>종목</StyledHighLight>}을 선택하세요!</StyledSectionTitleText>
                    </StyledSectionTitle>
                </StyledSectionFront>
                <StyledSectionRear>
                    <StyledSectionTitleRearText>
                        전체보기
                    </StyledSectionTitleRearText>
                </StyledSectionRear>                                 
            </StyledSectionHeader>
            <StyledSectionContent>
                <StyledCategoryRow>
                    {
                    category.length ? (
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
                
                {
                /* 
                <StyledCategoryRow>
                    <StyledCategoryItems onPress={() => navigation.navigate("마이페이지")}>
                        <StyledCategoryIconView><StyledCategoryIcon name="golf"/></StyledCategoryIconView>
                        <StyledCategoryText>골프</StyledCategoryText>
                    </StyledCategoryItems>
                    <StyledCategoryItems>
                        <StyledCategoryIconView><StyledCategoryIcon name="logo-octocat" color="orange"/></StyledCategoryIconView>
                        <StyledCategoryText>고양이</StyledCategoryText>
                        </StyledCategoryItems>
                    <StyledCategoryItems>
                        <StyledCategoryIconView><StyledCategoryIcon name="barbell" color="crimson"/></StyledCategoryIconView>
                        <StyledCategoryText>운동</StyledCategoryText>
                    </StyledCategoryItems>
                    <StyledCategoryItems>
                        <StyledCategoryIconView><StyledCategoryIcon name="baseball" color="gray"/></StyledCategoryIconView>
                        <StyledCategoryText>야구</StyledCategoryText>
                    </StyledCategoryItems>
                    <StyledCategoryItems>
                        <StyledCategoryIconView><StyledCategoryIcon name="basketball" color="brown"/></StyledCategoryIconView>
                        <StyledCategoryText>농구</StyledCategoryText>
                    </StyledCategoryItems>
                </StyledCategoryRow>
                <StyledCategoryRow>
                    <StyledCategoryItems>
                        <StyledCategoryIconView><StyledCategoryIcon name="american-football" color="skyblue"/></StyledCategoryIconView>
                        <StyledCategoryText>풋볼</StyledCategoryText>
                    </StyledCategoryItems>
                    <StyledCategoryItems>
                        <StyledCategoryIconView><StyledCategoryIcon name="car" color="purple"/></StyledCategoryIconView>
                        <StyledCategoryText>자동차</StyledCategoryText>
                    </StyledCategoryItems>
                    <StyledCategoryItems>
                        <StyledCategoryIconView><StyledCategoryIcon name="bonfire" color="red"/></StyledCategoryIconView>
                        <StyledCategoryText>캠핑</StyledCategoryText>
                    </StyledCategoryItems>
                    <StyledCategoryItems>
                        <StyledCategoryIconView><StyledCategoryIcon name="beer" color="gold"/></StyledCategoryIconView>
                        <StyledCategoryText>맥주</StyledCategoryText>
                    </StyledCategoryItems>
                    <StyledCategoryItems>
                        <StyledCategoryIconView><StyledCategoryIcon name="bicycle" color="green"/></StyledCategoryIconView>
                        <StyledCategoryText>자전거</StyledCategoryText>
                    </StyledCategoryItems>
                </StyledCategoryRow>                
                */   
                }

            </StyledSectionContent>                
        </StyledSection>        
    ), [category]);

    const visitedListGear = useMemo(() => (
        <StyledSection>
            <StyledSectionHeader>
                <StyledSectionFront>
                    <StyledSectionTitle>
                        <StyledSectionTitleText>최근 {<StyledHighLight>이용했던</StyledHighLight>} 매장</StyledSectionTitleText>
                    </StyledSectionTitle>           
                </StyledSectionFront>
                <StyledSectionRear>
                    <StyledSectionTitleRearText>
                        전체보기
                    </StyledSectionTitleRearText>
                </StyledSectionRear>                     
            </StyledSectionHeader>
            <StyledSectionContent>
                <Slider 
                    data={visited.map((i) => ({img: i.store_main_simg,custom:visitedListTemplate(i)}))}
                    size={{iw:210, ih:240, x:90, y:90}}
                    imageBorder={["10px", "0px"]}
                    boxBorder={["0px", "10px"]}
                    shadow={true}
                    loop={false}
                    center={false}
                />
            </StyledSectionContent>
        </StyledSection>   
    ), [visited]);

    const nowListGear = useMemo(() => (
        <StyledSection>
            <StyledSectionHeader>
                <StyledSectionFront>
                    <StyledSectionTitle>
                        <StyledSectionTitleText>지금 바로 {<StyledHighLight>예약가능한</StyledHighLight>} 매장</StyledSectionTitleText>
                        {/*<StyledSectionSubText>{timeToText(new Date, 'y년 m월 d일 h:i')} <Icon name="refresh"/> </StyledSectionSubText>*/}
                    </StyledSectionTitle>            
                </StyledSectionFront>
                <StyledSectionRear>
                    <StyledSectionTitleRearText>
                        <Icon name="refresh" size={20}/>
                    </StyledSectionTitleRearText>
                </StyledSectionRear>
            </StyledSectionHeader>
            <StyledSectionContent>
                <Slider
                    data={visited.map((i) => ({img: i.store_main_simg, custom:nowListTemplate(i)}))}  
                    size={{iw:130, ih:200, x:90, y:90}} 
                    imageBorder={["10px"]} 
                    loop={false} 
                    center={false} 
                    imageHeight='110px'/>
            </StyledSectionContent>
        </StyledSection>
    ), [visited]);

    const extraSectionGear = useMemo(() => (
        <StyledSection>
            <StyledSectionHeader>
                <StyledSectionFront>
                    <StyledSectionTitle>
                        <StyledSectionTitleText>EXTRA</StyledSectionTitleText>
                    </StyledSectionTitle>
                </StyledSectionFront>
                <StyledSectionRear>
                <StyledSectionTitleText>
                        <StyledMoreButton>
                            <StyledMoreButtonIcon name='add'/>
                            <StyledMoreButtonText>more</StyledMoreButtonText>
                        </StyledMoreButton>
                    </StyledSectionTitleText>                        
                </StyledSectionRear>
            </StyledSectionHeader>
            <StyledSectionContent>
                <Slider data={mediaData} size={{iw:180, ih:250, x:90, y:90}} />
            </StyledSectionContent>                    
        </StyledSection>
    ), []);

    //render
    return(
        <StyledWindow>
            <StyledConatainer>
                {headerGear}
                {/* ------------------- BANNER SECTION -------------------- */}                
                {bannerGear}
                {/* --------------------- CATEGORY SECTION ---------------------- */}
                {categoryGear}
                {/* --------------------- SECTION 2 ---------------------- */}                
                {visitedListGear}
                {/* --------------------- SECTION 3 ---------------------- */}                
                {nowListGear}
                {/* --------------------- SECTION 4 ---------------------- */}                
                {/*extraSection*/}
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
    margin:50px 15px;
`;
const StyledHeader = styled.View`
    flex-direction:row;
    margin: 1px;
    align-items:flex-end;
`;
const StyledHeaderTitle = styled.View`
    //background-color:blue;
    margin:1px;
`;
const StyledHeaderTitleText = styled.Text`
    font-weight:500;
    font-size:30px;  
`;
const StyledHeaderSub = styled.TouchableOpacity`
    //background-color:green;
    padding-bottom: 4px;
    padding-left:10px;
    flex:1;
`;
const StyledHeaderSubText = styled.Text`
`;
const StyledHeaderSearch = styled.TouchableOpacity`
`;
const StyledHeaderSearchIcon = styled(Icon)`
    font-size:25px;
    padding-bottom: 4px;
`;
const StyledSection = styled.View`
    //background-color:orange;
    flex-direction: column;
    margin: 10px 1px;
`;
const StyledSectionHeader = styled.View`
    flex:auto;
    flex-direction:row;
    justify-content:space-between;
`;
const StyledSectionFront = styled.View`
`;
const StyledSectionTitle = styled.View`  
`;
const StyledSectionTitleText = styled.Text`
    font-size:20px;
    font-weight:600;
`;
const StyledSectionTitleRearText = styled.Text`
    font-size:13px;
`;
const StyledHighLight = styled.Text`
    color:#F33562;
`;
const StyledSectionSub = styled.View`
`;
const StyledSectionSubText = styled.Text`
    color: #888;
    font-size:13px;
    margin-top:5px;
`;
const StyledSectionRear = styled.TouchableOpacity`
    align-self:flex-end;
`;
const StyledSectionContent = styled.View`
    margin:15px 0 5px 0;
    //margin-left:-10px;
`;
const StyledCategoryRow = styled.View`
    flex-direction:row;
    margin:5px 0 10px 0;
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
const StyledCategoryIcon = styled(Icon)`
    font-size:30px;
`;
const StyledCategoryText = styled.Text`
    margin:5px 0;
    font-weight:600;
`;
const StyledMoreButton = styled.TouchableOpacity`
    background:black;
    height:25px;
    width:25px;
    border-radius:15px;
    justify-content:center;
`;
const StyledMoreButtonIcon = styled(Icon)`
    color:white;
    font-size:12px;
    text-align:center;
`;
const StyledMoreButtonText = styled.Text`
    color:white;
    font-size:6px;
    text-align:center;
    bottom:3px;
`;
const StyledRecentTemplateView = styled.View`
    padding:10px;
`;
const StyledRecentTemplateName = styled.Text`
    font-size:18px;
    font-weight:500;
    margin: 3px 0;
`;
const StyledRecentTemplateAddr = styled.Text`
    font-size:12px;
    color:#777;
    margin:1px 0;
    height:20px;
`;
const StyledRecentTemplateScore = styled.Text`
    color:#999;
`;
const StyledRecentTemplateSeat = styled.Text`
    color:#777;
    align-self:flex-end;
    font-weight:500;
`;
const StyledNowTemplateView = styled.View`
`;
const StyledNowTemplateName = styled.Text`
    font-size:15px;
    padding:5px 0;
`;
const StyledNowTemplateAddr = styled.Text`
    font-size:13px;
    color:#777;
    padding-bottom:2px;
`;
const StyledNowTemplateSeat = styled.Text`
    font-size:12px;
    color:#777;
`;