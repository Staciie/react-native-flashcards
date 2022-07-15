import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { WORDS_GROUP } from './src/data';
import Deck from './src/Deck';
import { SquareIcon } from './src/svg';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const NEW = 'rgba(116,130,143,.6)';
const KNOWN = 'rgba(65,146,75,.6)';

export default function App() {
  const [progress, setProgress] = useState([]);

  const onSwipeLeft = () => {
    setProgress(prev => [...prev, NEW])
  }

  const onSwipeRight = () => {
    setProgress(prev => [...prev, KNOWN])
  }

  const onSwipeEnd = () => {
    setProgress([])
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.progressSection}>{progress?.map((item, index)=><View style={styles.progressIcon}><SquareIcon color={item} /></View>)}</View>
      <Deck data={WORDS_GROUP} renderEmptyList={null} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} onSwipeEnd={onSwipeEnd}/>
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
    padding: 20,
    paddingBottom: 0,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  progressIcon: {
    margin: 1
  }
})