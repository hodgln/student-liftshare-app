import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';


const StatusButton = (props) => {
        return (
            <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
                <View style={props.style === "confirmed" ? styles.confirmed : styles.pending }>
                        <Text style={{  color: 'white', fontFamily: 'Inter_500Medium', fontSize: 17 }}>{props.text}</Text>
                </View>
            </TouchableOpacity>

        )
    }

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({

    confirmed: {
        width: Dimensions.get('screen').width * 0.35,
        borderRadius: 9,
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.04,
        justifyContent: 'center',
        // marginTop: '10%',
        backgroundColor: '#11AC38',
       
    },
    pending: {
        width: Dimensions.get('screen').width * 0.35,
        borderRadius: 9,
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.04,
        justifyContent: 'center',
        // marginTop: '10%',
        backgroundColor: '#C86604',
        
    }
})

export default StatusButton;