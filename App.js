import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { WORDS_GROUP } from './src/data';
import Deck from './src/Deck';

export default function App() {
  return (
    <View style={styles.container}>
      <Deck data={WORDS_GROUP} />
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
});
