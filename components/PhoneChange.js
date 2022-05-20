import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import Input from "./Input"

const PhoneChange = (props) => {
    const [newNumber, setNewNumber] = useState();
    const [numberIsValid, setNumberIsValid] = useState(false);

    // implement regex logic for phone number from sign in
    const phoneReg = /^\d{11}$/

    useEffect(() => {
        if (phoneReg.test(newNumber) === true) {
            setNumberIsValid(true)
        }
    }, [newNumber])


    return (
        <View style={{ height: '100%' }}>
            <View style={{ height: '20%' }}>
                <Text style={{ fontFamily: 'Inter_Light', fontSize: 27 }}>Change phone number</Text>
                <View style={styles.line}></View>
            </View>
            <Text style={{ fontFamily: 'Inter_Light', paddingVertical: '2.5%' }}>this will be used for contact prior to a lift.</Text>
            <View style={{ justifyContent: 'center', height: '60%' }}>
                <Input
                    placeholder='new phone number'
                    onChangeText={(value) => setNewNumber(value)}
                    initialValue={''}
                    initiallyValid={false}
                    keyboardType='numeric'
                    maxLength={11}
                    styleType={numberIsValid}
                    iconName="call-outline"
                />
            </View>
            <View style={{ justifyContent: 'flex-end', height: '20%', width: Dimensions.get('screen').width * 0.9 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '50%', height: '100%', justifyContent: 'center', borderRightWidth: 1, borderRightColor: 'grey' }}>
                        <Button title="cancel" onPress={props.closeModal} />
                    </View>
                    
                    <View style={{ width: '50%', height: '100%', justifyContent: 'center' }}>
                        <Button title="change" onPress={() => props.changePhone(newNumber)} disabled={!numberIsValid}/>
                    </View>
                </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    line: {
        borderBottomWidth: 0.5,
        width: Dimensions.get('screen').width * 0.9,
        borderColor: 'grey',
        padding: '1%',
        marginVertical: '1.5%',
    },
});

export default PhoneChange;