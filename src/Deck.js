import React, { useMemo, useRef, useState } from 'react';
import { Text, View, Animated, PanResponder, TouchableWithoutFeedback, Easing, Dimensions, StyleSheet } from 'react-native';

const LEFT_SWIPE = 'Left';
const RIGHT_SWIPE = 'Right';
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const Deck = ({data, renderCard, renderEmptyList, onSwipeLeft, onSwipeRight}) => {
    const position = useRef(new Animated.Value(0)).current;
    const rotation = useRef(new Animated.Value(50)).current;
    const sideOpacity = useRef(new Animated.Value(1)).current;
    const [side, setSide] = useState(0);

    const [currIndex, setCurrIndex] = useState(0);

    const cardRotationA = rotation.interpolate({
        inputRange: [50, 100],
        outputRange: ["0deg", "180deg"],
        extrapolate: "clamp"
      });

      const cardRotationB = rotation.interpolate({
        inputRange: [50, 100],
        outputRange: ["-180deg", "0deg"],
        extrapolate: "clamp"
      });

    const cardStyles = {
        opacity: sideOpacity,
        transform: [{
            translateX: position
        }]
    };

    const cardStylesA = {
        transform: [{
            rotateY: cardRotationA
        }
    ],
        zIndex: side === 0 ? 1 : 0
    }

    const cardStylesB = {
        transform: [{
            rotateY: cardRotationB
        }
    ],
        zIndex: side === 0 ? 0 : 1
    }

    const resetCardState = () => {
        position.setValue(0); 
        setCurrIndex(prevIndex => prevIndex +1);
        setSide(0);
        rotation.setValue(50);
    };

    const onSwipe = (direction) => {
        let x = 0;
        if (direction === LEFT_SWIPE) {
          x = -SCREEN_WIDTH*2;
        } else if (direction === RIGHT_SWIPE) {
          x = SCREEN_WIDTH*2;
        }
        Animated.parallel([
            Animated.timing(position, {
                toValue: x,
                duration: 250,
                useNativeDriver: true
            }),
            Animated.timing(sideOpacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            })
        ]).start(() => {
            resetCardState();
            Animated.timing(sideOpacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            }).start();   
        });
      }

      function flip() {
        const value = side === 0 ? 100 : 50;
        Animated.timing(rotation, {
            toValue: 75,
            duration: 100,
            easing: Easing.in,
            useNativeDriver: true
        }).start(() => {
            setSide(prev => prev === 0 ? 1 : 0);
            Animated.timing(rotation, {
                toValue: value,
                duration: 100,
                easing: Easing.in,
                useNativeDriver: true
            }).start()
        })
      }

    const panResponder = useMemo( 
        () => PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                position.setValue(gesture.dx)
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx === 0 && gesture.dy === 0) {
                    flip();
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
        }), [side]
    );


    return (
        data.length > currIndex ? 
            <Animated.View style={[styles.cardContainer, cardStyles]} {...panResponder.panHandlers}>
                <Animated.View style={[styles.cardContainer, cardStylesA]}>{renderCard(data[currIndex], "FRONT")}</Animated.View>
                <Animated.View style={[styles.cardContainer, cardStylesB]}>{renderCard(data[currIndex], "BACK")}</Animated.View>
            </Animated.View> : <Text>No more cards</Text>
)};

const styles = StyleSheet.create({
    cardContainer: {
      position: "absolute",
      flex: 1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } 
  })

export default Deck;
