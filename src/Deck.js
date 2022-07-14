import React, { useMemo, useRef, useState } from 'react';
import { Text, View, Animated, PanResponder, TouchableWithoutFeedback, Easing, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { IconCross, IconTick } from './svg';

const LEFT_SWIPE = 'Left';
const RIGHT_SWIPE = 'Right';
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const Deck = ({data, renderEmptyList, onSwipeLeft, onSwipeRight}) => {
    const position = useRef(new Animated.Value(0)).current;
    const rotation = useRef(new Animated.Value(50)).current;
    const sideOpacity = useRef(new Animated.Value(1)).current;
    const [side, setSide] = useState(0);

    const [currIndex, setCurrIndex] = useState(0);

    const renderCard = (itemData, side) => {
        return (
          <View>
            <Text style={styles.cartText}>{side === "FRONT" ? itemData.term : itemData.definition}</Text>
          </View>
        )
      }
    
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
          onSwipeLeft();
        } else if (direction === RIGHT_SWIPE) {
          x = SCREEN_WIDTH*2;
          onSwipeRight();
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
        <View style={styles.deckContainer}>
    
        {data.length > currIndex ? 
            <Animated.View style={[cardStyles, {width: SCREEN_WIDTH}]} {...panResponder.panHandlers}>
                <Animated.View style={[styles.cardContainer, cardStylesA]}>{renderCard(data[currIndex], "FRONT")}</Animated.View>
                <Animated.View style={[styles.cardContainer, cardStylesB]}>{renderCard(data[currIndex], "BACK")}</Animated.View>
            </Animated.View> : <Text>No more cards</Text>}
  
        <View style={styles.buttonsSection}>
            <TouchableOpacity onPress={() => onSwipe(LEFT_SWIPE)}><View style={styles.button}><IconCross size={30} color="#2d248a" /></View><Text></Text></TouchableOpacity>
            <TouchableOpacity onPress={() => onSwipe(RIGHT_SWIPE)}><View style={styles.button}><IconTick size={30} color="#2d248a" /></View><Text></Text></TouchableOpacity>
        </View>
        </View>
)};

const styles = StyleSheet.create({
    deckContainer: {
        alignItems: 'center', 
        width: SCREEN_WIDTH, 
        flexGrow: 4, 
        justifyContent: 'space-between'
    },
      cartText: {
        color: '#dadada',
        fontSize: 20,
        textAlign: 'center'
      },
    cardContainer: {
      position: "absolute",
      top: 0,
      backgroundColor: '#263859',
      borderRadius: 20,
      width: SCREEN_WIDTH-40,
      height: SCREEN_HEIGHT/3,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',

    },
    buttonsSection: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        justifyContent: 'space-evenly',
        position: 'absolute',
        bottom: 0,
    },
    button: {
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: '50%', 
        shadowColor: '#414141', 
        shadowOffset: {width: 2, height: 5}, 
        shadowOpacity: 1, 
        shadowRadius: 3
    }
  })

export default Deck;
