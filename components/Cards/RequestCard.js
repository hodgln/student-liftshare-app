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


    const {
        firstname,
        id,
        request_id,
        picture,
        to
    } = props

    // const bookLift = async () => {
    //     try {

    //         const response = await fetch(`http://192.168.1.142:8081/dashboard/seats/${id}`, {
    //             method: "PUT",
    //             headers: { token: token }
    //         });

    //         const reqParseRes = await response.json()

    //         setDisabled(true)

    //         console.log(reqParseRes)
    //         //     '',
    //         //     [
    //         //       {text: 'OK', onPress: () => navigation.navigate('Home')},
    //         //     ],
    //         //     {cancelable: false},
    //         //   );
    //     } catch (error) {
    //         console.log(error.message)
    //     }

    //     //combine both queries and make into one 

    // }

    const statusHandler = async (status) => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);
            const body = { status, request_id, id, to }

            const response = await fetch("http://192.168.1.142:8081/dashboard/handlestatus", {
                method: "PUT",
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const statusParseRes = await response.json()

            

            if(statusParseRes === "declined") {
                return
            } else {
                

                // const triggerDate = moment(statusParseRes).subtract(1, 'days').unix()

                const date = new Date(statusParseRes);

                const triggerDate = date.setDate(date.getDate() - 1)

                //setHours to 10am if want to show notification then!! 

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
            
            };

            setDisabled(true)

        } catch (error) {
            console.log(error.message)
        }
    }



    return (
        //(liftStatus === 'pending') ?
        <View style={styles.shadow}>
            <View style={styles.container}>
                <ProfileDisplay picture={picture} firstname={firstname} />
                <View style={styles.line}></View>
                <View>

                    <View style={styles.buttons}>
                        {/* <Button title="accept" onPress={acceptOnPress} disabled={disabled} />
                <Button title="decline" onPress={() => statusHandler('declined')} disabled={disabled} /> */}
                        <RequestButton text="accept" style="accept" onPress={() => statusHandler('confirmed')} disabled={disabled} />
                        <RequestButton text="decline" style="decline" onPress={() => statusHandler('declined')} disabled={disabled} />
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
