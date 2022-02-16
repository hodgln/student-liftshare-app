import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native'
import Input from '../Input';
import { Ionicons } from '@expo/vector-icons'

const EnterEmail = (props) => {

    const [emailValid, setEmailValid] = useState(false)

    const { email, setEmail, setStage, stages } = props

    const emailChecker = (text) => {
        // const regChecker = /^[\w]+[\w.%+-]*@[\w.-]+\.ac\.uk$/

        // if (regChecker.test(text.toLowerCase()) === true) {
        if(text.length > 4) {
            setEmailValid(true)
            setEmail(text)
        } else {
            setEmailValid(false)
        }

    }

    const onGoPress = async() => {
        // can also put this into a useEffect hook that happens immediately in ValidateCode.js

        try {

            const response = await fetch(`http://api.spareseat.app/confirmation/email/reset/${email}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const parseRes = await response.json()

            if(parseRes !== "sent") {
                Alert.alert(parseRes)
            } else {
                setStage(stages.VALIDATE_CODE)
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <View>
            <View style={{ marginTop: Dimensions.get('window').height * 0.05 }}>
                <Text>Enter the email associated with your account</Text>
                <Input
                    inputID='email'
                    placeholder='university email'
                    keyboardType='email-address'
                    onChangeText={(text) => emailChecker(text)}
                    initialValue={''}
                    initiallyValid={false}
                    // email={email}
                    styleType={emailValid}
                    iconName="mail-outline"
                />
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity disabled={!emailValid} onPress={onGoPress} style={{ marginTop: Dimensions.get('window').height * 0.05 }}>
                    <Ionicons name="chevron-forward-circle-outline" size={40} color={emailValid ? "green" : "black"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EnterEmail;