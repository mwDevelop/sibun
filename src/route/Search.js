//------------------------------ MODULE --------------------------------
import { permissionCheck } from '@/lib';
import { useLayoutEffect } from 'react';
import { MapView } from '@/component';
import { Platform, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

//---------------------------- COMPONENT -------------------------------
export default function Search(){
    //init
    const isFocused = useIsFocused();
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


    //effect
    useLayoutEffect(() => {
        if(isFocused){
            console.log('Search');
            permissionCheck(Platform.OS, 'location');
        }
    }, [isFocused]);

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
                <StyledBody>
                    <MapView/>
                </StyledBody>
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
    flex:1;
    justify-content:flex-end;
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
    font-size:25;
    text-align:center;
    color:#333;
`;
const StyledBody = styled.View`
    flex:3;
`;
const StyledFilterArea = styled.FlatList`
    flex-grow:0;
    margin-bottom:20px;
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