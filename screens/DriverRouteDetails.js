import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, Modal, TouchableOpacity, ImageBackground } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import RequestCard from '../components/Cards/RequestCard';
import { useNavigation } from '@react-navigation/core';
import MyLiftsPassengerCard from '../components/Cards/MyLiftsPassengerCard';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import RouteDisplay from '../components/RouteDisplay';
import RequestButton from '../components/Buttons/RequestButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/core';
import PriceDisplay from '../components/PriceDisplay';
import StatusButton from '../components/Buttons/StatusButton';




const DriverRouteDetails = ({ route, navigation }) => {

    const [requests, setRequests] = useState()
    const [isVisibleRequests, setIsVisibleRequests] = useState(false)
    const [isVisiblePassengers, setIsVisiblePassengers] = useState(false)
    // const [isActive, setIsActive] = useState(false)
    const [isVisibleQR, setIsVisibleQR] = useState(false)
    const [passengers, setPassengers] = useState();
    const [passengerNumber, setPassengerNumber] = useState()
    const [seatNumber, setSeatNumber] = useState()
    const [QRids, setQRids] = useState()
    const isFocused = useIsFocused()
    const [map, setMap] = useState()
    const [showPrice, setShowPrice] = useState()

    // display the seats as the number of confirmed requests + the number of seats.

    const {
        from,
        to,
        origin,
        destination,
        date,
        id,
        price,
        isActive
    } = route.params

    const dateFormat = new Date(date)



    const token = useSelector(state => state.authorisation.userToken);



    const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    })

    const getMapImg = async (urlpath) => {
        try {
            const body = { urlpath }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);


            const response = await fetch("http://192.168.1.142:8081/locations/signurl", {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const parseRes = await response.json()

            setMap(parseRes)

        } catch (error) {
            console.log(error.message)
        }
    }

    const getPolyline = async (origin, destination) => {
        try {

            const body = { origin, destination }

            console.log(origin, destination)

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);


            const response = await fetch("http://192.168.1.142:8081/locations/distance", {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const parseRes = await response.json()

            const encodeParseRes = encodeURIComponent(parseRes.route)

            return (
                `https://maps.googleapis.com/maps/api/staticmap?&size=500x500&path=weight:6%7Ccolor:0x0352A0CC%7Cenc:${encodeParseRes}&key=AIzaSyAABf0pH3xmQE_riwJXkrazEQADU0fqEss&map_id=76404385f094ea10`
            )

        } catch (error) {
            console.log(error.message)
        }
    }

    // get passengers count


    const deleteLift = async () => {
        try {
            const response = await fetch(`http://192.168.1.142:8081/dashboard/Liftshares/${id}`, {
                method: "DELETE",
                headers: { token: token }
            });

            const parseRes = await response.json()

            // alert first and then fire request "are you sure you want to delete this lift"




            Alert.alert(
                parseRes,
                "",
                [
                    { text: "OK", onPress: () => navigation.navigate('My Lifts', { refresh: true }) }
                ]
            )


            //navigation.navigate('My Lifts', {refresh: true})
            //find a way to refresh the my lifts section so that the lift disappears straight away
        } catch (error) {
            console.log(error.message)
        }
    }

    const initialCountPassengers = async () => {
        try {

            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch(`http://192.168.1.142:8081/dashboard/countpassengers/${id}`, {
                method: "GET",
                headers: myHeaders
            });

            const parseRes = await response.json()

            return (
                parseRes
            )

        } catch (error) {
            console.log(error.message)
        }
    }

    const getRequests = async () => {
        try {
            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch(`http://192.168.1.142:8081/dashboard/getrequests/${id}`, {
                method: "GET",
                headers: myHeaders
            });

            const parseRes = await response.json()

            const filterPending = parseRes.filter(x => x.status === 'pending')

            if (filterPending.length !== 0) {
                setRequests(filterPending);
                setIsVisibleRequests(true);
                setIsVisiblePassengers(false);
            }
            else {
                Alert.alert("You do not have any requests for this lift")
            }

        } catch (error) {
            console.log(error.message)
        }

    };

    const getPassengers = async () => {
        try {
            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch(`http://192.168.1.142:8081/dashboard/getrequests/${id}`, {
                method: "GET",
                headers: myHeaders
            });

            const parseRes = await response.json()

            const filterConfirmed = parseRes.filter(x => x.status === 'confirmed')

            if (filterConfirmed.length !== 0) {
                setPassengers(filterConfirmed);
                setIsVisibleRequests(false);
                setIsVisiblePassengers(true);
            }
            else {
                Alert.alert("You do not have any passengers for this lift")
            }

        } catch (error) {
            console.log(error.message)
        }
    };



    const renderRequests = ({ item }) => {

        // if (item.status === 'confirmed') { return null } else {

        return (
            <View>
                <RequestCard
                    firstname={item.user_firstname}
                    surname={item.user_surname}
                    id={id}
                    request_id={item.request_id}
                    liftStatus={item.status}
                    picture={item.profile_picture}
                    passenger_id={item.user_id}
                    to={to}
                    passengerprice={item.passengerprice}
                />
            </View>)
        /* {console.log(item.user_firstname)} */
    }


    const renderPassengers = ({ item }) => {

        // if (item.status === 'confirmed') { return null } else {

        return (
            <View>
                <MyLiftsPassengerCard
                    firstname={item.user_firstname}
                    surname={item.user_surname}
                    request_id={item.request_id}
                    phone_number={item.phone_number}
                    picture={item.profile_picture}
                />
            </View>)
        {/* {console.log(item.user_firstname)} */ }
    }
    // };





    const mapHandler = async () => {
        const polyline = await getPolyline(
            { latitude: origin.y, longitude: origin.x },
            { latitude: destination.y, longitude: destination.x }
        );
        getMapImg(polyline)
    }


    useEffect(async () => {
        // if (momentFormat(dateFormat) === momentFormat(todayDate)) {
        //     setIsActive(true)
        // }


        mapHandler()

        const result = await initialCountPassengers()

        setPassengerNumber(result.passengers)
        setSeatNumber(result.seats)

    }, [isFocused, isVisibleRequests]);



    const checkInHandler = async () => {
        try {

            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch(`http://192.168.1.142:8081/dashboard/getrequests/${id}`, {
                method: "GET",
                headers: myHeaders
            });

            const parseRes = await response.json()

            // const QRids = parseRes.map(index => index.user_id)

            const filterConfirmed = parseRes.filter(x => x.status === 'confirmed').map(x => ({ ...x, scanned: false }))

            navigation.navigate('Check In', { passengers: filterConfirmed, liftshare_id: id })

            //setIsVisibleQR(true); add this to the passenger side

        } catch (error) {
            console.log(error.message)
        }

    }




    //async problem for above function



    // design so "price breakdown" + "delete lift" buttons are side by side

    return (

        <View style={{ flex: 1 }}>
            {map === undefined ? null : (<ImageBackground style={styles.Image} source={{ uri: map }} />)}
            <View style={styles.backgroundContainer}>
                <View style={isActive ? [styles.container, styles.isActive] : styles.container}>
                    <View style={styles.halfContainer}>
                        <View style={{ width: '100%' }}>
                            <RouteDisplay
                                from={from}
                                to={to}
                                time={moment(dateFormat).format('HH:mm')}
                                date={isActive ? "Today" : moment(dateFormat).format('ddd Do MMM')}
                                price={price}
                            />
                        </View>
                        {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={deleteLift} disabled={isVisibleRequests || isVisiblePassengers}>
                            <Ionicons name="ios-close-circle-outline" size={30} color="#FF1654" />
                        </TouchableOpacity>
                    </View> */}

                    </View>
                    <View style={styles.line}></View>
                    <View style={{ flexDirection: "row" }}>
                        
                        <View style={styles.buttonBox}>
                            {/* <View style={styles.buttons}> */}
                            <View style={styles.singleButton}>
                                <RequestButton text="requests" style="filled" onPress={getRequests} disabled={isVisiblePassengers} />
                            </View>
                            <View style={styles.singleButton}>
                                <RequestButton text="passengers" style="outline" onPress={getPassengers} disabled={isVisibleRequests} />
                            </View>

                        </View>

                        <View style={styles.buttonBox}>

                            <View style={styles.singleButton}>
                                <Button title="price breakdown" onPress={() => setShowPrice(true)} />
                            </View>
                            <View style={styles.singleButton}>
                                <Button title="delete lift" onPress={deleteLift}/>
                            </View>

                        </View>

                    </View>

                    <View style={styles.line}></View>

                    <View style={{ flexDirection: 'row', paddingVertical: '5%', alignItems: 'center', width: '90%' }}>

                        <View style={{ width: '50%', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                {passengerNumber === undefined ? null : [...Array(JSON.parse(passengerNumber)).keys()].map(() => <MaterialCommunityIcons name="seatbelt" size={32} color="#0466c8" />)}
                                {[...Array(seatNumber).keys()].map(() => <MaterialCommunityIcons name="seatbelt" size={32} color="grey" />)}
                            </View>
                        </View>

                        <View style={{ width: '50%', alignItems: 'center' }}>
                            <StatusButton text="check in" onPress={checkInHandler} style="confirmed" />
                        </View>

                    </View>

                </View>
            </View>
            {isVisibleRequests ?

                (<Modal animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.")
                    }}>
                    <View style={styles.centredView}>
                        <View style={styles.modalView}>
                            <FlatList
                                style={styles.modal}
                                data={requests}
                                renderItem={renderRequests}
                                keyExtractor={item => JSON.stringify(item.request_id)}
                            />
                            <Button title="close" onPress={() => setIsVisibleRequests(false)} />
                        </View>
                    </View>

                </Modal>) : null}
            {isVisiblePassengers ?
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

                            <View style={styles.modalView}>
                                <View>
                                    <FlatList
                                        //style={styles.modal}
                                        data={passengers}
                                        renderItem={renderPassengers}
                                        keyExtractor={item => JSON.stringify(item.user_id)}
                                    />
                                    <Button title="close" onPress={() => setIsVisiblePassengers(false)} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                    /* </View> */
                ) : null}
                       
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
                                    <PriceDisplay price={price}/>
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

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width * 0.9,
        height: Dimensions.get('window').height * 0.5,
        // flex: 1,
        borderRadius: 30,
        // borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        alignSelf: 'center',
        backgroundColor: 'white',
        //flexDirection: 'row'
    },
    backgroundContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        shadowOffset: {
            height: 3,
            width: -3
        },
        shadowRadius: 2,
        //shadowColor: 'black',
        shadowOpacity: 0.15
    },
    singleButton: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '2%'
    },
    isActive: {
        borderColor: 'lightgreen',
        borderWidth: 3
    },
    columns: {
        flexDirection: 'row'
    },
    modal: {
        //width: Dimensions.get('window').width * 0.8,
        //height: Dimensions.get('window').height * 0.2,
        // borderWidth: 7,
        alignSelf: 'center'
    },
    centredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 22,
        height: Dimensions.get('window').height * 0.4
    },
    flatListView: {
        alignItems: 'center',
        justifyContent: 'center',
        // width: '100%'
        //position: 'relative'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: '3%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: Dimensions.get('window').height * 0.9,
        width: Dimensions.get('window').width * 0.9,
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
        height: Dimensions.get('window').height * 0.6,
        width: Dimensions.get('window').width * 0.9,
        justifyContent: 'center'
    },
    halfContainer: {
        //alignItems: 'center',
        flexDirection: 'row',
        width: '90%'
    },
    Image: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: -1,
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('screen').width * 1
    },
    line: {
        borderBottomWidth: 0.5,
        width: '80%',
        borderColor: 'grey',
        alignSelf: 'center',
        padding: '1%'
    },
    verticalLine: {
        height: '90%',
        width: 1,
        backgroundColor: '#909090',
        justifyContent: 'center',
        marginRight: Dimensions.get('screen').width * 0.08
    },
    buttonBox: {
        paddingVertical: '3%',
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%'
        //flexDirection: 'row'
    }

})

export default DriverRouteDetails;
