import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Touchable, TouchableOpacity } from 'react-native';
import Card from './src/Card';
import { BACK_SIDE, FRONT_SIDE, NEW_COLOR, KNOWN_COLOR } from './src/constants';
import { WORDS_GROUP } from './src/data';
import Deck from './src/Deck';
import { IconCross, IconTick, SquareIcon } from './src/svg';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function App() {
  const [progress, setProgress] = useState([]);

  const onSwipeLeft = () => {
    setProgress(prev => [...prev, NEW_COLOR])
  }

  const onSwipeRight = () => {
    setProgress(prev => [...prev, KNOWN_COLOR])
  }

  const onSwipeEnd = () => {
    setProgress([])
  }

  const frontCardSide = (data, side) => (
    <Card itemData={data} side={FRONT_SIDE} />
  )

  const backCardSide = (data, side) => (
    <Card itemData={data} side={BACK_SIDE} />
  )

  const progressItem = (color, i) => (
    <View key={i} style={styles.progressIcon}>
      <SquareIcon color={color} />
    </View>
  )

  const crossButton = () => (
        <View style={styles.button}>
            <IconCross size={30} color="#2d248a" />
        </View>
  );

  const tickButton = () => (
          <View style={styles.button}>
              <IconTick size={30} color="#2d248a" />
          </View>
  );

  const noCardLeft = () => (
    <Text>Look through cards one more time</Text>
  )
  
  return (
    <View style={styles.container}>
      <View style={styles.progressSection}>{progress.map((item, index)=>progressItem(item, index))}</View>
      <Deck 
          data={WORDS_GROUP} 
          backCard={backCardSide} 
          frontCard={frontCardSide} 
          renderEmptyList={null} 
          onSwipeLeft={onSwipeLeft} 
          onSwipeRight={onSwipeRight} 
          onSwipeEnd={onSwipeEnd}
          showButtons
          leftButton={crossButton}
          rightButton={tickButton}
          buttonsSectionStyle={styles.buttonsSectionStyle}
          containerStyle={styles.deckContainerStyle}
          noCardsLeft={noCardLeft}
          />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9d9f3',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 40,
  },
  progressSection: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 0,
    width: SCREEN_WIDTH,
    height: 15,
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  progressIcon: {
    margin: 1
  },
  button: {
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 50, 
    shadowColor: '#414141', 
    shadowOffset: {width: 2, height: 5}, 
    shadowOpacity: 1, 
    shadowRadius: 3,
    elevation: 1
  },
  buttonsSectionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: SCREEN_WIDTH,
  },
  deckContainerStyle:{
    alignItems: 'center', 
    justifyContent: 'space-between',
    flexGrow: 1, 
  }
})