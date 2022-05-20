import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';


const RequestButton = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
            <View style={props.style === "filled" ? styles.filled : styles.outline}>
                {props.style === "filled" ?
                    (<Text style={{ color: 'white', fontFamily: 'Inter_Medium', fontSize: 19 }}>{props.text}</Text>)
                    :
                    (<Text style={{ color: '#0466c8', fontFamily: 'Inter_Medium', fontSize: 19 }}>{props.text}</Text>)
                }
            </View>
        </TouchableOpacity>

    )
}

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({

    filled: {
        width: Dimensions.get('screen').width * 0.3,
        borderRadius: 8,
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.04,
        justifyContent: 'center',
        marginTop: '10%',
        backgroundColor: '#0466c8',
        marginHorizontal: '3%'
    },
    outline: {
        width: '90%',
        borderRadius: 8,
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.05,
        justifyContent: 'center',
        marginTop: '10%',
        borderColor: '#0466c8',
        borderWidth: 0.5,
        marginHorizontal: '3%'
    }
})

export default RequestButton;