
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Button, Alert } from 'react-native'
import { useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons';
import StatusButton from './Buttons/StatusButton';

const StatusDisplay = (props) => {

    const token = useSelector(state => state.authorisation.userToken);

    const { liftid, status, setConfirmedRequests, setIsVisibleQR, requestid, navigation, isFocused } = props

    const cancelRequest = async () => {

        try {
            const response = await fetch(`https://spareseat-app.herokuapp.com/dashboard/cancelrequest/${requestid}`, {
                method: "DELETE",
                headers: { token: token }
            });

            //check if this works properly

            const parseRes = await response.json();

            Alert.alert(
                parseRes,
                "",
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('My Lifts')
                        //navigate back to MyLifts instead of cancelled
                    }
                ]
            )
        } catch (error) {
            console.log(error.message)
        }
    }



    const cancelPayment = async () => {
        try {

            const response = await fetch(`https://spareseat-app.herokuapp.com/payment/cancel/${requestid}`, {
                method: "DELETE",
                headers: { token: token }
            });

            const parseRes = await response.json()

            console.log(parseRes)

        } catch (error) {
            console.log(error.message)
        }
    }


    const cancelAll = async() => {
        await cancelPayment()
        cancelRequest()
    }



    return (
        <View style={styles.container}>
            <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                {status === "pending" ?
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Inter_500Medium', padding: '1%', color: '#C86604' }}>Pending</Text>
                        <Ionicons name="time-outline" size={24} color="#C86604" style={{ padding: '1%' }} />
                    </View>
                    : null}
                {status === "confirmed" ?
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Inter_500Medium', padding: '1%', color: "#11AC38" }}>Confirmed</Text>
                        <Ionicons name="checkmark-circle-outline" size={24} color="#11AC38" style={{ padding: '1%' }} />
                    </View>
                    : null}
                {/* {status === "confirmed" && isActive ? <Button title="check in" onPress={() => navigation.navigate('Check In', { id: liftid })} /> : null} */}
            </View>
            {/* <View style={styles.verticalLine}></View> */}
            <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', padding: '6%' }}>
                {status === "pending" ? <StatusButton style={"pending"} onPress={cancelAll} text="cancel request" /> : null}
                {status === "confirmed" ? <StatusButton style={"confirmed"} disabled={false} onPress={() => setIsVisibleQR(true)} text="Check In" /> : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('screen').height * 0.09,
        width: Dimensions.get('screen').width * 0.78,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    columnSection: {
        alignItems: 'center',
        width: '33%'
    },
    headerText: {
        fontFamily: 'Inter_400Regular',
        color: 'white'
    },
    boldText: {
        fontFamily: 'Inter_800ExtraBold',
        fontSize: 30,
        color: 'white'
    },
    nameText: {
        fontFamily: 'Inter_600SemiBold',
        color: 'white'
    },
    linearGradient: {
        flex: 1
    },
    verticalLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#909090',
        alignSelf: 'center'
    },
})

export default StatusDisplay;



