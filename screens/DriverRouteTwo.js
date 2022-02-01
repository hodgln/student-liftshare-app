import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Alert, Button, TouchableOpacity } from 'react-native'
import SeatButton from '../components/Buttons/SeatButton'
import DateTimePicker from '@react-native-community/datetimepicker';
import NextButton from '../components/Buttons/NextButton';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';



const DriverRouteTwo = ({ route, navigation }) => {

    const [seats, setSeats] = useState(0)

    const token = useSelector(state => state.authorisation.userToken);

    const { distance, origin, destination, originname, destinationname } = route.params

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(true);

    const destinationlocation = (`${destination.longitude}, ${destination.latitude}`)
    const originlocation = (`${origin.longitude}, ${origin.latitude}`)

    // console.log(destinationlocation)

    const minimumDate = new Date().setHours(0, 0, 0, 0)

    const driverprice = distance * 0.62137119 * 0.159;

    const roundedprice = driverprice.toFixed(2)
    //look at apis for the petrol value?

    const mode = 'datetime'

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    //create a function that takes into account stripe fees and creates a charge for each passenger based on that, save this value into the db for easy access later.
    // add into useEffect loop



    const onGoPress = async () => {
        try {
            const datepicked = date.toISOString();

            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);


            const body = { datepicked, originlocation, destinationlocation, originname, destinationname, seats, roundedprice }
            const response = await fetch("http://192.168.1.142:8081/dashboard/Liftshares", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(body)
            });


            const parseResponse = await response.json();

            if (parseResponse.rows.length !== 0) {
                Alert.alert(
                    "Lift Posted!",
                    "",
                    [
                        { text: "OK", onPress: () => liftPostedHandler() }
                    ]
                )
            } else {
                Alert.alert("There has been an error")
            }

        } catch (error) {
            console.log(error.message)
        }

    }

    const liftPostedHandler = async () => {
        await navigation.navigate('My Lifts', { refresh: true })
        navigation.popToTop()
    }

    /*

    get price and return a three row component (make new price component)

    component contains row 1
     price for one passenger (price /3) - 1

     price for two 2/3(price)

     for three (price)

    */


    return (
        <View style={styles.container}>
            <View style={styles.componentContainer}>
                <View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
                    <View style={styles.textAlign}>
                        <Text style={{ fontSize: 20 }}>How many seats are available?</Text>
                    </View>
                    <View style={styles.line}></View>
                    <View style={{ padding: 10, justifyContent: 'center' }}>
                        <View style={styles.twoSeats}>
                            <View style={styles.addsubtract}>
                                <TouchableOpacity onPress={() => setSeats(seats - 1)} disabled={seats === 0}>
                                    <Ionicons name="remove-circle-outline" size={28} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '80%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={styles.boldText}>{seats}</Text>
                            </View>

                            <View style={styles.addsubtract}>
                                <TouchableOpacity onPress={() => setSeats(seats + 1)} disabled={seats === 4}>
                                    <Ionicons name="add-circle-outline" size={28} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1, padding: 15, justifyContent: 'center' }}>

                    <View style={styles.textAlign}>
                        <Text style={{ fontSize: 20 }}>When are you leaving?</Text>
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
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    twoSeats: {
        flexDirection: 'row',
        width: '100%'
    },
    container: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        shadowOffset: {
            height: 3,
            width: -3
        },
        shadowRadius: 5,
        //shadowColor: 'black',
        shadowOpacity: 0.2,
    },
    textAlign: {
        padding: '3%'
    },
    priceArea: {
        padding: '3%',
        justifyContent: 'center',
        //marginBottom: '5%',
        height: Dimensions.get('window').height * 0.1,
        //alignSelf: 'center'
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
        height: Dimensions.get('window').height * 0.55,
        width: Dimensions.get('screen').width * 0.9,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 0.3,
        borderColor: 'darkgrey',
        borderRadius: 20
    },
    addsubtract: {
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    boldText: {
        fontFamily: 'Inter_800ExtraBold',
        fontSize: 50,
        color: '#0466c8'
    },
})

export default DriverRouteTwo;