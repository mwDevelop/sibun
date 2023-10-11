//------------------------------ MODULE --------------------------------
import { useState, useMemo, useLayoutEffect } from 'react';
import { MapView, SelectModal, StoreListModal } from '@/component';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { rangeSet } from '@/data/constants';
import { defaultLocation } from '@/data/constants';
import { apiCall } from '@/lib';
import { useCategory } from '@/hooks';
import { timeToNumber } from '@/lib';

//---------------------------- COMPONENT -------------------------------
export default function Search(){
    //data
    const [category] = useCategory();

    //state
    const [center, setCenter] = useState(defaultLocation);
    const [storeData, setStoreData] = useState([]);
    const [markerData, setMarkerData] = useState(null);
    const [cateOpen, setCateOpen] = useState(false);
    const [storeListOpen, setStoreListOpen] = useState(false);
    const [cateSelect, setCateSelect] = useState('0');
    const [voucherChk, setVoucherChk] = useState(false);
    const [availChk, setAvailChk] = useState(false);
    const [cateObj, setCateObj] = useState(null);

    //memo
    const searchGear = useMemo(() => {
        return (
            <StyledSearchBar>
                <StyledSearchBarInput placeholder="매장, 지역 이름으로 검색하세요" placeholderTextColor={'#333'}/>
                <StyledSearchBarIcon suppressHighlighting={true} name ="md-search-outline" onPress={() => console.log('test')}/>
            </StyledSearchBar>
        );
    }, []);

    const chkFilterGear = useMemo(() => {
        return (
            <>
            <StyledFilterItem onPress={() => setVoucherChk(!voucherChk)} selected={voucherChk}>
                <StyledFilterItemText selected={voucherChk}>%할인권</StyledFilterItemText>
            </StyledFilterItem>          
            <StyledFilterItem onPress={() => setAvailChk(!availChk)} selected={availChk}>
                <StyledFilterItemText selected={availChk}>즉시가능</StyledFilterItemText>
            </StyledFilterItem>          
            </>
        );
    }, [voucherChk, availChk]);

    const selectFilterGear = useMemo(() => {
        if(!cateObj) return null;
        return (
            <StyledFilterItem onPress={() => setCateOpen(true)} style={{marginRight:0}}>
                <StyledFilterItemText>
                    {cateSelect=='0' ? '카테고리' : cateObj[cateSelect]}
                </StyledFilterItemText>
                <Icon name="chevron-down" size={16} style={{top:-1, width:14}}/>
            </StyledFilterItem>
        );
    }, [cateObj, cateSelect]);

    const mapGear = useMemo(() => {
        return (
            <StyledBody>
                <MapView markerData={markerData || []} onCenterChange={setCenter} listOpen={setStoreListOpen}/>
            </StyledBody>
        );
    }, [markerData]);

    const categoryModalGear = useMemo(() => {
        if(!cateObj) return;
        return (
            <SelectModal 
                title={'카테고리'} 
                options={cateObj} 
                selected={cateSelect} 
                selectEvent={setCateSelect}
                modalOpen={cateOpen}
                modalCloseEvent={() => setCateOpen(false)}
            />
        )
    }, [cateOpen, cateObj, cateSelect]);

    
    const storeListModalGear = useMemo(() => {
        if(!(markerData?.length)) return;
        return (
            <StoreListModal 
                list={markerData} 
                modalOpen={storeListOpen}
                modalCloseEvent={() => setStoreListOpen(false)}            
            />
        )
    }, [markerData, storeListOpen]);
    

    //effect  
    useLayoutEffect(() => { //filtering
        const td = new Date().getDay() || 7;
        const now = Number(timeToNumber(new Date()));

        const filteredData = storeData && storeData.length ? 
            storeData.map((i) => {
                const tags = i.store_amenities.split(',');

                //category filter
                if(cateSelect != '0' && i.store_ctg_idx != cateSelect) return undefined;

                //available filter
                if(availChk){
                    if(
                        Number(i.store_open_time) >= now || 
                        Number(i.store_close_time)-2 <= now || //set 60 minutes(minimum usage) before until closed
                        i.store_closed_days.split(',').includes(String(td))
                    ){
                        return undefined;
                    }else tags.unshift('즉시가능');
                }

                //voucher filter
                if(voucherChk){
                    if(i.store_voucher_use_yn != 'y') return undefined;
                    else tags.unshift('할인중');
                };                

                return {
                    name : i.store_name, 
                    img : i.store_main_simg, 
                    addr : i.store_addr, 
                    tag : tags, 
                    reviewAvg : Number(i.store_review_avg), 
                    reviewCnt : Number(i.store_review_cnt), 
                    latitude : Number(i.store_addr_y), 
                    longitude: Number(i.store_addr_x)
                };
            }).filter(e=>e) : null;

        setMarkerData(filteredData);
    }, [storeData, voucherChk, availChk, cateSelect]);

    useLayoutEffect(() => {
        try{
            if(!center) return null;
            const range = rangeSet[center.zoom];
            const params = {
                store_addr_x_ge:Number(center.longitude) - range[0],
                store_addr_x_le:Number(center.longitude) + range[0],
                store_addr_y_ge:Number(center.latitude) - range[1],
                store_addr_y_le:Number(center.latitude) + range[1],                
            }
            apiCall.get('/store', {params} ).then(( res ) => {
                if(res.data.result == "000"){
                    setStoreData(res.data.list);
                }
            });
        }catch(e){
            console.log(e);
        }
    }, [center]);     

    useLayoutEffect(() => {
        if(!(category?.length)) return null;
        const cateObj = {'0': '전체'}; //the key should be '0' for making array ordered from this object
        category.forEach((c) => { cateObj[c.ctg_idx] = c.ctg_title });
        setCateObj(cateObj);        
    }, [category]);

    //render
    return (
        <StyledWindow>
            <StyledConatainer>
                <StyledHeader>
                    {searchGear}
                    <StyledFilterArea horizontal={true}>
                        {chkFilterGear}
                        {selectFilterGear}
                    </StyledFilterArea>
                </StyledHeader>
                {mapGear}
            </StyledConatainer>
            {categoryModalGear}
            {storeListModalGear}
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
    margin:0 20px;
`;
const StyledSearchBar = styled.View`
    margin:15px 0;
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
    margin:25px 0;
`;
const StyledFilterArea = styled.ScrollView`
    overflow:visible;
`;
const StyledFilterItem = styled.TouchableOpacity`
    padding:5px 14px 3.5px 14px;
    border-width:1px;
    border-color:${(props) => props.selected ? '#F33562' : '#D7D7D7'};
    margin-right:10px;
    border-radius:50px;
    flex-direction:row;
`;
const StyledFilterItemText = styled.Text`
    font-size:14px;
    font-weight:700;
    color:${(props) => props.selected ? '#F33562' : '#444'};
`;