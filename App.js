import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { WORDS_GROUP } from './src/data';
import Deck from './src/Deck';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const renderCard = (itemData, side) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cartText}>{side === "FRONT" ? itemData.term : itemData.definition}</Text>
    </View>
  )
}

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.cardWrap}>
        <Deck data={WORDS_GROUP} renderCard={renderCard} renderEmptyList={null} onSwipeLeft={null} onSwipeRight={null}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9d9f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrap: {
    width: SCREEN_WIDTH-40,
    height: SCREEN_HEIGHT/3,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#263859',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  cartText: {
    color: '#dadada',
    fontSize: 20,
    textAlign: 'center'
  }
})