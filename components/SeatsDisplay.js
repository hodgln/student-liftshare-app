import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Button, Alert } from 'react-native'
import { useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons';
import BookButton from './Buttons/BookButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SeatsDisplay = (props) => {

    const { seats } = props

    return (
        <View style={styles.container}>
            <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                {/* <Text style={{ fontFamily: 'Inter_200ExtraLight' }}>Available seats:</Text> */}
                <View style={{ flexDirection: 'row' }}>
                    {/* <Text style={{ fontSize: 32, fontFamily: 'Inter_700Bold', color: "#0466c8"}}>2</Text> */}
                    <MaterialCommunityIcons name="seatbelt" size={32} color="#0466c8" />
                    <MaterialCommunityIcons name="seatbelt" size={32} color={seats > 1 ? "#0466c8" : "lightgrey"} />
                    <MaterialCommunityIcons name="seatbelt" size={32} color={seats > 2 ? "#0466c8" : "lightgrey"} />
                    <MaterialCommunityIcons name="seatbelt" size={32} color={seats > 3 ? "#0466c8" : "lightgrey"} />
                </View>
            </View>
            <View style={styles.verticalLine}></View>
            <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                <BookButton text="Book Lift" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('screen').height * 0.09,
        width: Dimensions.get('screen').width * 0.78,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    columnSection: {
        alignItems: 'center',
        width: '33%'
    },
    headerText: {
        fontFamily: 'Inter_400Regular',
        color: 'white'
    },
    boldText: {
        fontFamily: 'Inter_800ExtraBold',
        fontSize: 30,
        color: 'white'
    },
    nameText: {
        fontFamily: 'Inter_600SemiBold',
        color: 'white'
    },
    linearGradient: {
        flex: 1
    },
    verticalLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#909090',
        alignSelf: 'center'
    },
})

export default SeatsDisplay;



