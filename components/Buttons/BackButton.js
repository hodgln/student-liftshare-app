import React, { useState } from 'react'
// import * as RootNavigation from '../navigation/RootNavigation';
import { useNavigation } from '@react-navigation/core';
import { Button, View, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native';


const BackButton = (props) => {

    return (
        <View>
        <TouchableOpacity onPress={
            props.onPress
        }>
       <Ionicons name="chevron-back" size={50} color="black" />
       </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    ionicon: {
        fontSize: 50
    }
})

export default BackButton;