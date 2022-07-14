import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { WORDS_GROUP } from './src/data';
import Deck from './src/Deck';
import { SquareIcon } from './src/svg';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const NEW = 'rgba(116,130,143,.6)';
const KNOWN = 'rgba(65,146,75,.6)';

export default function App() {

  const onSwipeLeft = () => {
    setProgress(prev => [...prev, NEW])
  }

  const onSwipeRight = () => {
    setProgress(prev => [...prev, KNOWN])
  }

  const [progress, setProgress] = useState([]);

  

  return (
    <View style={styles.container}>
      <View style={styles.progressSection}>{progress?.map(item => <Text><SquareIcon color={item} />{' '}</Text>)}</View>
      <Deck data={WORDS_GROUP} renderEmptyList={null} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9d9f3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  counterText: {
    color: "#17223b",
    fontSize: 26,
    textAlign: 'center',
    flexGrow: 1,
  },
  progressSection: {
    flexGrow: 1,
    flexDirection: 'row',
    paddingTop: 20,
  }
})