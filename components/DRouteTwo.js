import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Alert, Button, TouchableOpacity } from 'react-native'
import SeatButton from '../components/Buttons/SeatButton'
import DateTimePicker from '@react-native-community/datetimepicker';
import NextButton from '../components/Buttons/NextButton';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';



const DriverRouteTwo = (props) => {

    const { 
        setSeats,
        onGoPress,
        date,
        seats,
        setDate
     } = props

    console.log(seats)


    const [show, setShow] = useState(true);

    

    // console.log(destinationlocation)

    const minimumDate = new Date().setHours(0, 0, 0, 0)

    const mode = 'datetime'

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };


    return (
        <View>
            <BlurView style={styles.componentContainer}>
                <View style={{ padding: '4%' }}>
                    <View style={styles.textAlign}>
                        <Text style={{ fontSize: 20, color: '#D0D3D4', fontFamily: 'Inter_400Regular' }}>How many seats are available?</Text>
                    </View>
                    <View style={styles.line}></View>
                    <View style={{ padding: 10, justifyContent: 'center' }}>
                        <View style={styles.twoSeats}>
                            <View style={styles.addsubtract}>
                                <TouchableOpacity onPress={() => setSeats(seats - 1)} disabled={seats === 0}>
                                    <Ionicons name="remove-circle-outline" size={28} color="#F0F3F4" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '80%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={styles.boldText}>{seats}</Text>
                            </View>

                            <View style={styles.addsubtract}>
                                <TouchableOpacity onPress={() => setSeats(seats + 1)} disabled={seats === 3}>
                                    <Ionicons name="add-circle-outline" size={28} color="#F0F3F4"  />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1, padding: 15, justifyContent: 'center' }}>

                    <View style={styles.textAlign}>
                        <Text style={{ fontSize: 20, color: '#535454', fontFamily: 'Inter_400Regular' }}>When are you leaving?</Text>
                    </View>

                    <View style={styles.line}></View>

                    <View style={styles.priceArea}>
                        {/* <Text>price:</Text>
                    <Text>£{isNaN(driverprice) ? '0' : driverprice.toFixed(2)}</Text> */}
                        {show && (<DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            minuteInterval={15}
                            minimumDate={minimumDate}
                        />)}
                    </View>

                </View>
                {/* change so that it can be anytime and not today */}

                <View style={styles.bottomline}></View>
                <View style={{ alignSelf: 'center', marginBottom: Dimensions.get('screen').height * 0.03 }}>
                    <NextButton text="Post Route" disabled={seats !== 0 && date >= new Date() ? false : true} onPress={onGoPress} />
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
        width: '70%'
    },
    line: {
        borderBottomWidth: 0.3,
        width: '85%',
        borderColor: 'grey',
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
        fontFamily: 'Inter_800ExtraBold',
        fontSize: 50,
        color: '#F0F3F4'
    },
})

export default DriverRouteTwo;