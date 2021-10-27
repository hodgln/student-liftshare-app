import React, { useReducer, useCallback, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Alert, Dimensions, TouchableOpacity } from 'react-native'
import Input from '../components/Input';
import { Ionicons } from "@expo/vector-icons"
import BackButton from '../components/Buttons/BackButton';


const SignUpTwo = ({ route, navigation }) => {

    const { email, password, category } = route.params

    const FORM_UPDATED = 'FORM_UPDATED';

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
                firstname: '',
                surname: '',
                phoneNumber: '',
            },
            inputValidities: {
                firstname: false,
                surname: false,
                phoneNumber: false,
            },
            formIsValid: false
        });



    const textChangeHandler = useCallback((inputID, text) => {
        //const regChecker = /^[\w]+[\w.%+-]*@[\w.-]+\.ac\.uk$/
        let isValid = false;
        // if (inputID === 'email' && regChecker.test(text.toLowerCase()) === true) {
        //     isValid = true;
        const phoneReg = /^\d{11}$/
        //temp for email confirmation
        if (inputID === 'firstname' && text.trim().length > 1) {
            isValid = true
        }
        if (inputID === 'surname' && text.trim().length > 1) {
            isValid = true
        }
        if (inputID === 'phoneNumber' && phoneReg.test(text) === true) {
            isValid = true
        }
        dispatchFormState({
            type: FORM_UPDATED,
            value: text,
            isValid: isValid,
            input: inputID
        });
    }, [dispatchFormState]);

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
                <Text style={{fontSize: 20, marginBottom: Dimensions.get('window').height * 0.005}}>full name:</Text>
                    <Input
                        inputID='firstname'
                        placeholder='first name'
                        onChangeText={textChangeHandler.bind(this, 'firstname')}
                        initialValue={''}
                        initiallyValid={false}
                        styleType={formState.inputValidities.firstname}
                        iconName="person-outline"
                    />
                    <Input
                        inputID='surname'
                        placeholder='last name'
                        onChangeText={textChangeHandler.bind(this, 'surname')}
                        initialValue={''}
                        initiallyValid={false}
                        styleType={formState.inputValidities.surname}
                        iconName="person-outline"
                    />
                    </View>
                    <View style={styles.margins}>
                    <Text style={{fontSize: 20, marginBottom: Dimensions.get('window').height * 0.005}}>phone number:</Text>
                    <Input
                        inputID='phoneNumber'
                        placeholder='phone number'
                        onChangeText={textChangeHandler.bind(this, 'phoneNumber')}
                        initialValue={''}
                        initiallyValid={false}
                        keyboardType='numeric'
                        maxLength={11}
                        styleType={formState.inputValidities.phoneNumber}
                        iconName="call-outline"
                    />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity disabled={!formState.formIsValid} onPress={() => navigation.navigate('SignUpThree', {
                            phoneNumber: formState.inputValues.phoneNumber,
                            firstname: formState.inputValues.firstname,
                            surname: formState.inputValues.surname,
                            email: email,
                            password: password,
                            category: category
                        })} style={{marginBottom: Dimensions.get('window').height * 0.05}}>
                            <Ionicons name="chevron-forward-circle-outline" size={40} color={formState.formIsValid ? "green" : "black"} />
                        </TouchableOpacity>
                    </View>
                </View>
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
    pictureButtons: {
        width: '50%',
        borderRadius: 15,
        shadowOffset: {
            height: 3,
            width: -3
        },
        shadowRadius: 5,
        //shadowColor: 'black',
        shadowOpacity: 0.1,
        backgroundColor: 'white',
        marginLeft: 10,
        marginTop: Dimensions.get('window').height * 0.02
    },
    headerComponent: {
        height: Dimensions.get('window').height * 0.2,
        padding: '3%'
    },
    avatar: {
        shadowOffset: {
            height: 3,
            width: -3
        },
        shadowRadius: 5,
        //shadowColor: 'black',
        shadowOpacity: 0.5,
        marginTop: Dimensions.get('window').height * 0.02
    },
    backButton: {
        alignSelf: 'flex-start',
        width: '100%',
        marginTop: Dimensions.get('window').height * 0.025
    },
    margins: {
        marginVertical: Dimensions.get('window').height * 0.045
    }
});


export default SignUpTwo;