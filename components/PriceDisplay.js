import React from "react";
import { View, Text, StyleSheet, Dimensions, Button, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import driverPriceCalc from '../server/utilities/driverPriceCalc'

const PriceDisplay = (props) => {

    const { price } = props

    // test further

    // console.log(driverPriceCalc(price, 3))

    const priceOne = driverPriceCalc(price, 1).toFixed(2)

    const priceTwo = driverPriceCalc(price, 2).toFixed(2)

    const priceThree = driverPriceCalc(price, 3).toFixed(2)

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, fontFamily: 'Inter_Bold', paddingBottom: '5%', color: '#0352A0' }}>Price Breakdown</Text>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%', height: '90%', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.row}>

                        <View style={{ flexDirection: 'row' }}>
                            <MaterialCommunityIcons name="seatbelt" size={32} color="#0466c8" />
                        </View>

                    </View>

                    <View style={styles.row}>

                        <View style={{ flexDirection: 'row' }}>
                            <MaterialCommunityIcons name="seatbelt" size={32} color="#0466c8" />
                            <MaterialCommunityIcons name="seatbelt" size={32} color="#0466c8" />
                        </View>

                    </View>

                    <View style={styles.row}>

                        <View style={{ flexDirection: 'row' }}>
                            <MaterialCommunityIcons name="seatbelt" size={32} color="#0466c8" />
                            <MaterialCommunityIcons name="seatbelt" size={32} color="#0466c8" />
                            <MaterialCommunityIcons name="seatbelt" size={32} color="#0466c8" />
                        </View>

                    </View>
                </View>
                <View style={styles.verticalLine}></View>
                <View style={{ width: '50%', height: '90%', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.row}>
                        <Text style={styles.price}>£{priceOne}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.price}>£{priceTwo}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.price}>£{priceThree}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // height: Dimensions.get('screen').height * 0.4,
        // width: Dimensions.get('screen').width * 0.78,
        flex: 1,
        padding: '3%'
        //justifyContent: 'center'
    },
    columnSection: {
        alignItems: 'center',
        width: '33%'
    },
    headerText: {
        fontFamily: 'Inter_Regular',
        color: 'white'
    },
    boldText: {
        fontFamily: 'Inter_ExtraBold',
        fontSize: 30,
        color: 'white'
    },
    nameText: {
        fontFamily: 'Inter_SemiBold',
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
    row: {
        height: '33%',
        justifyContent: 'center'
    },
    price: {
        fontSize: 22,
        fontWeight: '600',
        padding: '2%',
        color: '#0352A0'
    }
})

export default PriceDisplay;
