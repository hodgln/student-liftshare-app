import React, { useState } from "react";
import { View, Text, Button, Dimensions, StyleSheet, Alert } from 'react-native';
import NextButton from "./Buttons/NextButton";
import { useSelector } from 'react-redux';
import * as AuthSession from 'expo-auth-session';


const StripeSignUp = (props) => {

    const token = useSelector(state => state.authorisation.userToken);

    const [loading, setLoading] = useState(false)

    const link = AuthSession.makeRedirectUri({ useProxy: true });

    const {
        setStage,
        stages
    } = props

    // test this on legit phone 

    console.log(link)


    const stripeRegister = async () => {
        try {

            setLoading(true)

            const firstname = props.user.user_firstname
            const surname = props.user.user_surname

            const body = { firstname, surname, link }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch("http://api.spareseat.app/payment/expressaccount", {
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

        console.log(auth.id)

        if (auth.type === "success") {
            AuthSession.dismiss()
            await getAccountID(auth.id)

            setLoading(false)

        } else {
            // Alert.alert(
            //     "something went wrong",
            //     `status: ${auth.type}`,
            //     [
            //         { text: "OK", onPress: () => setLoading(false)}
            //     ]
            //     )

            setLoading(false)
        }


        
        // handle each of the other "type" values

    }

    // if returns status === active account then allow to move on

    const getAccountID = async (id) => {
        try {

            console.log(id)

            const response = await fetch(`http://api.spareseat.app/payment/returnurl/${id}`, {
                method: 'GET',
                headers: { token: token }
            });

            const parseRes = await response.json()

            if(parseRes === "success") {
                Alert.alert(
                    "Success!",
                    "You are now able to get paid with Spareseat",
                    [
                        { text: "OK", onPress: () => setStage(stages.ROUTE_ONE) }
                    ]
                )
            } else if(parseRes === "failure") {
                Alert.alert("something went wrong")
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <View style={styles.componentContainer}>
            <Text style={{ padding: '3%', fontFamily: 'Inter_400Regular', fontSize: 22, color: '#535454'}}>Getting paid for lifts</Text>
            <View style={styles.line}></View>
            <View style={{ padding: '3%', marginTop: '5%'}}>
                <Text style={styles.textContainer}>Spareseat uses Stripe to get you paid quickly and keep your personal and payment information secure.</Text>
                <Text style={styles.textContainer}>Thousands of companies around the world trust Stripe to process payments for their users.</Text>
                <Text style={styles.textContainer}>Set up a Stripe account to get paid with Spareseat.</Text>
            </View>
            <View style={{ alignSelf: 'center' }}>
                <NextButton text="Register with Stripe" onPress={stripePressed} disabled={loading}/>
            </View>
        </View>
    )
};

export default StripeSignUp;

const styles = StyleSheet.create({
    componentContainer: {
        height: Dimensions.get('window').height * 0.5,
        width: Dimensions.get('screen').width * 0.9,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        backgroundColor: 'white',
    },
    line: {
        borderBottomWidth: 1,
        width: '100%',
        borderColor: 'grey',
    },
    textContainer: {
        paddingVertical: '2.5%',
        fontFamily: 'Inter_500Medium',
        fontSize: 16
    },
});
