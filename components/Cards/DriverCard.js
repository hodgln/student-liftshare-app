import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import RouteDisplay from '../RouteDisplay';
import ProfileDisplay from '../ProfileDisplay';
import SeatsDisplay from '../SeatsDisplay';



const DriverCard = (props) => {

    const token = useSelector(state => state.authorisation.userToken);

    const navigation = useNavigation()

    const dateFormat = new Date(props.date)

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

    useEffect(() => { 
        passengerPrice()
        profileInfo()
    }, [])

    const {
        name,
        originName,
        destinationName,
        distance,
        seats,
        liftshare_id,
        price,
        driver_firstname,
        picture,
        driver_id
    } = props



    // console.log(liftshare_id)

    const priceHandler = (price) => {
        //console.log(confirmedRequests[0].count);
        return `£${((price / (JSON.parse(confirmedRequests) + 1)) + 0.5).toFixed(2)}`
    }

    return (
        // if seats >= 0 ... use ternary operator

        // only render date if const currentDate = new Date() --> if(currentDate > dateFormat) {return null} else {...}

        
            
                <View style={styles.container}>
                    
                    <RouteDisplay
                        from={originName}
                        to={destinationName}
                        time={moment(dateFormat).format('HH:mm')}
                        date={moment(dateFormat).format('ddd Do MMM')}
                        price={confirmedRequests === undefined ? price : priceHandler(price)}
                    />
                    <View style={styles.line}></View>
                    <ProfileDisplay picture={picture} firstname={driver_firstname} completed={completedLifts} rating={rating}/>
                    <View style={styles.line}></View>
                        <SeatsDisplay seats={seats} liftshare_id={liftshare_id} />
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
})

export default DriverCard;
