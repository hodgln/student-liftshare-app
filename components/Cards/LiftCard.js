import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, Modal, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import RequestCard from './RequestCard';
import { useNavigation } from '@react-navigation/core';
import MyLiftsPassengerCard from './MyLiftsPassengerCard';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import RouteDisplay from '../RouteDisplay';
import { AntDesign } from '@expo/vector-icons';



const LiftCard = (props) => {

    const [requests, setRequests] = useState()
    const [isVisibleRequests, setIsVisibleRequests] = useState(false)
    const [isVisiblePassengers, setIsVisiblePassengers] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [isVisibleQR, setIsVisibleQR] = useState(false)
    const [passengers, setPassengers] = useState();
    const [QRids, setQRids] = useState()

    const navigation = useNavigation()

    const dateFormat = new Date(props.date)

    const momentFormat = (date) => {
        return (
            moment(date).format("DD-MM-YYYY")
        )
    }

    const todayDate = new Date()

    const token = useSelector(state => state.authorisation.userToken);

    const { from, to, seats, id, price } = props

    const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    })




    const deleteLift = async () => {
        try {
            const response = await fetch(`https://spareseat-app.herokuapp.com/dashboard/Liftshares/${id}`, {
                method: "DELETE",
                headers: { token: token }
            });

            const parseRes = await response.json()

            // console.log(parseRes);
            //Alert.alert(parseRes);


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

    const getRequests = async () => {
        try {
            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch(`https://spareseat-app.herokuapp.com/dashboard/getrequests/${id}`, {
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

            const response = await fetch(`https://spareseat-app.herokuapp.com/dashboard/getrequests/${id}`, {
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
                    passengerprice={item.passengerprice}
                    to={to}
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

    const priceHandler = (price) => {
        if (price === null) { return 'price' } else {
            const truncPrice = price.toFixed(2)
            const formatPrice = formatter.format(truncPrice);
            return (formatPrice)
        }
    }

    //this may need a diff trigger

    //think about how this will refresh

    useEffect(() => {
        if (momentFormat(dateFormat) === momentFormat(todayDate)) {
            setIsActive(true)
        }
    }, []);



    const checkInHandler = async () => {
        try {

            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch(`https://spareseat-app.herokuapp.com//dashboard/getrequests/${id}`, {
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



    return (
        //use filter to not render when the date is past the current date - expired
        // or include this logic in backend to change status to expired

        // display date using moment.js

        <View>

            <View style={isActive ? [styles.container, styles.isActive] : styles.container}>
                <View style={styles.halfContainer}>

                    <RouteDisplay
                        from={from}
                        to={to}
                        time={moment(dateFormat).format('HH:mm')}
                        date={isActive ? "Today" : moment(dateFormat).format('ddd Do MMM')}
                        price={priceHandler(price)}
                    />

                </View>
                <View style={styles.line}></View>
                
                
                    
                    
                    
                            <View>
                             <View style={styles.buttons}>

                                 <Button title="requests" onPress={getRequests} disabled={isVisiblePassengers} />
                                 <Button title="passengers" onPress={getPassengers} disabled={isVisibleRequests} />
                                 <Button color="#FF1654" title="delete" onPress={deleteLift} disabled={isVisibleRequests || isVisiblePassengers} />

                             </View>

                             <Button title="check passengers in" onPress={checkInHandler} />
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
            {isVisibleQR ?
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
                                    <DriverQR ids={QRids} />
                                    <Button title="close" onPress={() => setIsVisibleQR(false)} />
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
        height: Dimensions.get('window').height * 0.3,
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
    isActive: {
        borderColor: 'lightgreen',
        borderWidth: 3
    },
    buttons: {
        flexDirection: 'row',
        // height: "100%",
        justifyContent: 'center',
        // padding: '2%'
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
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('window').width * 0.8,
        justifyContent: 'center'
    },
    halfContainer: {
        //alignItems: 'center',
        flexDirection: 'row',
        width: '90%'
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
    }

})

export default LiftCard;
