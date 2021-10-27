
import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { Avatar } from 'react-native-elements'
import moment from 'moment';

const PassengerCard = (props) => {


    const dateFormat = new Date(props.date)

    const token = useSelector(state => state.authorisation.userToken);

    const navigation = useNavigation();

    const [confirmedRequests, setConfirmedRequests] = useState();
    const [isActive, setIsActive] = useState(true)



    const {
        from,
        to,
        firstname,
        surname,
        status,
        price,
        picture,
        id,
        liftid,
        phone
    } = props

    const cancelRequest = async () => {
        try {
            const response = await fetch(`http://localhost:8081/dashboard/cancelrequest/${id}`, {
                method: "DELETE",
                headers: { token: token }
            });

            //check if this works properly

            const parseRes = await response.json();

            console.log(parseRes);
        } catch (error) {
            console.log(error.message)
        }
    }

    const passengerPrice = async () => {
        try {
            const response = await fetch(`http://localhost:8081/dashboard/passengerprice/${liftid}`, {
                method: "GET",
                headers: { token: token }
            });


            const parseRes = await response.json();

            setConfirmedRequests(parseRes);

        } catch (error) {
            console.log(error.message)
        }
    }


    useEffect(() => { passengerPrice() }, []);

    //add in below function to above useEffect

    // const dateHandler = () => {if(dateFormat === new Date()) {
    //     setIsActive(true)
    // // } else {
    // //     setIsActive(false)
    // // }
    // }
    // }

    const priceHandler = (price) => {
        if (confirmedRequests != 0) {
            return `£${((price / confirmedRequests) + 0.5).toFixed(2)}`
        } else {
            return `£${price.toFixed(2)}`
        }
    }

    const messagePressHandler = async () => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch(`http://localhost:8081/conversation/passengerconvo/${liftid}`, {
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

        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '600', padding: '2%'}}>{JSON.parse(from)} to {JSON.parse(to)}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
            <View style={styles.column}>
            <Text style={{ fontSize: 18, fontWeight: '600', padding: '1%'}}>{moment(dateFormat).format("DD / MM / YYYY")}</Text>
            <Text style={{ fontSize: 20, fontWeight: '500', padding: '2%' }}>{moment(dateFormat).format('HH:mm')}</Text>
                <Text style={{ fontSize: 17, fontWeight: '600', padding: '2%' }}>{status}</Text>
                <Text style={{ fontSize: 22, fontWeight: '700', padding: '1%' }}>{priceHandler(price)}</Text>
                
                
                {/* <Button title="message driver" onPress={messagePressHandler}/> : null} */}
            </View>
            <View style={styles.verticalLine}></View>
            <View style={styles.column}>
                
                <Avatar
                    rounded
                    size='large'
                    source={{
                        uri:
                            picture,
                    }}
                />
                
                <Text style={{ fontSize: 17, fontWeight: '600', padding: '2%' }}>{firstname} {surname}</Text>
                {status === "confirmed" ? <Text style={{ fontSize: 18, fontWeight: '700', padding: '1%' }}>{phone}</Text> : null}
                </View>
            </View>
                {status === "pending" ? <Button title="cancel request" onPress={cancelRequest} /> : null}
                {status === "confirmed" && isActive ? <Button title="check in" onPress={() => navigation.navigate('Check In', { id: liftid })} /> : null}
        </View>
    )
}

//pass props to the messaging screen

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width * 0.9,
        height: Dimensions.get('window').height * 0.25,
        borderRadius: 20,
        borderWidth: 0.1,
        backgroundColor: 'white',

        //alignItems: 'center',
        //justifyContent: 'center',
        marginBottom: Dimensions.get('window').height * 0.02,
        
    },
    column: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        padding: 5
    },
    verticalLine: {
        height: '70%',
        width: 1,
        backgroundColor: '#909090',
        alignSelf: 'center'
    }
})

export default PassengerCard;
