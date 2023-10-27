import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function setViewedStore(item){
    const listLength = 20;
    const originalList = await AsyncStorage.getItem('viewedStore');
    let newList = originalList && Array.isArray(JSON.parse(originalList)) ? JSON.parse(originalList) : [];
    if(!(newList.includes(item))) newList.unshift(item);
    if(newList.length > listLength) newList.pop();
    AsyncStorage.setItem('viewedStore', JSON.stringify(newList));
}