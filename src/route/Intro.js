//------------------------------ MODULE --------------------------------
import { Text, Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useNavigation } from '@react-navigation/native';

//---------------------------- COMPONENT -------------------------------
export default function Intro(){
    //init
    const colors = ['tomato', 'thistle', 'skyblue', 'teal'];
    const navigation = useNavigation();

    //render
    return(
        <SwiperFlatList
            index = {0}
            showPagination
            data={colors}
            paginationStyle={styles.pagination}
            renderItem={({ item }) => (
                <View style={[styles.child, {backgroundColor: item}]}>
                    <Text style={styles.text}>{item}</Text>
                    {item == 'teal'
                        ?
                        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("PermissionCard")}>
                            <Text style={styles.buttonText}>START</Text>
                        </TouchableOpacity>
                        : null
                    }
                </View>
            )}
        />
    );
};

//------------------------------- STYLE --------------------------------
const { width } = Dimensions.get('window');
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container:{
        flex:1,
        background: 'white',
    },
    child: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: width*0.3,
        textAlign: 'center',
        paddingBottom: '80%'
    },
    pagination: {
        paddingBottom: '20%'
    },
    button: {
        width: '70%',
        height: 40,
        backgroundColor: "gold",
        justifyContent: "center",
        alignItems: "center",
        margin:20
    },
    buttonText: {
        fontWeight: "bold",
        color: "grey"
    },
});