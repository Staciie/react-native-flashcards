import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { FRONT_SIDE } from "./constants";

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const Card = ({itemData, side}) => {
    return (
        side === FRONT_SIDE ? (
            <View style={styles.container}>
                <Text style={styles.text}>{itemData.term}</Text>
            </View>
        ) : (
            <View style={[styles.container, styles.backContainer]}>
                <Image source={{uri: itemData.uri}} resizeMode="contain" style={styles.image} />
                <Text style={[styles.text, styles.backText]}>{itemData.definition}</Text>
            </View>
        )
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#263859',
        borderRadius: 20,
        width: SCREEN_WIDTH - 40,
        height: SCREEN_HEIGHT/3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20, 
    },
    text: {
        color: '#dadada',
        fontSize: 20,
    },
    backContainer: {
        flexDirection: 'row',
    },
    image: {
        width: (SCREEN_WIDTH / 3), 
        height: (SCREEN_HEIGHT / 3 - 40)
    },
    backText: {
        flex: 1, 
        flexWrap: 'wrap', 
        marginLeft: 20
    }
})

export default Card;