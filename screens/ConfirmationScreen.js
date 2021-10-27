import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Button, SafeAreaView, Alert, TouchableOpacity, Dimensions } from 'react-native'
import { useDispatch } from 'react-redux';
import { CodeField, useBlurOnFulfill, useClearByFocusCell, Cursor } from 'react-native-confirmation-code-field';
import { LOGGED_IN } from '../store/actions/authentication';

const CELL_COUNT = 6;

const ConfirmationScreen = ({ route }) => {

    const { token, email, category } = route.params

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const dispatch = useDispatch()

    const onGoPress = async () => {
        try {

            //console.log(value)

            const response = await fetch(`http://localhost:8081/confirmation/${value}`, {
                method: 'GET',
                headers: { token: token }
            });

            const parseRes = await response.json()


            if (typeof parseRes === 'object') {
                Alert.alert(
                    parseRes.title,
                    parseRes.body,
                    [
                        { text: "OK", onPress: () => confirmationHandler(email, token) }
                    ]
                )
            } else if (parseRes === true) {
                console.log("confirmed")
                dispatch({ type: LOGGED_IN, token: token, category: category });
            } else {
                return
            }

        } catch (error) {
            console.log(error.message)
        }
    }


    const confirmationHandler = async (email, token) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch(`http://localhost:8081/confirmation/email/${email}`, {
                method: 'POST',
                headers: myHeaders,
            });

            const parseRes = await response.json()

            console.log(parseRes)

            setValue('')

        } catch (error) {
            console.log(error.message)
        }
    }



    return (
        <View style={styles.root}>
            <Text style={styles.title}>Please enter the code sent to {email} below:</Text>
            <CodeField
                ref={ref}
                {...props}
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
            <TouchableOpacity onPress={onGoPress} style={value.length === 6 ? [styles.button, styles.readyButton] : styles.button} disabled={value.length === 6 ? false : true}>
                <Text>GO</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    title: { textAlign: 'center' },
    codeFieldRoot: { marginTop: 20 },
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
    button: {
        width: '75%',
        height: Dimensions.get('window').height * 0.05,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey',
        marginTop: Dimensions.get('window').height * 0.07
    },
    readyButton: {
        backgroundColor: 'red',
        shadowOffset: {
            height: 4,
            width: -3
        },
        shadowRadius: 4,
        shadowOpacity: 0.7,
    }
});

export default ConfirmationScreen;

