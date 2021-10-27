import React, { useReducer, useCallback, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Alert, Dimensions, TouchableOpacity } from 'react-native'
import Input from '../components/Input';
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from '@react-navigation/core';
import BackButton from '../components/Buttons/BackButton';

const DriverSignUpOne = ({ route, navigation }) => {

    const FORM_UPDATED = 'FORM_UPDATED';

    const { category } = route.params;

    const formReducer = (state, action) => {
        if (action.type === FORM_UPDATED) {
            const updatedValues = {
                ...state.inputValues,
                [action.input]: action.value
            }
            const updatedValidities = {
                ...state.inputValidities,
                [action.input]: action.isValid
            }
            let updatedFormIsValid = true;
            for (const key in updatedValidities) {
                updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
            }
            return {
                formIsValid: updatedFormIsValid,
                inputValidities: updatedValidities,
                inputValues: updatedValues
            }

        }
        return state;
    };




    const [formState, dispatchFormState] = useReducer(formReducer,
        {
            inputValues: {
                email: '',
                password: '',
                confirm: ''
            },
            inputValidities: {
                email: false,
                password: false,
                confirm: false
            },
            formIsValid: false
        });

    console.log(formState.inputValidities.confirm)

    console.log(formState.inputValues.confirm)

    const textChangeHandler = useCallback((inputID, text) => {
        //const regChecker = /^[\w]+[\w.%+-]*@[\w.-]+\.ac\.uk$/
        let isValid = false;
        // if (inputID === 'email' && regChecker.test(text.toLowerCase()) === true) {
        //     isValid = true;

        //temp for email confirmation
        if (inputID === 'email') {
            isValid = true
        }
        if (inputID === 'password' && text.trim().length > 8) {
            isValid = true
        }
        if (inputID === 'confirm' && text.trim().length > 8) {
            isValid = true
        }
        dispatchFormState({
            type: FORM_UPDATED,
            value: text,
            isValid: isValid,
            input: inputID
        });
    }, [dispatchFormState]);

    const goPressHandler = async () => {
        const passwordsMatch = await formState.inputValues.confirm === formState.inputValues.password

        if (passwordsMatch) {
            navigation.navigate('SignUpTwo', {
                email: formState.inputValues.email,
                password: formState.inputValues.password,
                category: category
            })
        } else {
            Alert.alert("Passwords do not match")
        }
    }

    const signUpText = `${category} Sign Up`

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    return (
        <ScrollView>
            <View>
                <View style={styles.headerComponent}>
                    <View style={styles.backButton}>
                        <BackButton onPress={() => navigation.goBack()} />
                    </View>
                </View>
                <View style={{ alignItems: 'center', padding: '2%' }}>
                    <Text style={{ fontWeight: '700', fontSize: 25 }}>{capitalizeFirstLetter(signUpText)}</Text>
                </View>
                <View style={styles.LogIn}>
                    <View style={styles.margins}>
                    <Text style={{fontSize: 20, marginBottom: Dimensions.get('window').height * 0.01}}>enter your university email:</Text>
                    <Text style={{fontSize: 13}}>* this should end in '.ac.uk' *</Text>
                        <Input
                            inputID='email'
                            placeholder='university email'
                            keyboardType='email-address'
                            onChangeText={textChangeHandler.bind(this, 'email')}
                            initialValue={''}
                            initiallyValid={false}
                            email={formState.inputValues.email}
                            styleType={formState.inputValidities.email}
                            iconName="mail-outline"
                        />
                        <View style={{ marginLeft: Dimensions.get('window').width * 0.1}}>
                        
                        </View>
                    </View>
                    <View style={styles.margins}>
                        <Text style={{fontSize: 20}}>create a password:</Text>
                        <Input
                            inputID='password'
                            placeholder='password'
                            onChangeText={textChangeHandler.bind(this, 'password')}
                            initialValue={''}
                            initiallyValid={false}
                            styleType={formState.inputValidities.password}
                            iconName="md-lock-closed-outline"
                        />
                        <Input
                            inputID='confirm'
                            placeholder='confirm password'
                            onChangeText={textChangeHandler.bind(this, 'confirm')}
                            initialValue={''}
                            initiallyValid={false}
                            styleType={formState.inputValidities.confirm}
                            iconName="md-lock-closed-outline"
                        />
                    </View>
                    <TouchableOpacity disabled={!formState.formIsValid} onPress={goPressHandler} style={{marginBottom: Dimensions.get('window').height * 0.05}}>
                        <Ionicons name="chevron-forward-circle-outline" size={40} color={formState.formIsValid ? "green" : "black"} />
                    </TouchableOpacity>
                </View>
                {/* <TouchableOpacity onPress={props.navigation.navigate("DSignUp")} >
                <Ionicons name="chevron-forward-circle-outline" size={24} color="black" />
                </TouchableOpacity> */}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    LogIn: {
        backgroundColor: '#fff',
        alignItems: 'center',
        //padding: '3%',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        overflow: 'hidden',
        flex: 1
    },
    headerComponent: {
        height: Dimensions.get('window').height * 0.2,
        padding: '3%'
    },
    backButton: {
        alignSelf: 'flex-start',
        width: '100%',
        marginTop: Dimensions.get('window').height * 0.025
    },
    margins: {
        marginVertical: Dimensions.get('window').height * 0.045
    }
})


export default DriverSignUpOne;