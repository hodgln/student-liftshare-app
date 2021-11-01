import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'


const NextButton = (props) => {

    

    return (
     <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
         <View>
         <LinearGradient 
             style={styles.button}
             colors={props.disabled ? ['#808080', '#808080', '#808080'] : ['#00bfff', '#6495ed', '#1e90ff']} 
             start={{ x: 0.2, y: 0.9}}
             end={{ x: 0.9, y: 0.9 }}
             >
             <Text style={{ color: 'white' }}>{props.text}</Text>
             </LinearGradient>
         </View>
     </TouchableOpacity>

    )
}

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({

    button: {
        width: Dimensions.get('window').width * 0.85,
        borderRadius: 32,
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.07,
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: {
            height: 6,
            width: -6
        },
        shadowOpacity: 0.4,
        shadowRadius: 9,
        marginTop: Dimensions.get('window').height * 0.05
    },
    disabledButton: {
        width: Dimensions.get('window').width * 0.85,
        borderRadius: 32,
        alignItems: 'center',
        backgroundColor: 'grey',
        height: Dimensions.get('window').height * 0.07,
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * 0.05
    }
})

export default NextButton;