//------------------------------ MODULE --------------------------------
import { useState, useEffect, useMemo } from 'react';
import { MapView } from '@/component';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStore } from '@/hooks';
import { rangeSet } from '@/data/constants';
import { defaultLocation } from '@/data/constants';

//---------------------------- COMPONENT -------------------------------
export default function Search(){
    //init
    const filterTestItem = [
        {
            "title" : "%할인권",
        },
        {
            "title" : "즉시가능",
        },
        {
            "title" : "카테고리",
        },
        {
            "title" : "시설",
        },
        {
            "title" : "테스트1",
        },
        {
            "title" : "테스트2",
        }
    ]

    //state
    const [center, setCenter] = useState(defaultLocation);
    const [params, setParams] = useState({
        store_addr_x_ge:Number(defaultLocation.longitude) - rangeSet[14][0],
        store_addr_x_le:Number(defaultLocation.longitude) + rangeSet[14][0],
        store_addr_y_ge:Number(defaultLocation.latitude) - rangeSet[14][1],
        store_addr_y_le:Number(defaultLocation.latitude) + rangeSet[14][1],
    });

    //data
    const [storeList] = useStore(
        null, 
        params
    );

    //memo
    const mapGear = useMemo(() => {
        console.log(storeList);
        const markerData = storeList && storeList.length ? 
            storeList.map((i) => ({
                name : i.store_name, 
                img : i.store_main_simg, 
                addr : i.store_addr, 
                reviewAvg : Number(i.store_review_avg), 
                reviewCnt : Number(i.store_review_cnt), 
                latitude : Number(i.store_addr_y), 
                longitude: Number(i.store_addr_x)
            })) : [];

        return (
            <StyledBody>
                <MapView markerData={markerData} onCenterChange={setCenter}/>
            </StyledBody>
        );
    }, [storeList]);

    //effect  
    useEffect(() => {
        try{
            if(!center) return;
            const range = rangeSet[center.zoom];
            setParams({  
                store_addr_x_ge:Number(center.longitude) - range[0],
                store_addr_x_le:Number(center.longitude) + range[0],
                store_addr_y_ge:Number(center.latitude) - range[1],
                store_addr_y_le:Number(center.latitude) + range[1],
            }); 
        }catch(e){
            console.log(e);
        }
    }, [center]);

    useEffect(() => {
        if(!storeList) return;
        console.log("-------OBSERVED LIST------");
        console.log(storeList.forEach((i) => {
            console.log("-------------");
            console.log(i.store_addr_x);
            console.log(i.store_addr_y);
        }));
    }, [storeList]);      

    //render
    return (
        <StyledWindow>
            <StyledConatainer>
                <StyledHeader>
                    <StyledSearchBar>
                        <StyledSearchBarInput placeholder="매장, 지역 이름으로 검색하세요" placeholderTextColor={'#333'}/>
                        <StyledSearchBarIcon suppressHighlighting={true} name ="md-search-outline" onPress={() => console.log('test')}/>
                    </StyledSearchBar>
                    <StyledFilterArea 
                        data={filterTestItem}
                        horizontal
                        contentContainerStyle={{paddingHorizontal: 20}}
                        showsHorizontalScrollIndicator={false}
                        renderItem={(data) => (
                            <StyledFilterItem>
                                <StyledFilterItemText>
                                    {data.item.title}
                                </StyledFilterItemText>
                            </StyledFilterItem>
                        )}
                    />
                </StyledHeader>
                {mapGear}
            </StyledConatainer>
        </StyledWindow>
    )
}

//------------------------------- STYLE --------------------------------
const StyledWindow = styled.View`
    background-color:#FFF;
    flex:1;
`;
const StyledConatainer = styled.View`
    flex:1;
`;
const StyledHeader = styled.View`
    top:1%;
    align-items:center;
`;
const StyledSearchBar = styled.View`
    margin:20px 20px;
    height:40px;
    border-width:1px;
    border-color:#444;
    border-radius:5px;
    flex-direction:row;
    align-items:center;
`;
const StyledSearchBarInput = styled.TextInput`
    height:80%;
    flex:0.85;
    padding:0 10px;
`;
const StyledSearchBarIcon = styled(Icon)`
    flex:0.15;
    font-size:25px;
    text-align:center;
    color:#333;
`;
const StyledBody = styled.View`
    margin:30px 0;
`;
const StyledFilterArea = styled.FlatList`
    flex-grow:0;
`;
const StyledFilterItem = styled.TouchableOpacity`
    padding:5px 14px 3.5px 14px;
    border-width:1px;
    border-color:#D7D7D7;
    margin-right:15px;
    border-radius:50px;
`;
const StyledFilterItemText = styled.Text`
    font-size:14px;
    font-weight:700;
    color:#444;
`;