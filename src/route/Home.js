//------------------------------ MODULE --------------------------------
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Slider, ModalNavigation } from '@/component';
import { useState, useMemo } from 'react';
import { Modal } from 'react-native';
import { Mypage, Desc } from '@/route';

//---------------------------- COMPONENT -------------------------------
export default function Home(){
    //init
    const navigation = useNavigation();
    const bannerData = [
        {
            img : "https://picsum.photos/300/200",
            event : () => navigation.navigate("마이페이지")
        },
        {
            img : "https://picsum.photos/300/200",
        },
        {
            img : "https://picsum.photos/300/200",
        },
        {
            img : "https://picsum.photos/300/200",
        },
        {
            img : "https://picsum.photos/300/200",
        },
    ];
    const shopData = [
        {
            img : "https://picsum.photos/400/400",
            title: "매장 1",
            sub: "매장 1 입니다."
        },
        {
            img : "https://picsum.photos/400/400",
            title: "매장 2",
            sub: "매장 2 입니다."
        },
        {
            img : "https://picsum.photos/400/400",
            title: "매장 3",
            sub: "매장 3 입니다."
        },
        {
            img : "https://picsum.photos/400/400",
            title: "매장 4",
            sub: "매장 4 입니다."
        },
        {
            img : "https://picsum.photos/400/400",
            title: "매장 5",
            sub: "매장 5 입니다."
        },
    ];    
    const shopData2 = [
        {
            img : "https://picsum.photos/400/400",
            name: "매장 1",
            addr: "송파대로 75번길",
            score: "5",
            total: "30",
            reserved: "5",
        },
        {
            img : "https://picsum.photos/400/400",
            name: "매장 2",
            addr: "강동구 동남로 900-22",
            score: "3.5",
            total: "40",
            reserved: "10",
        },
        {
            img : "https://picsum.photos/400/400",
            name: "매장 3",
            addr: "송파대로 75번길",
            score: "4.5",
            total: "20",
            reserved: "10",
        },
        {
            img : "https://picsum.photos/400/400",
            name: "매장 4",
            addr: "강동구 동남로 900-22",
            score: "2.5",
            total: "40",
            reserved: "10",
        },
        {
            img : "https://picsum.photos/400/400",
            name: "매장 5",
            addr: "송파대로 75번길",
            score: "5",
            total: "10",
            reserved: "5",
        },
    ];        
    const recentData = [
        {
            img : "https://picsum.photos/400/400",
            title: "매장 1",
            sub: "매장 1 입니다."
        },
        {
            img : "https://picsum.photos/400/400",
            title: "매장 2",
            sub: "매장 2 입니다."
        },
        {
            img : "https://picsum.photos/400/400",
            title: "매장 3",
            sub: "매장 3 입니다."
        },
        {
            img : "https://picsum.photos/400/400",
            title: "매장 4",
            sub: "매장 4 입니다."
        },
        {
            img : "https://picsum.photos/400/400",
            title: "매장 5",
            sub: "매장 5 입니다."
        },
    ];    
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
    const [addrModal, setAddrModal] = useState(false);

    //function
    const recentListTemplate = (info) => {
        return (
            <StyledRecentTemplateView>
                <StyledRecentTemplateName>
                    {info.name}
                </StyledRecentTemplateName>
                <StyledRecentTemplateAddr>
                    {info.addr}
                </StyledRecentTemplateAddr>
                <StyledRecentTemplateScore>
                    {info.score}
                </StyledRecentTemplateScore>
                <StyledRecentTemplateSeat>
                    <Icon name="person-outline" color="black"/> {<StyledHighLight>{info.reserved}</StyledHighLight>}/{info.total}
                </StyledRecentTemplateSeat>
            </StyledRecentTemplateView>
        )
    }

    const nowListTemplate = (info) => {
        return (
            <StyledNowTemplateView>
                <StyledNowTemplateName>
                    {info.name}
                </StyledNowTemplateName>
                <StyledNowTemplateAddr>
                    {info.addr}
                </StyledNowTemplateAddr>
                <StyledNowTemplateSeat>
                <Icon name="person-outline" color="black"/> {<StyledHighLight>{info.reserved}</StyledHighLight>}/{info.total}
                </StyledNowTemplateSeat>
            </StyledNowTemplateView>
        )
    }    

    //memo
    const headerGear = useMemo(() => (
        <StyledHeader>
            <StyledHeaderTitle>
                <StyledHeaderTitleText>SUNTALK</StyledHeaderTitleText>
            </StyledHeaderTitle>
            <StyledHeaderSub onPress={() => setAddrModal(true)}>
                <StyledHeaderSubText>광진구 중곡동 156-6 <Icon name="caret-down-sharp" /></StyledHeaderSubText>
            </StyledHeaderSub>
            <StyledHeaderSearch onPress={() => setAddrModal(true)}>
                <StyledHeaderSearchIcon name ="md-search-outline"/>
            </StyledHeaderSearch>
        </StyledHeader>
    ), []);

    const bannerGear = useMemo(() => (
        <StyledSection>
            <Slider data={bannerData} size={{iw:320, ih:140, x:95, y:100}} pagination={true} autoplay={true} imageBorder={["10px"]}/>
        </StyledSection>
    ), []);    

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
            </StyledSectionContent>                
        </StyledSection>        
    ), []);

    const recentListGear = useMemo(() => (
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
                    data={shopData2.map((i) => ({img: i.img,custom:recentListTemplate(i)}))}
                    size={{iw:200, ih:235, x:90, y:90}}
                    imageBorder={["10px", "0px"]}
                    boxBorder={["0px", "10px"]}
                    shadow={true}
                    loop={false}
                    center={false}
                />
            </StyledSectionContent>
        </StyledSection>   
    ), []);

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
                    data={shopData2.map((i) => ({img: i.img, custom:nowListTemplate(i)}))}  
                    size={{iw:130, ih:200, x:90, y:90}} 
                    imageBorder={["10px"]} 
                    loop={false} 
                    center={false} 
                    ImageHeight='110px'/>
            </StyledSectionContent>
        </StyledSection>
    ), []);

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

    const addrModalGear = useMemo(() => {
        const pages = {
            "desc" : Desc,
            "mypage" : Mypage,
        };
        return (
            addrModal ? 
            <>
                <StyledAddrModalBackground opacity="0.5"/>
                <Modal
                    //addOnGoal={addGoalHandler}
                    //onCancel={() => setAddrModal(false)}
                    visible={addrModal}	
                    transparent={true}
                    animationType="slide"
                >
                    <StyledAddrModalBackground onPress={() => setAddrModal(false)}/>
                    <StyledAddrModalClose onPress={() => setAddrModal(false)} >
                        <StyledAddrModalCloseButton/>
                    </StyledAddrModalClose>
                    <StyledAddrModalView>
                        <ModalNavigation pages={pages}/>
                    </StyledAddrModalView>
                </Modal> 
            </> : null
        )
    }, [addrModal]);

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
                {recentListGear}
                {/* --------------------- SECTION 3 ---------------------- */}                
                {nowListGear}
                {/* --------------------- SECTION 4 ---------------------- */}                
                {/*extraSection*/}
            </StyledConatainer>
            {addrModalGear}
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
    flex:1;
    align-items:center;
    flex-direction:column;
`;
const StyledCategoryIconView = styled.View`
    background:#eee;
    padding:8px;
    border-radius:8px;
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
    font-size:20px;
    font-weight:500;
`;
const StyledRecentTemplateAddr = styled.Text`
    font-size:12px;
    color:#777;
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
    padding:2px 0;
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
const StyledAddrModalBackground = styled.TouchableOpacity`
    position:absolute;
    height:100%;
    width:100%;
    background:rgba(0, 0, 0, ${(props) => props.opacity || '0' });
`;
const StyledAddrModalView = styled.View`
    flex:1;
    background:white;
    margin-top:100px;
    border-top-left-radius:50px;
    border-top-right-radius:50px;
    overflow: hidden;
`;
const StyledAddrModalClose = styled.TouchableOpacity`
    top:100px;
    height:25px;
    width:100px;
    justify-content:center;
    align-items:center;
    margin:auto;
`;
const StyledAddrModalCloseButton = styled.View`
    height:20px;
    background:white;
    width:50px;
    height:5px;
    border-radius:50px  
`;