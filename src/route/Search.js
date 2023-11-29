//------------------------------ MODULE --------------------------------
import { useState, useMemo, useLayoutEffect, useRef } from 'react';
import { MapView, SelectModal, StoreListView, SearchView } from '@/component';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { defaultLocation } from '@/data/constants';
import { apiCall } from '@/lib';
import { useCategory, useLike } from '@/hooks';
import { timeToNumber } from '@/lib';
import { Animated } from 'react-native';
import Modal from 'react-native-modalbox';

//---------------------------- COMPONENT -------------------------------
export default function Search({route}){
    //init
    const searchBarWidth = useRef(new Animated.Value(100)).current;
    const inputRange = [80, 100];
    const outputRange = ["80%", "100%"];
    const searchBarAnimation = searchBarWidth.interpolate({inputRange, outputRange});
    const searchBarRef = useRef();
    const targetStore = route.params?.target;

    //data
    const [category] = useCategory();
    const [like] = useLike();

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
    const [searchFocus, setSearchFocus] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [keyword, setKeyword] = useState('');

    //function 
    const closeSearch = () => {
        setSearchFocus(false); 
        searchBarRef.current.blur(); 
        setSearchText(null);
        setKeyword(null);
    };

    //memo
    const searchGear = useMemo(() => {
        Animated.timing(searchBarWidth, {
            toValue: searchFocus? 90 : 100,
            duration: 300,
            useNativeDriver: false
        }).start();            
        
        const searchSubmit = () => setKeyword(searchText);
        const openSearch = () => setSearchFocus(true);

        return (
            <>
            <StyledSearchBar style={{width: searchBarAnimation}}>
                <StyledSearchBackIcon 
                    name='caret-back' 
                    color='#F33562' 
                    size={40} 
                    onPress={closeSearch} 
                    suppressHighlighting={true}
                />
                <StyledSearchBarInput 
                    ref={searchBarRef} 
                    onFocus={openSearch} 
                    placeholder="매장, 지역 이름으로 검색하세요" 
                    placeholderTextColor={'#333'}
                    onChangeText={(text) => setSearchText(text)}
                    value={searchText}
                    onSubmitEditing={searchSubmit}
                    returnKeyType="done"
                />
                {searchText ? <Icon name="close-circle" color="#999" size={18} onPress={() => setSearchText(null)}/> : null}
                <StyledSearchBarIcon suppressHighlighting={true} name ="md-search-outline" onPress={searchSubmit}/>
            </StyledSearchBar>
            </>
        );
    }, [searchFocus, searchText]);

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
        if(targetStore && searchFocus) closeSearch(); //execute closing method only in case view already opened
        return (
            <MapView markerData={markerData || []} onCenterChange={setCenter} listOpen={setStoreListOpen} targetStore={targetStore}/>
        );
    }, [markerData, targetStore]);

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
        if(!markerData) return;
        return (
            <StyledListModal
                isOpen={storeListOpen}
                onClosed={() => {setStoreListOpen(false)}} //reset if not changed
                backdropOpacity={0.4}
                position="bottom"
                swipeToClose={false}
            >            
                <StoreListView list={markerData} />
            </StyledListModal>
        )
    }, [markerData, storeListOpen]);

    const searchViewGear = useMemo(() => {
        return searchFocus ? <SearchView keyword={keyword}/> : null;
    }, [searchFocus, keyword]);

    //effect  
    useLayoutEffect(() => { //filtering
        if(!storeData) return null;

        const td = new Date().getDay() || 7;
        const now = Number(timeToNumber(new Date()));

        const filteredData = storeData.length ? 
            storeData.map((i) => {
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
                    };
                }
                //voucher filter
                if(voucherChk){
                    if(i.store_voucher_use_yn != 'y') return undefined;
                };                
                return i;
            }).filter(e=>e) : [];

        setMarkerData(filteredData);
    }, [storeData, voucherChk, availChk, cateSelect]);

    useLayoutEffect(() => {
        try{
            if(!center) return null;

            //range set
            const southWestPoint = center.cover[0];
            const northEastPoint = center.cover[2];
            const params = {
                store_addr_x_ge:southWestPoint.longitude,
                store_addr_x_le:northEastPoint.longitude,
                store_addr_y_ge:southWestPoint.latitude,
                store_addr_y_le:northEastPoint.latitude,
            };
            
            //call store list
            apiCall.get('/store', {params} ).then(( res ) => {
                if(res.data.result == "000"){
                    let storeList = res.data.list;
                    //like filtering...
                    if(like){
                        storeList = res.data.list.map((obj) => {
                            const filtered = like.filter((i) => i.mb_like_store_idx == obj.store_idx).length;
                            return {
                                ...obj,
                                like: filtered ? true : false
                            };   
                        });
                    }
                    setStoreData(storeList);
                }else if(res.data.result=='001'){
                    setStoreData([]);
                }
            });
        }catch(e){
            console.log(e);
        }
    }, [center, like]);     

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
                <StyledBody>
                    {mapGear}
                    {searchViewGear}
                </StyledBody>
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
    margin:0 20px;
    margin-top:7px;
`;
const StyledSearchBar = styled(Animated.View)`
    margin:15px 0;
    height:40px;
    border-width:1px;
    border-color:#444;
    border-radius:5px;
    flex-direction:row;
    align-items:center;
    align-self:flex-end;
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
const StyledSearchBackIcon = styled(Icon)`
    position:absolute;
    left:-50px;
`;
const StyledBody = styled.View`
    margin:20px 0;
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
const StyledListModal = styled(Modal)`
    border-top-right-radius:25px;
    border-top-left-radius:25px;
    height:600px;
    margin-top:25%;
    overflow:hidden;
`;