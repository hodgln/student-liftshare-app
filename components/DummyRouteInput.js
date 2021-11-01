import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons'; 


const DummyRouteInput = (props) => {

    const onCrossPress = () => {
        props.setValueName(null)
        props.setID(null)
    }

    return (

        <BlurView style={props.valueName ? [styles.Input, styles.valid] : styles.Input} tint='dark' intensity={40}>

            <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{width: '80%', height: '100%' }}>
                    {/* <TextInput
                        {...props}
                        placeholder="from"
                        value={props.valueName}
                        style={{ height: '100%' }}
                    /> */}
                    <TouchableWithoutFeedback onPress={props.setIsVisible}>
                    <Text style={props.valueName ? null : styles.placeholder}>{props.valueName || props.placeholder}</Text>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {props.valueName ? (
                    <TouchableOpacity onPress={onCrossPress} style={{ alignSelf: "flex-end" }}>
                    <Ionicons name="close-circle-outline" size={24} color="black" />
                    </TouchableOpacity>
                    ) : null}
                    
                </View>
            </View>

        </BlurView>

    )
};

export default DummyRouteInput;

const styles = StyleSheet.create({
    Input: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: Dimensions.get('window').height * 0.02,
        minWidth: Dimensions.get('window').width * 0.85,
        height: Dimensions.get('window').height * 0.06,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%'
    },
    valid: {
        borderColor: 'aqua',
        borderWidth: 1
    },
    placeholder: {
        color: 'grey'
    }
});