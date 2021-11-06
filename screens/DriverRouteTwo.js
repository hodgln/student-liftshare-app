import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Alert, Button } from 'react-native'
import SeatButton from '../components/Buttons/SeatButton'
import DateTimePicker from '@react-native-community/datetimepicker';
import NextButton from '../components/Buttons/NextButton';
import { useSelector } from 'react-redux';



const DriverRouteTwo = ({ route, navigation }) => {

    const [seats, setSeats] = useState()

    const token = useSelector(state => state.authorisation.userToken);

    const { distance, origin, destination, originname, destinationname } = route.params

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(true);

    const destinationlocation = (`${destination.longitude}, ${destination.latitude}`)
    const originlocation = (`${origin.longitude}, ${origin.latitude}`)

    // console.log(destinationlocation)

    const minimumDate = new Date().setHours(0, 0, 0, 0)

    console.log(date.toDateString())

    const driverprice = distance * 0.62137119 * 0.159;

    const mode = 'datetime'

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const onGoPress = async () => {
        try {
            const datepicked = date.toISOString();

            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);


            const body = { datepicked, originlocation, destinationlocation, originname, destinationname, seats, driverprice }
            const response = await fetch("http://localhost:8081/dashboard/Liftshares", {
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


    return (
        <View style={styles.container}>
            <View style={styles.componentContainer}>
                <View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
                    <View style={styles.textAlign}>
                        <Text style={{ fontSize: 20 }}>How many seats are available?</Text>
                    </View>
                    <View style={styles.line}></View>
                    <View style={{ padding: 10 }}>
                        <View style={styles.twoSeats}>
                        <SeatButton onPress={() => setSeats(1)} Styles={seats >= 1} />
                        <SeatButton onPress={() => setSeats(2)} Styles={seats >= 2} />
                        <SeatButton onPress={() => setSeats(3)} Styles={seats >= 3} />
                        <SeatButton onPress={() => setSeats(4)} Styles={seats >= 4} />
                    </View>
                        {/* <Picker
                            selectedValue={seats}
                            onValueChange={(itemValue, itemIndex) =>
                                setSeats(itemValue)
                            }>
                            <Picker.Item label="1" value={1} />
                            <Picker.Item label="2" value={2} />
                            <Picker.Item label="3" value={3} />
                            <Picker.Item label="4" value={4} />
                        </Picker> */}
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
                    <NextButton text="Post Route" disabled={seats !== undefined && date >= new Date() ? false : true} onPress={onGoPress} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    twoSeats: {
        flexDirection: 'row'
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
    }
})

export default DriverRouteTwo;