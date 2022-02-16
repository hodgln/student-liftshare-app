import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import ProfileDisplay from '../ProfileDisplay';
import RequestButton from '../Buttons/RequestButton';
import * as Notifications from 'expo-notifications';
import moment from 'moment';

const RequestCard = (props) => {

    const token = useSelector(state => state.authorisation.userToken);
    const [disabled, setDisabled] = useState(false);

    const [rating, setRating] = useState();
    const [completedLifts, setCompletedLifts] = useState()
    const [accepted, setAccepted] = useState(false)

    

    const {
        firstname,
        id,
        request_id,
        picture,
        to,
        passenger_id,
        passengerprice
    } = props

    console.log(passengerprice, request_id)

    //route to get rating and completed

    useEffect(() => {
        profileInfo()
    }, [])


    const profileInfo = async () => {
        try {
            const response = await fetch(`http://api.spareseat.app/dashboard/passengerprofile/${passenger_id}`, {
                method: "GET",
                headers: { token: token }
            });


            const parseRes = await response.json();

            console.log(parseRes)
            if(parseRes.rating) {
                setRating(parseRes.rating)
            } else {
                setRating(null)
            }
            
            setCompletedLifts(parseRes.completed)

        } catch (error) {
            console.log(error.message)
        }
    }
   
    const statusHandler = async (status) => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);
            const body = { status, request_id, id, to }

            const response = await fetch("http://api.spareseat.app/dashboard/handlestatus", {
                method: "PUT",
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const statusParseRes = await response.json()

            

            if(statusParseRes === "declined") {

                const cancelBody = { request_id } 
                
                const cancelPayment = await fetch("http://api.spareseat.app/payment/cancel", {
                    method: "POST",
                    headers: myHeaders,
                    body: JSON.stringify(cancelBody)
                });

                const parseCancel = await cancelPayment.json()

                console.log(parseCancel)

            } else {

                // trigger animation and set disabled to true
                
                setAccepted(true)
                setDisabled(true)

                //does this notification make any sense?

                const date = new Date(statusParseRes);

                const triggerDate = date.setDate(date.getDate() - 1)

                const displayTime = moment(date).format('HH:mm');

                Notifications.scheduleNotificationAsync({
                    content: {
                        title: `You are driving at ${displayTime} tomorrow!`,
                        body: "Please contact your passengers to arrange picking them up"
                    },
                    trigger: {
                        date: triggerDate,
                        repeats: false
                    }
                });

                // capture the payment

                const captureBody = { request_id } 

                const capturePayment = await fetch("http://api.spareseat.app/payment/capture", {
                    method: "POST",
                    headers: myHeaders,
                    body: JSON.stringify(captureBody)
                });

                const parseResult = await capturePayment.json()

                console.log(parseResult)

                
            
            };

            setDisabled(true)

        } catch (error) {
            console.log(error.message)
        }
    }



    return (
        //(liftStatus === 'pending') ?
        <View style={styles.shadow}>
            <View style={accepted ? [styles.container, {borderColor: 'green', borderWidth: 2 }] : styles.container }>
                <ProfileDisplay picture={picture} firstname={firstname} rating={rating} completed={completedLifts}/>
                <View style={styles.line}></View>
                <View>

                    <View style={styles.buttons}>
                        {/* <Button title="accept" onPress={acceptOnPress} disabled={disabled} />
                <Button title="decline" onPress={() => statusHandler('declined')} disabled={disabled} /> */}
                        <RequestButton text="accept" style="filled" onPress={() => statusHandler('confirmed')} disabled={disabled} />
                        <RequestButton text="decline" style="outline" onPress={() => statusHandler('declined')} disabled={disabled} />
                    </View>
                </View>
            </View>
        </View>
        // ) : null

    )
}

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({
    container: {
        //width: Dimensions.get('screen').width * 0.8,
        // height: Dimensions.get('window').height * 0.125,
        flex: 1,
        borderRadius: 20,
        backgroundColor: 'white',
        marginBottom: 15,
        alignItems: 'center',
        padding: '3%',
        justifyContent: 'space-evenly'
    },
    buttons: {
        flexDirection: 'row',
        padding: '2%',
        justifyContent: 'center'
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: '1%'
    },
    leftColumn: {
        alignItems: 'center'
    },
    avatar: {
        padding: '10%'
    },
    line: {
        borderBottomWidth: 0.5,
        width: '80%',
        borderColor: 'grey',
        alignSelf: 'center',
        padding: '1%'
    },
})

export default RequestCard;
