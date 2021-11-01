import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native'
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

    const liftPostedHandler = async() => {
        await navigation.navigate('My Lifts', { refresh: true }) 
        navigation.popToTop()
    }


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ alignItems: 'center', marginBottom: '20%' }}>
                <View style={styles.textAlign}>
                    <Text style={{ fontSize: 26 }}>How many seats are available?</Text>
                </View>
                <View style={styles.twoSeats}>
                    <SeatButton onPress={() => setSeats(1)} Styles={seats >= 1} />
                    <SeatButton onPress={() => setSeats(2)} Styles={seats >= 2} />
                    {/* </View>
            <View style={styles.twoSeats}> */}
                    <SeatButton onPress={() => setSeats(3)} Styles={seats >= 3} />
                    <SeatButton onPress={() => setSeats(4)} Styles={seats >= 4} />
                </View>

            </View>

            <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={{ fontSize: 26 }}>When are you leaving?</Text>
            </View>

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
                    minimumDate={date}
                />)}
            </View>

            {/* change so that it can be anytime and not today */}

            <View style={styles.line}></View>
            <View style={{ alignSelf: 'center' }}>
                <NextButton text="Post Route" disabled={seats && date != undefined ? false : true} onPress={onGoPress} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    twoSeats: {
        flexDirection: 'row'
    },
    textAlign: {
        padding: '3%'
    },
    priceArea: {

        // height: Dimensions.get('window').height * 0.1,
        // width: Dimensions.get('window').width * 0.3,
        width: '50%',
        //alignItems: 'center',
        justifyContent: 'center',
        // padding: '4%',
        //marginLeft: '2%'
        marginBottom: '5%',
        height: Dimensions.get('window').height * 0.1
    },
    line: {
        borderBottomWidth: 0.5,
        width: '85%',
        borderColor: 'grey',
        alignSelf: 'center',
        // marginBottom: Dimensions.get('screen').height * 0.01
    }
})

export default DriverRouteTwo;