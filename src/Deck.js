import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, Animated, PanResponder, TouchableWithoutFeedback, Easing, Dimensions, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Card from './Card';
import { FRONT_SIDE, BACK_SIDE } from './constants';
import { IconCross, IconTick } from './svg';

const LEFT_SWIPE = 'Left';
const RIGHT_SWIPE = 'Right';
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const Deck = (props) => {
    const {
        data, 
        frontCard, 
        backCard, 
        onSwipeLeft, 
        onSwipeRight, 
        onSwipeEnd, 
        showButtons, 
        leftButton, 
        rightButton, 
        buttonsSectionStyle, 
        containerStyle, 
        noCardsLeft
    } = props;

    const [side, setSide] = useState(0);
    const [currIndex, setCurrIndex] = useState(0);

    const position = useRef(new Animated.Value(0)).current;
    const rotation = useRef(new Animated.Value(50)).current;
    const sideOpacityA = useRef(new Animated.Value(2)).current;

    const showCards = data.length > currIndex;
    
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

      const sideOpacityB = sideOpacityA.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 0, 1]
      })

    const cardStyles = {
        transform: [{
            translateX: position
        }]
    };

    const cardStylesA = {
        opacity: sideOpacityA,
        transform: [{
            rotateY: cardRotationA
        }
    ],
        zIndex: side === 0 ? 1 : 0
    }

    const cardStylesB = {
        opacity: sideOpacityB,
        transform: [{
            rotateY: cardRotationB
        }
    ],
        zIndex: side === 0 ? 0 : 1
    }

    const resetCardState = () => {
        position.setValue(0); 
        setCurrIndex(prevIndex => prevIndex + 1);
        setSide(0);
        rotation.setValue(50);
    };

    const onSwipe = (direction) => {
        let x = 0;
        if (direction === LEFT_SWIPE) {
          onSwipeLeft();
          x = -SCREEN_WIDTH * 2;
        } else if (direction === RIGHT_SWIPE) {
          onSwipeRight();
          x = SCREEN_WIDTH * 2;
        }
        Animated.parallel([
            Animated.timing(position, {
                toValue: x,
                duration: 250,
                useNativeDriver: true
            }),
            Animated.timing(sideOpacityA, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            })
        ]).start(() => {
            resetCardState();
            Animated.timing(sideOpacityA, {
                toValue: 2,
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
                    onSwipe(RIGHT_SWIPE);
                } else if (gesture.dx < -100) {
                    onSwipe(LEFT_SWIPE);
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

    const crossButton = () => (
        <TouchableOpacity onPress={() => onSwipe(LEFT_SWIPE)}>
            <View style={styles.button}>
                <IconCross size={30} color="#2d248a" />
            </View>
        </TouchableOpacity>
    );

    const tickButton = () => (
        <TouchableOpacity onPress={() => onSwipe(RIGHT_SWIPE)}>
            <View style={styles.button}>
                <IconTick size={30} color="#2d248a" />
            </View>
        </TouchableOpacity>
    );

    const onResetList = () => {
        setCurrIndex(0); 
        onSwipeEnd();
    }

    return (
        <View style={containerStyle}>
        {showCards ? (
            <Animated.View style={cardStyles} {...panResponder.panHandlers}>
                <Animated.View style={[cardStylesA, {position: 'absolute'}]}>{frontCard(data[currIndex])}</Animated.View>
                <Animated.View style={cardStylesB}>{backCard(data[currIndex])}</Animated.View>
            </Animated.View> ) : (
            <TouchableOpacity onPress={onResetList}>{noCardsLeft()}</TouchableOpacity>
        )}
        
        {showCards && (
            <View style={buttonsSectionStyle}>
                {leftButton && 
                    <TouchableOpacity onPress={() => onSwipe(LEFT_SWIPE)}>
                        {leftButton()}
                    </TouchableOpacity>
                }
                {rightButton && 
                    <TouchableOpacity onPress={() => onSwipe(RIGHT_SWIPE)}>
                        {rightButton()}
                    </TouchableOpacity>
                }
            </View>
        )}
        </View>
    )};

const styles = StyleSheet.create({
      cardText: {
        color: '#dadada',
        fontSize: 20,
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
      paddingHorizontal: 20,

    },
    buttonsSection: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        justifyContent: 'space-evenly',
        bottom: 0,
    },
    button: {
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 50, 
        shadowColor: '#414141', 
        shadowOffset: {width: 2, height: 5}, 
        shadowOpacity: 1, 
        shadowRadius: 3
    },
    image: {
        width: 50,
        height: 50
    }
  })

export default Deck;
