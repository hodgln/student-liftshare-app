import React, { useReducer, useCallback, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, Image, ScrollView, Alert, Dimensions, ActivityIndicator } from 'react-native'
import { useDispatch } from 'react-redux';
import Input from '../components/Input';
import { LOGGED_IN } from '../store/actions/authentication'
import LogInButton from '../components/Buttons/LoginButton';
import BackButton from '../components/Buttons/BackButton';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


const LogIn = ({ route, navigation }) => {

    const FORM_UPDATED = 'FORM_UPDATED';

    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    const { category } = route.params

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
                password: ''
            },
            inputValidities: {
                email: false,
                password: false
            },
            formIsValid: false
        });




    const textChangeHandler = useCallback((inputID, text) => {
        const regChecker = /^[\w]+[\w.%+-]*@[\w.-]+\.ac\.uk$/
        let isValid = false;
        // if (inputID === 'email' && regChecker.test(text.toLowerCase()) === true) {
        //     isValid = true;
        // }
        if (inputID === 'email') {
            isValid = true
        }
        if (inputID === 'password' && text.trim().length > 8) {
            isValid = true
        }
        dispatchFormState({
            type: FORM_UPDATED,
            value: text,
            isValid: isValid,
            input: inputID
        });
    }, [dispatchFormState]);


    const confirmationHandler = async (email, token) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            await fetch(`https://spareseat-app.herokuapp.com/confirmation/email/${email}`, {
                method: 'POST',
                headers: myHeaders,
            });

            navigation.navigate("CScreen", { token: token, email: email })

        } catch (error) {
            console.log(error.message)
        }
    }

    const registerForPushNotificationsAsync = async (jwtToken) => {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            saveToken(token, jwtToken, existingStatus)
            //   this.setState({ expoPushToken: token });
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };

    const saveToken = async (pushToken, jwtToken, existingStatus) => {
        if (existingStatus !== "granted") {

            try {
                const body = { pushToken }

                //console.log(jwtToken)

                const myHeaders = new Headers();

                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("token", jwtToken);

                await fetch("https://spareseat-app.herokuapp.com/auth/pushToken", {
                    method: 'PUT',
                    headers: myHeaders,
                    body: JSON.stringify(body)
                });

            } catch (error) {
                console.log(error.message)
            }
        }
    }

    const onGoPress = async () => {
        try {

            const { email, password } = formState.inputValues;

            const body = { email, password, category }

            const loginUser = await fetch("https://spareseat-app.herokuapp.com/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const parseResponse = await loginUser.json();

            //get res with if confirmed or not 


            if (parseResponse.confirmed === false) {
                Alert.alert(
                    "Please confirm your email to login",
                    "",
                    [
                        {
                            text: "OK",
                            onPress: async () => {
                                // function that sends email, updates db and navs to next screen
                                await confirmationHandler(email, parseResponse.token)

                            }
                        }
                    ]
                )
            } else if (parseResponse.confirmed === true) {
                dispatch({ type: LOGGED_IN, token: parseResponse.token, category: parseResponse.category })
                registerForPushNotificationsAsync(parseResponse.token)
            } else {
                Alert.alert(parseResponse);
            }

        } catch (error) {
            console.log(error.message)
        }
        //props.navigation.navigate('DPNav')
    };

    const loginPress = async () => {
        setIsLoading(true)
        await onGoPress()
        setIsLoading(false)
    }

    const logInText = `${category} log in`

    const arr = logInText.split(" ");

    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

    }

    const logInHeader = arr.join(" ");

    return (
        //<View style={styles.dropShadow}></View>
        <View style={styles.DriverLogIn}>
            
            
                <View style={styles.headerComponent}>
                    <View style={styles.backButton}>
                        <BackButton onPress={() => navigation.goBack()} />
                    </View>
                </View>

            <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                {/* <View style={styles.headerContainer}>
                    <Image source={require('../assets/SpareseatText.png')} style={styles.SpareseatText} />
                </View> */}
                
                <View style={{ marginTop: '10%' }}>

                    <Text style={{ fontFamily: 'Inter_Medium', fontSize: 26 }}>{logInHeader}</Text>
                </View>
                <Input
                    inputID='email'
                    placeholder='university email'
                    keyboardType='email-address'
                    onChangeText={textChangeHandler.bind(this, 'email')}
                    initialValue={''}
                    initiallyValid={false}
                    email={formState.inputValues.email}
                    iconName="mail-outline"
                />


                {/* if formState.inputValidities.email apply diff styles */}
                <Input
                    inputID='password'
                    placeholder='password'
                    onChangeText={textChangeHandler.bind(this, 'password')}
                    initialValue={''}
                    initiallyValid={false}
                    iconName="md-lock-closed-outline"
                />
                <Button title="forgot password" onPress={() => navigation.navigate('PReset')} />

                <LogInButton onPress={loginPress} text="LOG IN" disabled={isLoading} />
                <Button title="sign up" onPress={() => navigation.navigate('SignUpOne', { category: category })} />
            </View>
            </View>
    )
}

const styles = StyleSheet.create({
    DriverLogIn: {
        // backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
        // padding: '3%',
        width: Dimensions.get('screen').width * 1,
        height: '100%'

    },
    backButton: {
        alignSelf: 'flex-start',
        width: '100%',
        marginTop: Dimensions.get('window').height * 0.025
    },
    dropShadow: {
        shadowOffset: {
            height: 5,
            width: 0
        },
        shadowRadius: 10,
        shadowOpacity: 7
    },
    headerComponent: {
        width: Dimensions.get('screen').width * 1,
        marginTop: Dimensions.get('window').height * 0.025,
        alignSelf: 'center',
        flexDirection: 'row',
    },
    SpareseatText: {
        height: '29%',
        width: '70%',
        alignSelf: 'center'
    },
    headerContainer: {
        height: '25%', 
        justifyContent: 'center', 
        width: Dimensions.get('screen').width * 1, 
        backgroundColor: '#0352A0',
        borderBottomRightRadius: 40
    }
})


export default LogIn;