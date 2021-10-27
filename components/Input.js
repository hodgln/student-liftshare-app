import { useLinkProps } from '@react-navigation/native';
import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons'; 


const Input = (props) => {

    //console.log(props.styleType)

    return (
        <BlurView style={props.styleType ? [styles.Input, styles.valid] : styles.Input } tint='dark' intensity={40}>
            
            <View style={{ width: '12%', alignItems: 'flex-start', padding: 5 }}>
            <Ionicons name={props.iconName} size={24} color="grey" />
            </View>
            <View style={{ flex: 1 }}>
            <TextInput
            {...props}
                placeholder={props.placeholder}
                keyboardType='default'
                autoCapitalize='none'
                returnKeyType='done'
                autoCorrect={false}
                //value={text}
                secureTextEntry={(props.inputID === 'password' || props.inputID === 'confirm') ? true : false}
                onChangeText={props.onChangeText}
            />
            </View>
            
        </BlurView>
    )
};

export default Input;

const styles = StyleSheet.create({
    Input: {
        padding: 5,
        borderRadius: 40,
        overflow: 'hidden',
        marginTop: Dimensions.get('window').height * 0.02,
        minWidth: Dimensions.get('window').width * 0.85,
        height: Dimensions.get('window').height * 0.07,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    valid: {
        borderColor: 'green',
        borderWidth: 1.8
    }
});