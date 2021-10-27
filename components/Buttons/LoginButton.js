import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';


const LogInButton = (props) => {

    console.log(props.disabled)

    return (
     <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
         <View style={props.disabled ? styles.disabledButton : styles.button}>
             <Text>{props.text}</Text>
         </View>
     </TouchableOpacity>

    )
}

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({

    button: {
        width: Dimensions.get('window').width * 0.85,
        borderRadius: 40,
        alignItems: 'center',
        backgroundColor: 'red',
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
        borderRadius: 40,
        alignItems: 'center',
        backgroundColor: 'grey',
        height: Dimensions.get('window').height * 0.07,
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * 0.05
    }
})

export default LogInButton;