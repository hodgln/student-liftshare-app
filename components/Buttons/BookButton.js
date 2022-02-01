import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';


const BookButton = (props) => {

        const navigation = useNavigation()

        return (
            <TouchableOpacity onPress={() => navigation.navigate("Payment", { liftid: props.liftshare_id })} disabled={props.disabled}>
                <View style={styles.confirmed}>
                        <Text style={{ color: 'white', fontFamily: 'Inter_600SemiBold', fontSize: 17 }}>{props.text}</Text>
                </View>
            </TouchableOpacity>

        )
    }

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({

    confirmed: {
        width: Dimensions.get('screen').width * 0.3,
        borderRadius: 9,
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.04,
        justifyContent: 'center',
        backgroundColor: '#0466c8'
        // backgroundColor: '#11AC38'
    }
})

export default BookButton;