import React from 'react'
import { View, StyleSheet, Dimensions, Button, Text } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import NextButton from '../components/Buttons/NextButton';
import RouteDropDown from '../components/RouteDropDown'



const PassengerRoute = props => {

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(true);

    const [originID, setOriginID] = useState(null)
    const [destinationID, setDestinationID] = useState(null)

    const [originLatitude, setOriginLatitude] = useState()
    const [originLongitude, setOriginLongitude] = useState()

    const [destinationLatitude, setDestinationLatitude] = useState()
    const [destinationLongitude, setDestinationLongitude] = useState()

    const [placeholderFrom, setPlaceholderFrom] = useState(null)
    const [placeholderTo, setPlaceholderTo] = useState(null)

    const token = useSelector(state => state.authorisation.userToken)

    const origin = {latitude: originLatitude, longitude: originLongitude}

    const destination = {latitude: destinationLatitude, longitude: destinationLongitude}

    useEffect(() => {

        if (originID !== null) {

            getCoords(originID).then((data) => {
                setOriginLatitude(data.location.lat)
                setOriginLongitude(data.location.lng)
                
            }).catch((e) => console.log(e))

        } else {
            setOriginLatitude(null)
            setOriginLongitude(null)
            
        }


        if (destinationID !== null) {

            getCoords(destinationID).then(data => {
                setDestinationLatitude(data.location.lat)
                setDestinationLongitude(data.location.lng)
            }).catch((e) => console.log(e))
        } else {
            setDestinationLatitude(null)
            setDestinationLongitude(null)
            
        }

    }, [destinationID, originID])


    const getCoords = async (place_id) => {
        try {

            const response = await fetch(`http://localhost:8081/locations/coords/${place_id}`, {
                method: 'GET',
                headers: {
                    token: token
                }
            });

            const parseRes = await response.json();

            return (parseRes)

        } catch (error) {
            console.log(error.message)
        }
    }
        



    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const onGoPress = () => {
        props.navigation.navigate('Choose Driver', { origin: origin, destination: destination })
    }

    const mode = 'date'

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{fontSize: 26, alignSelf: 'center' }}>Where are you going from?</Text>

            <View style={{ alignItems: 'center' }}>
                <RouteDropDown placeholder="from" setID={setOriginID} setValueName={setPlaceholderFrom} valueName={placeholderFrom} />
            </View>
            {/* <View style={styles.line}></View> */}
            <View style={{height: Dimensions.get('window').height * 0.1, justifyContent: 'flex-end'}}>
                <Text style={{fontSize: 26, alignSelf: 'center'}}>Where are you going to?</Text>
            </View>

            <View style={{ alignItems: 'center', marginBottom: Dimensions.get('screen').height * 0.05 }}>
                <RouteDropDown placeholder="to" setID={setDestinationID} setValueName={setPlaceholderTo} valueName={placeholderTo} />
            </View>

        <Text style={{ fontSize: 26, alignSelf: 'center', padding: '3%', marginTop: Dimensions.get('window').height * 0.04 }}>When are you leaving?</Text>
            <View style={styles.datetime}>
                {show && (<DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    minuteInterval={15}
                />
                )}
            </View>
            <View style={styles.line}></View>
            <View style={{ alignSelf: 'center'  }}>
                <NextButton text="FIND LIFT"onPress={onGoPress} disabled={destinationLongitude && originLongitude !== undefined ? false : true} />
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    routeInputFields: {
        // backgroundColor: '#fff',
        height: Dimensions.get('window').height * 0.15,
        justifyContent: 'center',
    },
    datetime: {
        marginLeft: '37%',
        marginBottom: Dimensions.get('window').height * 0.04
    },
    list: {
        height: 300
    },
    line: {
        borderBottomWidth: 0.5,
        width: '85%',
        borderColor: 'grey',
        alignSelf: 'center',
        // marginBottom: Dimensions.get('screen').height * 0.01
    }
})

export default PassengerRoute