import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'


const CheckInButton = (props) => {



    return (
     <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
         <View>
         <LinearGradient 
             style={styles.button}
             colors={props.disabled ? ['#0352A0'] : ['#C80466', '#D6438C']} 
             start={{ x: 0.2, y: 0.9}}
             end={{ x: 0.9, y: 0.9 }}
             >
             <Text style={{ color: 'white', fontSize: 19, fontFamily: 'Inter_600SemiBold' }}>{props.text}</Text>
             </LinearGradient>
         </View>
     </TouchableOpacity>

    )
}

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({

    button: {
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.055,
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: {
            height: 6,
            width: -6
        },
        shadowOpacity: 0.4,
        shadowRadius: 9,
    },
    disabledButton: {
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: 'grey',
        height: Dimensions.get('window').height * 0.06,
        justifyContent: 'center',
    }
})

export default CheckInButton;