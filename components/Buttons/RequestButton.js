import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';


const RequestButton = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
            <View style={props.style === "accept" ? styles.accept : styles.decline}>
                {props.style === "accept" ?
                    (<Text style={{ color: 'white', fontFamily: 'Inter_600SemiBold', fontSize: 17 }}>{props.style}</Text>)
                    :
                    (<Text style={{ color: '#0466c8', fontFamily: 'Inter_600SemiBold', fontSize: 17 }}>{props.style}</Text>)
                }
            </View>
        </TouchableOpacity>

    )
}

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({

    accept: {
        width: Dimensions.get('screen').width * 0.3,
        borderRadius: 9,
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.04,
        justifyContent: 'center',
        marginTop: '10%',
        backgroundColor: '#0466c8',
        marginHorizontal: '3%'
    },
    decline: {
        width: Dimensions.get('screen').width * 0.3,
        borderRadius: 9,
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.04,
        justifyContent: 'center',
        marginTop: '10%',
        borderColor: '#0466c8',
        borderWidth: 1,
        marginHorizontal: '3%'
    }
})

export default RequestButton;