import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CodeField, useBlurOnFulfill, useClearByFocusCell, Cursor } from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

const ValidateCode = (props) => {

    const { email } = props

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [properties, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    console.log(value)

    const onGoPress = async () => {
        try {

            //email needs sending to the api in the body!

            const response = await fetch(`http://localhost:8081/confirmation/reset/${value}/${email}`)

            const parseRes = await response.json()




            if (typeof parseRes === 'object') {
                Alert.alert(
                    parseRes.title,
                    parseRes.body,
                    [
                        { text: "Close" },
                        { text: "Resend", onPress: () => resendCode(email) },
                    ]
                )
            } else if (parseRes === true) {
                props.setStage(props.stages.CHANGE_PASSWORD)
            } else {
                return
            }

        } catch (error) {
            console.log(error.message)
        }
    }


    const resendCode = async (email) => {
        try {

            const response = await fetch(`http://localhost:8081/confirmation/email/reset/${email}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const parseRes = await response.json();

            if(parseRes === "sent") {
                setValue("")
            } else {
                Alert.alert(parseRes)
            }

        } catch (error) {
            console.log(error.message)
        }

    }


    return (
        <View>
            <View style={{ marginTop: Dimensions.get('window').height * 0.05 }}>
                <Text>Please enter the code sent to: {email}</Text>
                <CodeField
                    ref={ref}
                    {...properties}
                    // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                    value={value}
                    onChangeText={setValue}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                        <Text
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell]}
                            onLayout={getCellOnLayoutHandler(index)}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    )}
                />
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity disabled={value.length === 6 ? false : true} onPress={onGoPress} style={{ marginTop: Dimensions.get('window').height * 0.05 }}>
                    <Ionicons name="chevron-forward-circle-outline" size={40} color={"black"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center',
        margin: 5
    },
    focusCell: {
        borderColor: '#000',
    },
})

export default ValidateCode;