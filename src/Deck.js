import React, { useRef, useState } from 'react';
import { Text, View, Animated, PanResponder, TouchableWithoutFeedback, Easing, Dimensions } from 'react-native';

const LEFT_SWIPE = 'Left';
const RIGHT_SWIPE = 'Right';
const SCREEN_WIDTH = Dimensions.get('screen').width;

const Deck = ({data, renderCard, renderEmptyList, onSwipeLeft, onSwipeRight}) => {
    
    const position = useRef(new Animated.Value(0)).current;
    const [currIndex, setCurrIndex] = useState(0);

    const onSwipe = (direction) => {
        let x = 0;
        if (direction === LEFT_SWIPE) {
          x = -SCREEN_WIDTH*2;
        } else if (direction === RIGHT_SWIPE) {
          x = SCREEN_WIDTH*2;
        }
        Animated.timing(position, {
            toValue: x,
            duration: 250,
            useNativeDriver: true
        }).start(() => {
            position.setValue(0); 
            setCurrIndex(prevIndex => prevIndex +1 );
        });
      }

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                position.setValue(gesture.dx)
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx === 0 && gesture.dy === 0) {
                    console.log('touched')
                } else if (gesture.dx > 100) {
                    onSwipe(RIGHT_SWIPE)
                } else if (gesture.dx < -100) {
                    onSwipe(LEFT_SWIPE)
                } else {
                    Animated.timing(position, {
                        toValue: 0,
                        easing: Easing.bounce,
                        useNativeDriver: true
                    }).start()
                }
            }
        })
    ).current;

    return (
        data.length > currIndex ? 
            <Animated.View style={{transform: [{translateX: position}]}} {...panResponder.panHandlers}>
                <View>
                     {renderCard(data[currIndex])}
                </View>
            </Animated.View> : <Text>No more cards</Text>
)};

export default Deck;
