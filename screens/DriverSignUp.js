import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Button } from 'react-native';
import { Ionicons } from "@expo/vector-icons"
import { useSelector } from 'react-redux';
import BackButton from "../components/Buttons/BackButton";
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator } from "react-native";



const DriverSignUp = ({ route, navigation }) => {

    const token = useSelector(state => state.authorisation.userToken);

    const [account, setAccount] = useState()
    const [loading, setLoading] = useState(false)

    const {
        surname,
        firstname
    } = route.params


    const link = AuthSession.makeRedirectUri({ useProxy: true });



    // test this on legit phone 

    console.log(link)


    const stripeRegister = async () => {
        try {

            setLoading(true)

            const body = { firstname, surname, link }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch("http://192.168.1.142:8081/payment/expressaccount", {
                method: "POST",
                body: JSON.stringify(body),
                headers: myHeaders
            });

            const parseRes = await response.json();

            // await WebBrowser.openAuthSessionAsync(parseRes.url)

            const auth = await AuthSession.startAsync({ authUrl: parseRes.link });

            console.log(auth)

            return ({
                type: auth.type,
                id: parseRes.id
            });

        } catch (error) {
            console.log(error.message)
        }
    }


    // listen for auth and if success then fire function that retrieves the stripe account object

    const stripePressed = async () => {

        setLoading(true)

        const auth = await stripeRegister()

        if (auth.type === "success") {
            AuthSession.dismiss()
            await getAccountID(auth.id)
        }


        setLoading(false)

        // handle each of the other "type" values

    }

    // if returns status === active account then allow to move on

    const getAccountID = async (id) => {
        try {

            console.log(id)

            const response = await fetch(`http://192.168.1.142:8081/payment/returnurl/${id}`, {
                method: 'GET',
                headers: { token: token }
            });

            const parseRes = await response.json()

            setAccount(parseRes)

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <View>
            <View style={styles.headerComponent}>
                <View style={styles.backButton}>
                    <BackButton onPress={() => navigation.goBack()} />
                </View>
            </View>
            <View style={styles.container}>


                <View style={styles.regNo}>
                    <Text>Please enter your reg number</Text>
                </View>


                <View style={styles.stripe}>
                    <View>
                        <Text style={styles.textContainer}>Spareseat uses Stripe to get you paid quickly and keep your personal and payment information secure.</Text>
                        <Text style={styles.textContainer}>Thousands of companies around the world trust Stripe to process payments for their users.</Text>
                        <Text style={styles.textContainer}>Set up a Stripe account to get paid with Spareseat.</Text>
                    </View>
                    {loading ? (
                        <View>
                            <ActivityIndicator />
                        </View>
                    ) : (
                        <Button title="register with stripe" onPress={stripePressed} />
            )}
                    
                </View>



                <TouchableOpacity disabled={account === null ? true : false} onPress={() => navigation.navigate('SignUpThree', { ...route.params, account: account })} >
                    <Ionicons name="chevron-forward-circle-outline" size={40} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    regNo: {
        height: Dimensions.get('window').height * 0.2
    },
    headerComponent: {
        height: Dimensions.get('window').height * 0.2,
        padding: '3%'
    },
    stripe: {
        height: Dimensions.get('window').height * 0.5,
        width: '85%'
    },
    textContainer: {
        paddingVertical: '2.5%',
        fontFamily: 'Inter_500Medium',
        fontSize: 16
    },
    backButton: {
        alignSelf: 'flex-start',
        width: '100%',
        marginTop: Dimensions.get('window').height * 0.025
    }
});

export default DriverSignUp;

