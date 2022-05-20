import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSelector } from 'react-redux';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


const DummyRouteInput = (props) => {

    const onCrossPress = () => {
        props.setValueName(null)
        props.setID(null)
    }

    return (

        <View style={styles.Input}>

            <View style={{ flexDirection: 'row', width: '100%', height: '100%' }}>
                <View style={{ justifyContent: 'center'}}>
                    {props.placeholder === "to" ?
                    
                    (<Ionicons name="ios-location-outline" size={24} color={props.valueName ? "#0466c8" : "grey"} style={{ marginRight: '2%'}}/>)
                    :
                    null}
                    {props.placeholder === "from" ?
                    (<MaterialCommunityIcons name="record-circle-outline" size={20} color={props.valueName ? "#0466c8" : "grey"} style={{ marginRight: '2%'}}/>)
                    :
                    null}
                </View>
                <View style={{ width: '80%', height: '100%', justifyContent: 'center' }}>
                    <TouchableWithoutFeedback onPress={props.setIsVisible} style={{ justifyContent: 'center'}}>
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

        </View>

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
        width: '100%',
        backgroundColor: 'lightgrey'
    },
    valid: {
        borderWidth: 1
    },
    placeholder: {
        color: 'grey',
        fontFamily: 'Inter_Regular'
    }
});