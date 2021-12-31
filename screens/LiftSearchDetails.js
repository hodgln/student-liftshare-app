import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ImageBackground } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import RouteDisplay from '../components/RouteDisplay';
import ProfileDisplay from '../components/ProfileDisplay';
import SeatsDisplay from '../components/SeatsDisplay';



const LiftSearchDetails = ({ route, navigation }) => {

    const token = useSelector(state => state.authorisation.userToken);

    const dateFormat = new Date(route.params.date)

    const [map, setMap] = useState()
    const [confirmedRequests, setConfirmedRequests] = useState();
    const [rating, setRating] = useState();
    const [completedLifts, setCompletedLifts] = useState();

    // use this request in the 'requests' section of profileScreen for drivers to decrement the seats on confirmation of the requests

    const passengerPrice = async () => {
        try {
            const response = await fetch(`http://192.168.86.99:8081/dashboard/passengerprice/${liftshare_id}`, {
                method: "GET",
                headers: { token: token }
            });


            const parseRes = await response.json();

            setConfirmedRequests(parseRes);

        } catch (error) {
            console.log(error.message)
        }
    }

    const profileInfo = async () => {
        try {
            const response = await fetch(`http://192.168.86.99:8081/dashboard/driverprofile/${driver_id}`, {
                method: "GET",
                headers: { token: token }
            });


            const parseRes = await response.json();

            console.log(parseRes)

            setRating(parseRes.rating)
            setCompletedLifts(parseRes.completed)

        } catch (error) {
            console.log(error.message)
        }
    }
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

            console.log(origin, destination)

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

    useEffect(() => {
        const mapHandler = async () => {
            const polyline = await getPolyline(
                { latitude: origin.y, longitude: origin.x },
                { latitude: destination.y, longitude: destination.x }
            );
            getMapImg(polyline)
        }
        mapHandler()
        passengerPrice()
        profileInfo()
    }, [])



    const {
        from,
        to,
        seats,
        liftshare_id,
        price,
        driver_firstname,
        picture,
        driver_id,
        origin,
        destination
    } = route.params


    console.log(origin, destination)


    // console.log(liftshare_id)

    const priceHandler = (price) => {
        //console.log(confirmedRequests[0].count);
        return `£${((price / (JSON.parse(confirmedRequests) + 1)) + 0.5).toFixed(2)}`
    }

    return (
        // if seats >= 0 ... use ternary operator

        // only render date if const currentDate = new Date() --> if(currentDate > dateFormat) {return null} else {...}

        <View style={{ flex: 1 }}>
            {map === undefined ? null : (<ImageBackground style={styles.Image} source={{ uri: map }} />)}

            <View style={styles.backgroundContainer}>
                <View style={styles.container}>

                    <RouteDisplay
                        from={from}
                        to={to}
                        time={moment(dateFormat).format('HH:mm')}
                        date={moment(dateFormat).format('ddd Do MMM')}
                        price={confirmedRequests === undefined ? price : priceHandler(price)}
                    />
                    <View style={styles.line}></View>
                    <ProfileDisplay picture={picture} firstname={driver_firstname} completed={completedLifts} rating={rating} />
                    <View style={styles.line}></View>
                    <SeatsDisplay seats={seats} liftshare_id={liftshare_id} />
                </View>
            </View>

        </View>
    )
}

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width * 0.9,
        height: Dimensions.get('window').height * 0.5,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: Dimensions.get('window').height * 0.02,
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: '3%'
    },
    column: {
        width: '50%',
        alignItems: 'center'
    },
    verticalLine: {
        height: '70%',
        width: 1,
        backgroundColor: '#909090',
        alignSelf: 'center'
    },
    line: {
        borderBottomWidth: 0.5,
        width: Dimensions.get('screen').width * 0.75,
        borderColor: 'grey',
        padding: '1%',
        marginVertical: '1.5%',

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
    }
})

export default LiftSearchDetails;
