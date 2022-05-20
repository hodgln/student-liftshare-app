import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';


const CompleteButton = (props) => {

        return (
            <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
                <View style={styles.button}>
                        <Text style={{ color: 'white', fontFamily: 'Inter_SemiBold', fontSize: 17 }}>{props.text}</Text>
                </View>
            </TouchableOpacity>

        )
    }

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({

    // confirmed: {
    //     width: Dimensions.get('screen').width * 0.3,
    //     borderRadius: 9,
    //     alignItems: 'center',
    //     height: Dimensions.get('window').height * 0.04,
    //     justifyContent: 'center',
    //     backgroundColor: '#0466c8'
    //     // backgroundColor: '#11AC38'
    // },
    button: {
        width: Dimensions.get('screen').width * 0.8,
        borderRadius: 10,
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.06,
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: {
            height: 6,
            width: -6
        },
        shadowOpacity: 0.4,
        shadowRadius: 9,
        marginTop: Dimensions.get('window').height * 0.05,
        backgroundColor: '#0466c8'
    },
})

export default CompleteButton;