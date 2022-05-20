import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'


const LogInButton = (props) => {

    console.log(props.disabled)

    return (
     <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
         <View style={styles.buttonShadow}>
             <LinearGradient 
             style={props.disabled ? styles.disabledButton : styles.button}
            //  colors={['#00bfff', '#6495ed', '#1e90ff']}
            colors={['#C80466', '#D6438C']}
             start={{ x: 0.2, y: 0.9}}
             end={{ x: 0.9, y: 0.9 }}
             >
             {props.disabled ? (
                <ActivityIndicator size="small" />
             ) :
             (<Text style={{ color: "white", fontSize: 17, fontFamily: 'Inter_Regular' }}>{props.text}</Text>)
            }
            </LinearGradient>
         </View>
     </TouchableOpacity>

    )
}

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({

    button: {
        width: Dimensions.get('window').width * 0.85,
        borderRadius: 6,
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.07,
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * 0.05
    },
    buttonShadow: {
        shadowColor: 'black',
        shadowOffset: {
            height: 1,
            width: 1
        },
        shadowOpacity: 0.4,
        shadowRadius: 3,
    },
    disabledButton: {
        width: Dimensions.get('window').width * 0.85,
        borderRadius: 6,
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.07,
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * 0.05
    }
})

export default LogInButton;