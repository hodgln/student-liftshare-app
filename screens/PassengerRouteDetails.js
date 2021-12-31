import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, Modal, Linking, Image, ImageBackground } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import PassengerQR from '../components/PassengerQR';
import { useIsFocused } from '@react-navigation/core';
import moment from 'moment';
import RouteDisplay from '../components/RouteDisplay';
import ContactDisplay from '../components/ContactDisplay';
import StatusDisplay from '../components/StatusDisplay';

const PassengerRouteDetails = ({ route, navigation }) => {


    const {
        from,
        to,
        origin,
        destination,
        firstname,
        surname,
        status,
        price,
        picture,
        requestid,
        liftid,
        phone,
        userID,
        date,
        isActive
    } = route.params

    const dateFormat = new Date(date)

    const token = useSelector(state => state.authorisation.userToken);

    // const navigation = useNavigation();

    const [confirmedRequests, setConfirmedRequests] = useState();
    const [map, setMap] = useState()
    const [isVisibleQR, setIsVisibleQR] = useState(false)


    const isFocused = useIsFocused()

    const getMapImg = async (urlpath) => {
        try {
            const body = { urlpath }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);


            const response = await fetch("http://192.168.86.99:8081/locations/signurl", {
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

            

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);


            const response = await fetch("http://192.168.86.99:8081/locations/distance", {
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

    //add in below function to above useEffect

    // const dateHandler = () => {if(dateFormat === new Date()) {
    //     setIsActive(true)
    // // } else {
    // //     setIsActive(false)
    // // }
    // }
    // }

    const mapHandler = async() => {
        console.log(origin.y, destination.y)
        const polyline = await getPolyline(
            { latitude: origin.y, longitude: origin.x },
            { latitude: destination.y, longitude: destination.x }
        );
        getMapImg(polyline)
        }

    

    useEffect(() => {    
        mapHandler()
    }, [])

    // const mapHandler = async () => {
    //     const polyline = await getPolyline(
    //         { latitude: props.origin.y, longitude: props.origin.x },
    //         { latitude: props.destination.y, longitude: props.destination.x }
    //     );
    //     getMapImg(polyline)
    // }


    const priceHandler = (price) => {
        if (confirmedRequests != 0) {
            return `£${((price / confirmedRequests) + 0.5).toFixed(2)}`
        } else {
            return `£${price.toFixed(2)}`
        }
    }

    // console.log(map)

    const messagePressHandler = async () => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch(`http://192.168.86.99:8081/conversation/passengerconvo/${liftid}`, {
                method: "GET",
                headers: myHeaders
            });

            const parseRes = await response.json()

            navigation.navigate('Chat', {
                firstname: firstname,
                surname: surname,
                from: from,
                to: to,
                convo_id: parseRes[0].conversation_id,
                user_id: parseRes[0].passenger_id
            });
        } catch (error) {
            console.log(error.message)
        };
        //console.log(convoID)
    }
     


    
    // if seats >= 0 ... use ternary operator
    //send 'price change' notification if no. confirmed requests = >2 
    return (
        <View style={{ flex: 1 }}>
            {map === undefined ? null : (<ImageBackground style={styles.Image} source={{ uri: map }} />)}
            <View style={styles.backgroundContainer}>
                <View style={styles.container}>

                    <View style={{ width: '91%', flexDirection: 'row', paddingTop: '3%', paddingHorizontal: '3%' }}>
                        <RouteDisplay
                            from={from}
                            to={to}
                            time={moment(dateFormat).format('HH:mm')}
                            date={isActive ? "Today" : moment(dateFormat).format('ddd Do MMM')}
                            price={priceHandler(price)}
                        />

                    </View>
                    {/* <Button title="message driver" onPress={messagePressHandler}/> : null} */}

                    <View style={styles.line}></View>

                    <View style={styles.column}>

                        <ContactDisplay
                            picture={picture}
                            firstname={firstname}
                            surname={status === "confirmed" ? surname : ""}
                            phone={phone}
                        />

                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <PhoneButton disabled={false} onPress={() => Linking.openURL(`tel:${phone}`)} text="call" type="fill" />
                    <PhoneButton disabled={false} onPress={() => Linking.openURL(`sms:${phone}`)} text="text" type="border" />
                </View> */}


                        {/* <Text style={{ fontSize: 17, fontWeight: '600', padding: '2%' }}>{firstname} {surname}</Text>
                    {status === "confirmed" ? <Text style={{ fontSize: 18, fontWeight: '700', padding: '1%' }}>{phone}</Text> : null} */}
                    </View>
                    <View style={styles.line}></View>
                    <StatusDisplay
                        liftid={liftid}
                        status={status}
                        setConfirmedRequests={setConfirmedRequests}
                        requestid={requestid}
                        isFocused={isFocused}
                        isActive={isActive}
                        setIsVisibleQR={setIsVisibleQR}
                        navigation={navigation}
                    />
                </View>
            </View>
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
                                <PassengerQR id={userID} />
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

//pass props to the messaging screen

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width * 0.9,
        height: Dimensions.get('window').height * 0.5,
        borderRadius: 20,
        borderWidth: 0.1,
        backgroundColor: 'white',

        alignItems: 'center',
        //justifyContent: 'center',
        marginBottom: Dimensions.get('window').height * 0.02,
        alignSelf: 'center'

    },
    column: {
        justifyContent: 'center',
        //alignItems: 'center',
        // width: '90%',,
        marginTop: '3%'
    },
    line: {
        borderBottomWidth: 0.5,
        width: Dimensions.get('screen').width * 0.75,
        borderColor: 'grey',
        padding: '1%',
        marginVertical: '1.5%',
    },
    verticalLine: {
        height: Dimensions.get('window').height * 0.08,
        width: 0.5,
        backgroundColor: '#909090',
        //justifyContent: 'center',

    },
    Image: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: -1,
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('screen').width * 1
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
centredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginTop: 22,
    height: Dimensions.get('window').height * 0.4
}
})

export default PassengerRouteDetails;
