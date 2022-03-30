import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Dimensions, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DriverRouteOne from '../components/DRouteOne';
import DriverRouteTwo from '../components/DRouteTwo';
import DriverRouteThree from '../components/DRouteThree';
import StripeSignUp from '../components/StripeSignUp';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/core';
import PriceDisplay from '../components/PriceDisplay';


const DriverRoute = ({ navigation }) => {

    const stages = {
        STRIPE_SIGNUP: 'STRIPE_SIGNUP',
        ROUTE_ONE: 'ROUTE_ONE',
        ROUTE_TWO: 'ROUTE_TWO',
        ROUTE_THREE: 'ROUTE_THREE'
    };

    const isFocused = useIsFocused()

    useEffect(async () => {
        // setStage(stages.ROUTE_ONE)

        // stripe check and then setState
        const result = await checkIfStripe()

        if (result.stripe_id !== null) {
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

    const [seats, setSeats] = useState(3)

    const [price, setPrice] = useState('')

    const [distance, setDistance] = useState()

    const [showPrice, setShowPrice] = useState()

    const [reg, setReg] = useState()
    const [isValidReg, setIsValidReg] = useState(false)

    const token = useSelector(state => state.authorisation.userToken)

    const origin = { latitude: originLatitude, longitude: originLongitude }

    const destination = { latitude: destinationLatitude, longitude: destinationLongitude }

    const destinationlocation = (`${destination.longitude}, ${destination.latitude}`)
    const originlocation = (`${origin.longitude}, ${origin.latitude}`)

    //look at apis for the petrol value?
    const driverprice = distance * 0.62137119 * 0.159;

    const roundedprice = driverprice.toFixed(2);

    const pricenumber = price.substring(1)

    const originname = JSON.stringify(originName)
    const destinationname = JSON.stringify(destinationName)



    // check if stripe registered

    const checkIfStripe = async () => {
        try {


            const response = await fetch("https://spareseat-app.herokuapp.com/dashboard/checkifstripe", {
                method: "GET",
                headers: { token: token }
            });


            const parseRes = await response.json();

            return (parseRes)


        } catch (error) {
            console.log(error.message)
        }

    }

    // check if vehicle is taxed and MOT'd

    const checkRegNo = async() => {
        try {

            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch("https://spareseat-app.herokuapp.com/dashboard/checkregno",{
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({ registrationNumber: reg })
            });

            const parseRes = await response.json()

            // console.log(parseRes)

            if(parseRes.status === 200) {
                // deal with tax, mot, if both are okay return true. 

                const filterResult = filterCarData(parseRes.data.motStatus, parseRes.data.taxStatus)

                return filterResult

                // if not, send alert and dont allow to post. 
            } else if(parseRes.status === 400) {
                Alert.alert("Registration number not recognised")
                return false
            } else {
                console.log(parseRes.message)
                Alert.alert("Could not verify car registration")
                return false
            }

            
        } catch (error) {
            console.log(error.message)
        }
    }

    // filter data and return alerts based on input

    const filterCarData = (mot, tax) => {

        console.log(mot, tax)

        const MOTlegit = mot === 'Valid'
        const taxlegit = tax === 'Taxed'

        if (MOTlegit && taxlegit) {
            return true
        } else if (!MOTlegit && taxlegit) {
            Alert.alert("Could not find MOT data")
            return false
        } else if (!taxlegit && MOTlegit) {
            Alert.alert("Could not find tax data")
            return false
        } else {
            Alert.alert("Could not find MOT and tax data")
            return false
        }
    }


    // *** POST ROUTE ***

    const onGoPress = async () => {
        try {
            const datepicked = date.toISOString();

            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);




            const body = { datepicked, originlocation, destinationlocation, originname, destinationname, seats, pricenumber }
            const response = await fetch("https://spareseat-app.herokuapp.com/dashboard/Liftshares", {
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

    // use regex to check whether reg no is valid 

    const isRegValid = (text) => {
        const regex = new RegExp('(^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$)|(^[A-Z][0-9]{1,3}[A-Z]{3}$)|(^[A-Z]{3}[0-9]{1,3}[A-Z]$)|(^[0-9]{1,4}[A-Z]{1,2}$)|(^[0-9]{1,3}[A-Z]{1,3}$)|(^[A-Z]{1,2}[0-9]{1,4}$)|(^[A-Z]{1,3}[0-9]{1,3}$)|(^[A-Z]{1,3}[0-9]{1,4}$)|(^[0-9]{3}[DX]{1}[0-9]{3}$)')

        if(regex.test(text) === true && text.length === 7) {
            setIsValidReg(true)
        } else {
            setIsValidReg(false)
        }

        setReg(text)
        
    }

    // check if reg has MOT with the DVLA


    const postLift = async() => {
        const regResponse = await checkRegNo();
        if(regResponse === true) {
            onGoPress()
        } else {
            console.log(regResponse)
        }
        
    }



    const liftPostedHandler = async () => {
        await navigation.navigate('My Lifts', { refresh: true })
        setStage(ROUTE_ONE)
        navigation.popToTop()
    }


    // const infoOnPress = () => {
    //     if(price.substring(1) > 3.00) {
    //         setShowPrice(true)
    //     } else {
    //         null
    //     }
    // }


    return (
        <View style={styles.container}>

            <View style={styles.circle}>
                <LinearGradient colors={['#0352A0', '#0466c8']} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 0 }} style={styles.linearGradient}>
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
                    regFunc={isRegValid}
                    reg={reg}
                    setStage={setStage}
                    stages={stages}
                    isValid={isValidReg}
                />
            }
            {stage === stages.ROUTE_THREE &&
                <DriverRouteThree
                    setDate={setDate}
                    date={date}
                    seats={seats}
                    setSeats={setSeats}
                    onGoPress={postLift}
                    suggestedPrice={roundedprice}
                    setPrice={setPrice}
                    price={price}
                    infoOnPress={() => setShowPrice(true)}
                />
            }
            {stage === stages.STRIPE_SIGNUP &&
                <StripeSignUp
                    user={user}
                    setStage={setStage}
                    stages={stages}
                />
            }
            {showPrice ?
                (
                    // <View style={styles.flatListView}>
                    /* <Button title="-" onPress={() => setIsVisiblePassengers(false)} /> */
                    <Modal animationType="slide"
                        transparent={true}
                        visible={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.")
                        }}>
                        <View style={styles.centredView}>

                            <View style={styles.QRmodal}>
                                <View>
                                    <View style={{ padding: '2%', marginTop: '5%' }}>
                                        <Text style={styles.textContainer}>How much money you earn from your lift depends on the number of passengers you choose to have in your car.</Text>
                                        <Text style={styles.textContainer}>So, if you only want one passenger in your car, don't worry! </Text>
                                        <Text style={styles.textContainer}>Set the price to suit having one passenger. </Text>
                                        <Text style={styles.textContainer}>Once the lift has been posted, only accept the passenger that you want in the car.</Text>
                                    </View>
                                    <Button title="close" onPress={() => setShowPrice(false)} />
                                </View>
                            </View>

                        </View>
                    </Modal>
                    /* </View> */
                ) : null}

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
    },
    QRmodal: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('window').width * 0.9,
        justifyContent: 'center'
    },
    textContainer: {
        paddingVertical: '2.5%',
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: '#535454'
    },
    centredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 22,
        height: Dimensions.get('window').height * 0.4
    },
});