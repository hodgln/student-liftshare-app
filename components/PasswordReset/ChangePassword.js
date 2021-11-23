import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native'
import Input from '../Input';
import { Ionicons } from '@expo/vector-icons'

const ChangePassword = (props) => {

    const { navigation, email } = props

    const [password, setPassword] = useState()
    const [confirm, setConfirm] = useState()

    const [passwordValid, setPasswordValid] = useState()
    const [confirmValid, setConfirmValid] = useState()


    const passwordHandler = (text) => {
        if(text.trim().length > 8) {
            setPasswordValid(true)
            setPassword(text)
        } else {
            setPasswordValid(false)
        }
    }

    const confirmHandler = (text) => {
        if(text.trim().length > 8) {
            setConfirmValid(true)
            setConfirm(text)
        } else {
            setConfirmValid(false)
        }
    }

    const goPressHandler = async () => {
        
        
            if (password === confirm) {

                await updatePassword()

                Alert.alert(
                    "Password Changed!",
                    "Please log in with your new password",
                    [
                        { text: "OK", onPress: () => navigation.navigate('Choice') }
                    ]
                )
            } else {
                Alert.alert("Passwords do not match")
            }
         
    }



    const updatePassword = async() => {
        try {

            const body = { email, password }
            
            const response = await fetch(`http://192.168.1.142:8081/auth/resetpassword`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();

            console.log(parseRes)

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <View>
            <View style={{ marginTop: Dimensions.get('window').height * 0.05 }}>
                
                <Text style={{fontSize: 20}}>create a new password:</Text>
                        <Input
                            inputID='password'
                            placeholder='password'
                            onChangeText={text => passwordHandler(text)}
                            initialValue={''}
                            initiallyValid={false}
                            styleType={passwordValid}
                            iconName="md-lock-closed-outline"
                        />
                        <Input
                            inputID='confirm'
                            placeholder='confirm password'
                            onChangeText={text => confirmHandler(text)}
                            initialValue={''}
                            initiallyValid={false}
                            styleType={confirmValid}
                            iconName="md-lock-closed-outline"
                        />
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity disabled={passwordValid && confirmValid ? false : true} onPress={goPressHandler} style={{ marginTop: Dimensions.get('window').height * 0.05 }}>
                    <Ionicons name="chevron-forward-circle-outline" size={40} color={confirmValid && passwordValid ? "green" : "black"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ChangePassword;