
import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons'; 


const RouteInput = (props) => {

    const token = useSelector(state => state.authorisation.userToken)

    const getAutocompleteResults = async (text) => {
        if (text.length > 2) {
            try {

                const response = await fetch(`http://192.168.1.142:8081/locations/${text}`, {
                    method: 'GET',
                    headers: {
                        token: token
                    }
                });

                const parseRes = await response.json();

                props.setResults(parseRes.map(element => {
                    return ({ name: element.description, id: element.place_id })
                }));

                //create new array with objects name & placeid

            } catch (error) {
                console.log(error.message)
            }
        } else {
            props.setResults([])
        }
    }

    const onCrossPress = () => {
        props.setValueName(null)
        props.setID(null)
    }

    return (

        <View style={props.styleType ? [styles.Input, styles.valid] : styles.Input} tint='dark' intensity={40}>

            <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{width: '80%', height: '100%' }}>
                    <TextInput
                        {...props}
                        placeholder={props.placeholder}
                        keyboardType='default'
                        autoCapitalize='none'
                        returnKeyType='done'
                        autoCorrect={false}
                        value={props.valueName}
                        onChangeText={text => getAutocompleteResults(text)}
                        style={{ height: '100%', fontFamily: 'Inter_400Regular' }}
                        autoFocus={true}
                    />
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

export default RouteInput;

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
        borderColor: 'green',
        borderWidth: 1.8
    }
});