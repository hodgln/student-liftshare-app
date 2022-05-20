import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Button } from 'react-native'
import NextButton from '../components/Buttons/NextButton';
import { TextInputMask } from 'react-native-masked-text'
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import driverPriceCalc from '../server/utilities/driverPriceCalc'


const DriverRouteThree = (props) => {

    const {
        setPrice,
        price,
        infoOnPress,
        suggestedPrice,
        onGoPress
    } = props;

    const workingPrice = price.substring(1)


    const priceOne = workingPrice > 3 ? `£${driverPriceCalc(workingPrice, 1).toFixed(2)}` : '...'

    const priceTwo = workingPrice > 3 ? `£${driverPriceCalc(workingPrice, 2).toFixed(2)}` : '...'

    const priceThree = workingPrice > 3 ? `£${driverPriceCalc(workingPrice, 3)}` : '...'

    // the view is not rendering properly due to the price display section being flex: 1

    return (
        <View>
            <BlurView style={styles.componentContainer}>
                <View style={{ padding: '2.5%', height: '40%', marginBottom: '5%' }}>
                    <View style={styles.textAlign}>
                        <Text style={{ fontSize: 20, color: '#D0D3D4', fontFamily: 'Inter_Regular' }}>Please set a max price for your lift</Text>
                    </View>
                    <View style={styles.topLine}></View>
                    <View style={styles.textAlign}>
                        <Text style={{ fontSize: 16, color: '#D0D3D4', fontFamily: 'Inter_Regular' }}>Suggested price: £{suggestedPrice}</Text>
                    </View>
                    <View>

                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: '50%' }}>

                            {/* <TextInput
                                value={price}
                                style={styles.boldText}
                                onChangeText={(text) => setPrice(text)}
                                maxLength={4}
                            /> */}
                            <View style={{ width: '20%' }}></View>
                            <View style={{ width: '60%', alignItems: 'center' }}>
                                <TextInputMask
                                    type={'money'}
                                    options={{
                                        precision: 2,
                                        separator: '.',
                                        unit: '£',
                                    }}
                                    value={price.length === 0 ? 0 : price}
                                    onChangeText={text => setPrice(text)}
                                    style={styles.boldText}
                                    maxLength={7}
                                    autoFocus={true}
                                />
                            </View>
                            <View style={{ width: '20%', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => infoOnPress()}>
                                    <Ionicons name="information-circle-sharp" size={30} color="#0352A0" />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </View>

                <View style={{ width: '100%', height: '30%', padding: 15, width: '100%', justifyContent: 'flex-end' }}>
                    {/* <View style={styles.textAlign}>
                        <Text style={{ fontSize: 16, color: '#535454', fontFamily: 'Inter_400Regular' }}>* this depends on the number of passengers you choose:</Text>
                    </View> */}

                    {/* <View style={styles.textAlign}>
                        <Text style={{ fontSize: 20, color: '#535454', fontFamily: 'Inter_400Regular' }}>Please enter your registration number</Text>
                    </View>

                    <View style={styles.line}></View>

                    <View style={styles.priceArea}>

                    </View> */}
                    <View style={{ flexDirection: 'row', height: '100%' }}>
                        <View style={{ width: '33%', alignItems: 'center', borderRightWidth: 0.5, borderRightColor: '#535454' }}>
                            <View style={{ flexDirection: 'row', height: '50%' }}>
                                <MaterialCommunityIcons name="seatbelt" size={26} color="#0352A0" />
                            </View>
                            <View style={{ height: '50%' }}>
                                <Text style={styles.price}>{priceOne}</Text>
                            </View>
                        </View>
                        <View style={{ width: '33%', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', height: '50%' }}>
                                <MaterialCommunityIcons name="seatbelt" size={26} color="#0352A0" />
                                <MaterialCommunityIcons name="seatbelt" size={26} color="#0352A0" />
                            </View>
                            <View style={{ height: '50%' }}>
                                <Text style={styles.price}>{priceTwo}</Text>
                            </View>
                        </View>
                        <View style={{ width: '33%', alignItems: 'center', borderLeftWidth: 0.5, borderLeftColor: '#535454' }}>
                            <View style={{ flexDirection: 'row', height: '50%' }}>
                                <MaterialCommunityIcons name="seatbelt" size={26} color="#0352A0" />
                                <MaterialCommunityIcons name="seatbelt" size={26} color="#0352A0" />
                                <MaterialCommunityIcons name="seatbelt" size={26} color="#0352A0" />
                            </View>
                            <View style={{ height: '50%' }}>
                                <Text style={styles.price}>{priceThree}</Text>
                            </View>
                        </View>
                    </View>

                </View>
                {/* change so that it can be anytime and not today */}

                {/* <View style={styles.bottomline}></View> */}
                <View style={{ alignSelf: 'center', marginBottom: Dimensions.get('screen').height * 0.03 }}>
                    <NextButton text="Post Route" disabled={workingPrice > 3 ? false : true} onPress={onGoPress} />
                </View>
            </BlurView>
        </View>
    )
}

const styles = StyleSheet.create({
    twoSeats: {
        flexDirection: 'row',
        width: '100%'
    },
    textAlign: {
        padding: '3%'
    },
    priceArea: {
        padding: '3%',
        justifyContent: 'center',
        //marginBottom: '5%',
        height: Dimensions.get('window').height * 0.1,
        alignSelf: 'center',
        width: '100%'
    },
    line: {
        borderBottomWidth: 0.3,
        width: '85%',
        borderColor: 'grey',
    },
    topLine: {
        borderBottomWidth: 0.7,
        width: '85%',
        borderColor: '#D0D3D4',
    },
    bottomline: {
        borderBottomWidth: 1,
        width: '85%',
        borderColor: 'grey',
        alignSelf: 'center',
        // marginBottom: Dimensions.get('screen').height * 0.01
        // marginVertical: '4%'
    },
    componentContainer: {
        height: Dimensions.get('window').height * 0.5,
        width: Dimensions.get('screen').width * 0.9,
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 20,
    },
    addsubtract: {
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    boldText: {
        fontFamily: 'Inter_ExtraBold',
        fontSize: 40,
        color: '#F0F3F4',
        flex: 1
    },
    price: {
        fontSize: 20,
        fontFamily: 'Inter_SemiBold',
        padding: '2%',
        color: '#0352A0'
    }
})

export default DriverRouteThree;