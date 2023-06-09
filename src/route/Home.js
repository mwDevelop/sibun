//------------------------------ MODULE --------------------------------
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { timeToText } from '@/lib';
import { Slider } from '@/component';

//---------------------------- COMPONENT -------------------------------
export default function Home(){
    //init
    const navigation = useNavigation();
    const bannerData = [
        {
            img : "https://picsum.photos/300/100",
        },
        {
            img : "https://picsum.photos/300/100"
        },
        {
            img : "https://picsum.photos/300/100"
        },
        {
            img : "https://picsum.photos/300/100"
        },
        {
            img : "https://picsum.photos/300/100"
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

    //render
    return(
        <StyledWindow>
            <StyledConatainer>
                <StyledHeader>
                    <StyledHeaderTitle>
                        <StyledHeaderTitleText>선착순 톡톡</StyledHeaderTitleText>
                    </StyledHeaderTitle>
                    <StyledHeaderSub>
                        <StyledHeaderSubText>광진구 중곡동 156-6</StyledHeaderSubText>
                    </StyledHeaderSub>
                </StyledHeader>
                {/* --------------------- CATEGORY SECTION ---------------------- */}
                <StyledSection>
                    <StyledSectionHeader>
                        <StyledSectionFront>
                            <StyledSectionTitle>
                                <StyledSectionTitleText>어떤 예약을 원하세요?</StyledSectionTitleText>
                            </StyledSectionTitle>
                        </StyledSectionFront>
                    </StyledSectionHeader>
                    <StyledSectionContent>
                        <StyledCategoryRow>
                            <StyledCategoryItems onPress={() => navigation.navigate("마이페이지")}><StyledCategoryIcon name="golf" /><StyledCategoryText>골프</StyledCategoryText></StyledCategoryItems>
                            <StyledCategoryItems><StyledCategoryIcon name="logo-octocat" color="orange"/><StyledCategoryText>고양이</StyledCategoryText></StyledCategoryItems>
                            <StyledCategoryItems><StyledCategoryIcon name="barbell" color="crimson"/><StyledCategoryText>운동</StyledCategoryText></StyledCategoryItems>
                            <StyledCategoryItems><StyledCategoryIcon name="baseball" color="gray"/><StyledCategoryText>야구</StyledCategoryText></StyledCategoryItems>
                            <StyledCategoryItems><StyledCategoryIcon name="basketball" color="brown"/><StyledCategoryText>농구</StyledCategoryText></StyledCategoryItems>
                        </StyledCategoryRow>
                        <StyledCategoryRow>
                            <StyledCategoryItems><StyledCategoryIcon name="american-football" color="skyblue"/><StyledCategoryText>풋볼</StyledCategoryText></StyledCategoryItems>
                            <StyledCategoryItems><StyledCategoryIcon name="car" color="purple"/><StyledCategoryText>자동차</StyledCategoryText></StyledCategoryItems>
                            <StyledCategoryItems><StyledCategoryIcon name="bonfire" color="red"/><StyledCategoryText>캠핑</StyledCategoryText></StyledCategoryItems>
                            <StyledCategoryItems><StyledCategoryIcon name="beer" color="gold"/><StyledCategoryText>맥주</StyledCategoryText></StyledCategoryItems>
                            <StyledCategoryItems><StyledCategoryIcon name="bicycle" color="green"/><StyledCategoryText>자전거</StyledCategoryText></StyledCategoryItems>
                        </StyledCategoryRow>
                    </StyledSectionContent>                
                </StyledSection>
                {/* ------------------- BANNER SECTION -------------------- */}                
                <Slider data={bannerData} pagination={true} autoplay={true}/>
                {/* --------------------- SECTION 2 ---------------------- */}                
                <StyledSection>
                    <StyledSectionHeader>
                        <StyledSectionFront>
                            <StyledSectionTitle>
                                <StyledSectionTitleText>지금 바로 이용가능한 매장</StyledSectionTitleText>
                                <StyledSectionSubText>{timeToText(new Date, 'y년 m월 d일 h:i')} <Icon name="refresh"/> </StyledSectionSubText>
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
                        <Slider data={shopData} size={{iw:180, ih:250, x:90, y:90}}/>
                    </StyledSectionContent>
                </StyledSection>
                {/* --------------------- SECTION 3 ---------------------- */}                
                <StyledSection>
                    <StyledSectionHeader>
                        <StyledSectionFront>
                            <StyledSectionTitle>
                                <StyledSectionTitleText>최근 이용한 매장</StyledSectionTitleText>
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
                        <Slider data={recentData} layout="stack" size={{iw:300, ih:380, x:90, y:90}} bgColor='#ddd'/>
                    </StyledSectionContent>
                </StyledSection>
                {/* --------------------- SECTION 4 ---------------------- */}                
                <StyledSection>
                    <StyledSectionHeader>
                        <StyledSectionFront>
                            <StyledSectionTitle>
                                <StyledSectionTitleText>미디어 컨텐츠</StyledSectionTitleText>
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
            </StyledConatainer>
        </StyledWindow>
    )
}

//------------------------------- STYLE --------------------------------
const StyledWindow = styled.ScrollView`
`;
const StyledConatainer = styled.View`
    flex: 1;
    flex-direction:column;
    margin:50px 15px;
`;
const StyledHeader = styled.View`
    //background-color:red;
    flex-direction:row;
    margin: 1px;
`;
const StyledHeaderTitle = styled.View`
    //background-color:blue;
    margin:1px;
`;
const StyledHeaderTitleText = styled.Text`
    font-weight:bold;
    font-size:30px;
`;
const StyledHeaderSub = styled.View`
    //background-color:green;
    align-self: flex-end;
    padding-bottom: 0px;
    padding-left:10px;
`;
const StyledHeaderSubText = styled.Text`
`;
const StyledSection = styled.View`
    //background-color:orange;
    flex-direction: column;
    margin: 15px 1px;
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
    font-weight:bold;
`;
const StyledSectionSub = styled.View`
`;
const StyledSectionSubText = styled.Text`
    color: #888;
    font-size:13px;
    margin-top:5px;
`;
const StyledSectionRear = styled.View`
    align-self:center;
`;
const StyledSectionContent = styled.View`
    margin:10px 0;
`;
const StyledCategoryRow = styled.View`
    flex-direction:row;
    margin:10px 0;
`;
const StyledCategoryItems = styled.TouchableOpacity`
    flex:1;
    align-items:center;
    flex-direction:column;
`;
const StyledCategoryIcon = styled(Icon)`
    font-size:30px;
`;
const StyledCategoryText = styled.Text`
    margin:5px 0;
    font-weight:bold;
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