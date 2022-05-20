import React, { useState, useEffect, Component } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Dimensions, Alert, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DriverRouteOne from '../components/DRouteOne';
import DriverRouteTwo from '../components/DRouteTwo';
import DriverRouteThree from '../components/DRouteThree';
import StripeSignUp from '../components/StripeSignUp';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/core';
import BackButton from '../components/Buttons/BackButton';

// Change flatlist so that data refrences components and renderItem is responsible for rendering the components (with props) 
// - this may solve the issue of functions as "undefined" 


const DriverRoute = ({ navigation }) => {

    const data = [
        {
            key: 'STRIPE_SIGNUP'
        },
        {
            key: 'ROUTE_ONE'
        },
        {
            key: 'ROUTE_TWO'
        },
        {
            key: 'ROUTE_THREE'
        }
    ];

    const [initialIndex, setInitialIndex] = useState()

    //const [flatListRef, setFlatListRef] = useState()

    const isFocused = useIsFocused()

    const myRef = React.createRef();
    // this.myRef.current.doSomething();

    const ITEM_WIDTH = Dimensions.get("screen").width * 1


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



    useEffect(() => {
        let isMounted = true

        // stripe check and then setState
        checkIfStripe().then(result => {
            const stripeIndex = data.findIndex((item) => item.key === "STRIPE_SIGNUP")
            const routeOneIndex = data.findIndex((item) => item.key === "ROUTE_ONE")

            if (isMounted) {
                console.log(result.stripe_id === null)
                result.stripe_id === null ?
                    (setUser(result), setInitialIndex(stripeIndex))
                    :
                    setInitialIndex(routeOneIndex);
            }
        })

        return () => { isMounted = false };
    }, [isFocused]);


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

    const checkRegNo = async () => {
        try {

            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch("https://spareseat-app.herokuapp.com/dashboard/checkregno", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({ registrationNumber: reg })
            });

            const parseRes = await response.json()

            // console.log(parseRes)

            if (parseRes.status === 200) {
                // deal with tax, mot, if both are okay return true. 

                const filterResult = filterCarData(parseRes.data.motStatus, parseRes.data.taxStatus)

                return filterResult

                // if not, send alert and dont allow to post. 
            } else if (parseRes.status === 400) {
                Alert.alert("Registration number not recognised")
                return false
            } else {
                Alert.alert("Could not verify car registration")
                return false
            }


        } catch (error) {
            console.log(error.message)
        }
    }

    // filter data and return alerts based on input

    const filterCarData = async (mot, tax) => {

        const MOTlegit = mot === 'Valid'
        const taxlegit = tax === 'Taxed'

        if (MOTlegit && taxlegit) {
            return true
        } else if (!MOTlegit && taxlegit) {
            Alert.alert(
                "Could not find MOT data",
                "We may ask you for information on this in the future"
            )
            return true

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

    // const isRegValid = (text) => {
    //     const regex = new RegExp('(^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$)|(^[A-Z][0-9]{1,3}[A-Z]{3}$)|(^[A-Z]{3}[0-9]{1,3}[A-Z]$)|(^[0-9]{1,4}[A-Z]{1,2}$)|(^[0-9]{1,3}[A-Z]{1,3}$)|(^[A-Z]{1,2}[0-9]{1,4}$)|(^[A-Z]{1,3}[0-9]{1,3}$)|(^[A-Z]{1,3}[0-9]{1,4}$)|(^[0-9]{3}[DX]{1}[0-9]{3}$)')

    //     if (regex.test(text) === true && text.length === 7) {
    //         setIsValidReg(true)
    //     } else {
    //         setIsValidReg(false)
    //     }

    //     setReg(text)

    // }

    // check if reg has MOT with the DVLA


    const onPressRouteTwo = async () => {
        const regResponse = await checkRegNo();
        if (regResponse === true) {
            scrollToItem('ROUTE_THREE')
        } else {
            null
        }

    }



    const liftPostedHandler = async () => {
        await navigation.navigate('My Lifts', { refresh: true })
        scrollToItem('ROUTE_ONE')
    }


    const infoOnPress = () => {
        if (price.substring(1) > 3.00) {
            setShowPrice(true)
        } else {
            null
        }
    }

    const renderItem = ({ item }) => {

        // change so it conditionally renders components

        // https://stackoverflow.com/questions/67001089/reactnative-flatlist-scrolltoindex-issue

        // { || item.key === "ROUTE_TWO" && <RouteTwo />}

        return (

            <View style={{ width: Dimensions.get("screen").width * 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                {
                    item.key === "STRIPE_SIGNUP" &&
                    <View style={styles.container}>
                        <StripeSignUp
                            user={user}
                            onNext={scrollToItem}
                        />
                    </View>
                    || item.key === "ROUTE_ONE" &&
                    <View style={styles.container}>
                        <DriverRouteOne
                            onNext={scrollToItem}
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
                    </View>
                    || item.key === "ROUTE_TWO" &&
                    <View style={styles.container}>
                        <View style={{ position: 'absolute', top: '2%', zIndex: 1, alignSelf: 'flex-start' }}>
                            <BackButton onPress={() => scrollToItem('ROUTE_ONE')} />
                        </View>
                        <DriverRouteTwo
                            setDate={setDate}
                            date={date}
                            setReg={setReg}
                            //regFunc={isRegValid}
                            setIsValidReg={setIsValidReg}
                            reg={reg}
                            onPressRouteTwo={onPressRouteTwo}
                            isValid={isValidReg}
                        //flatListRef={flatListRef}
                        />
                    </View>
                    || item.key === "ROUTE_THREE" &&
                    <View style={styles.container}>
                        <View style={{ position: 'absolute', top: '2%', zIndex: 1, alignSelf: 'flex-start' }}>
                            <BackButton onPress={() => scrollToItem('ROUTE_TWO')} />
                        </View>
                        <DriverRouteThree
                            setDate={setDate}
                            date={date}
                            seats={seats}
                            setSeats={setSeats}
                            onGoPress={onGoPress}
                            suggestedPrice={roundedprice}
                            setPrice={setPrice}
                            price={price}
                            infoOnPress={infoOnPress}
                        //flatListRef={flatListRef}
                        />
                    </View>
                }
            </View>
        )
    }

    const scrollToItem = (key) => {
        const index = data.findIndex((item) => item.key === key)

        if ((myRef !== null) && (myRef.current !== null)) {
            myRef.current.scrollToIndex({ index: index, animated: true });
        }
    }


    return (
        <View style={styles.container}>

            <View style={styles.circle}>
                <LinearGradient colors={['#0352A0', '#0466c8']} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 0 }} style={styles.linearGradient}>
                </LinearGradient>
            </View>
            {initialIndex !== undefined ? 
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    ref={myRef}
                    keyExtractor={(item) => item.key}
                    horizontal
                    getItemLayout={(data, index) => ({ index, length: ITEM_WIDTH, offset: (ITEM_WIDTH * index) })}
                    initialScrollIndex={initialIndex}
                    scrollEnabled={false}
                    centerContent={true}
                />
                : <ActivityIndicator size={200} /> 
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
                                <View style={{ justifyContent: 'center' }}>
                                    <View style={{ padding: '2%', marginTop: '5%', justifyContent: 'space-evenly' }}>
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
        justifyContent: 'center'
    },
    textContainer: {
        paddingVertical: '2.5%',
        fontFamily: 'Inter_Medium',
        fontSize: 16,
        color: '#535454'
    },
    centredView: {
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 22,
        height: '100%'
    },
    itemContainer: {
        height: Dimensions.get('window').height * 1,
        justifyContent: 'center'
    }
});