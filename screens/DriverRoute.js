import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DriverRouteOne from '../components/DRouteOne';
import DriverRouteTwo from '../components/DRouteTwo';
import StripeSignUp from '../components/StripeSignUp';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/core';


const DriverRoute = ({ navigation }) => {

    const stages = {
        STRIPE_SIGNUP: 'STRIPE_SIGNUP',
        ROUTE_ONE: 'ROUTE_ONE',
        ROUTE_TWO: 'ROUTE_TWO'
    };

    const isFocused = useIsFocused()

    useEffect(async () => {
        // setStage(stages.ROUTE_ONE)

        // stripe check and then setState
        const result = await checkIfStripe()

        if(result.stripe_id !== null) {
            setStage(stages.ROUTE_ONE)
        } else {
            setUser(result)
            setStage(stages.STRIPE_SIGNUP)
        }


    }, [isFocused]);

    const [stage, setStage] = useState(stages.STRIPE_SIGNUP)
    // const [email, setEmail] = useState()

    const [originLatitude, setOriginLatitude] = useState()
    const [originLongitude, setOriginLongitude] = useState()

    const [destinationLatitude, setDestinationLatitude] = useState()
    const [destinationLongitude, setDestinationLongitude] = useState()

    const [originName, setOriginName] = useState()
    const [destinationName, setDestinationName] = useState()

    const [user, setUser] = useState()

    const [date, setDate] = useState(new Date());

    const [seats, setSeats] = useState(0)

    const [distance, setDistance] = useState()

    const token = useSelector(state => state.authorisation.userToken)

    const origin = { latitude: originLatitude, longitude: originLongitude }

    const destination = { latitude: destinationLatitude, longitude: destinationLongitude }

    const destinationlocation = (`${destination.longitude}, ${destination.latitude}`)
    const originlocation = (`${origin.longitude}, ${origin.latitude}`)

    //look at apis for the petrol value?
    const driverprice = distance * 0.62137119 * 0.159;

    const roundedprice = driverprice.toFixed(2)

    const originname = JSON.stringify(originName)
    const destinationname = JSON.stringify(destinationName)

    // check if stripe registered

    const checkIfStripe = async () => {
        try {


            const response = await fetch("http://192.168.1.142:8081/dashboard/checkifstripe", {
                method: "GET",
                headers: { token: token }
            });


            const parseRes = await response.json();

            return(parseRes)


        } catch (error) {
            console.log(error.message)
        }

    }


    // *** POST ROUTE ***

    const onGoPress = async () => {
        try {
            const datepicked = date.toISOString();

            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);


            const body = { datepicked, originlocation, destinationlocation, originname, destinationname, seats, roundedprice }
            const response = await fetch("http://192.168.1.142:8081/dashboard/Liftshares", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(body)
            });


            const parseResponse = await response.json();

            if (parseResponse.rows.length !== 0) {
                Alert.alert(
                    "Lift Posted!",
                    "",
                    [
                        { text: "OK", onPress: () => liftPostedHandler() }
                    ]
                )
            } else {
                Alert.alert("There has been an error")
            }

        } catch (error) {
            console.log(error.message)
        }

    }

    const liftPostedHandler = async () => {
        await navigation.navigate('My Lifts', { refresh: true })
        setStage(ROUTE_ONE)
        navigation.popToTop()
    }





    return (
        <View style={styles.container}>

            <View style={styles.circle}>
                <LinearGradient colors={['#0352A0', '#0466c8', '#238ffb']} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 0 }} style={styles.linearGradient}>
                </LinearGradient>
            </View>

            {stage === stages.ROUTE_ONE &&
            <DriverRouteOne
            setStage={setStage}
            stages={stages}
            setOriginLatitude={setOriginLatitude}
            setOriginLongitude={setOriginLongitude}
            setDestinationLatitude={setDestinationLatitude}
            setDestinationLongitude={setDestinationLongitude}
            setOriginName={setOriginName}
            setDestinationName={setDestinationName}
            setDistance={setDistance}
            origin={origin}
            destination={destination}
            token={token}
            />
           }
           {stage === stages.ROUTE_TWO &&
            <DriverRouteTwo
            setDate={setDate}
            date={date}
            seats={seats}
            setSeats={setSeats}
            onGoPress={onGoPress}
            />
           }
           {stage === stages.STRIPE_SIGNUP &&
            <StripeSignUp
            user={user}
            setStage={setStage}
            stages={stages}
            />
           }

        </View>
    )
}

export default DriverRoute;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        shadowOffset: {
            height: 3,
            width: -3
        },
        shadowRadius: 5,
        shadowColor: '#0352A0',
        shadowOpacity: 0.3,
    },
    circle: {
        width: 800,
        height: 800,
        borderRadius: 800 / 2,
        backgroundColor: "#0470DC",
        marginBottom: Dimensions.get("window").height * 1,
        position: 'absolute',
        top: -500,
        overflow: 'hidden'
      },
      linearGradient: {
        flex: 1
      }
});