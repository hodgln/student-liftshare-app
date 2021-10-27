import React, { useState, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Dimensions, Text, ScrollView, StyleSheet, View, Button } from 'react-native'
import Geocoder from 'react-native-geocoding'
import MapViewDirections from 'react-native-maps-directions';
import NextButton from '../components/Buttons/NextButton';
import RouteInput from '../components/RouteInput';
import RouteDropDown from '../components/RouteDropDown';
import { useSelector } from 'react-redux';


const DriverRouteOne = (props) => {

    const [originID, setOriginID] = useState(null)
    const [destinationID, setDestinationID] = useState(null)

    const [originLatitude, setOriginLatitude] = useState()
    const [originLongitude, setOriginLongitude] = useState()

    const [destinationLatitude, setDestinationLatitude] = useState()
    const [destinationLongitude, setDestinationLongitude] = useState()

    const [originName, setOriginName] = useState()
    const [destinationName, setDestinationName] = useState()

    const [placeholderFrom, setPlaceholderFrom] = useState(null)
    const [placeholderTo, setPlaceholderTo] = useState(null)


    const token = useSelector(state => state.authorisation.userToken)

    const origin = { latitude: originLatitude, longitude: originLongitude }

    const destination = { latitude: destinationLatitude, longitude: destinationLongitude }



    useEffect(() => {

        if (originID !== null) {

            getCoords(originID).then((data) => {
                setOriginLatitude(data.location.lat)
                setOriginLongitude(data.location.lng)
                setOriginName(data.name)
            }).catch((e) => console.log(e))

        } else {
            setOriginLatitude(null)
            setOriginLongitude(null)
            setOriginName(null)
        }


        if (destinationID !== null) {

            getCoords(destinationID).then(data => {
                setDestinationLatitude(data.location.lat)
                setDestinationLongitude(data.location.lng)
                setDestinationName(data.name)
            }).catch((e) => console.log(e))
        } else {
            setDestinationLatitude(null)
            setDestinationLongitude(null)
            setDestinationName(null)
        }

    }, [destinationID, originID]);


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


    const onNextPress = async() => {
        try {

            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const body = { origin, destination }

            const response = await fetch(`http://localhost:8081/locations/distance`, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const parseRes = await response.json()

            props.navigation.navigate('DRouteTwo', {
                distance: parseRes / 1000,
                originname: JSON.stringify(originName),
                destinationname: JSON.stringify(destinationName),
                origin: origin,
                destination: destination,
            });
            
        } catch (error) {
            console.log(error.message)
        }
    }



    return (

        <View style={{ justifyContent: 'center', flex: 1 }} >
            <View>
                <Text style={{ fontSize: 26, alignSelf: 'center' }}>Where are you driving from?</Text>
            </View>

            <View style={{ alignItems: 'center' }}>
                <RouteDropDown placeholder="from" setID={setOriginID} setValueName={setPlaceholderFrom} valueName={placeholderFrom} />
            </View>

            {/* <View style={styles.line}></View> */}
            <View style={{ height: Dimensions.get('window').height * 0.1, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 26, alignSelf: 'center' }}>Where are you driving to?</Text>
            </View>

            <View style={{ alignItems: 'center', marginBottom: Dimensions.get('screen').height * 0.05 }}>
                <RouteDropDown placeholder="to" setID={setDestinationID} setValueName={setPlaceholderTo} valueName={placeholderTo} />
            </View>


            <View style={styles.line}></View>
            <View style={{ alignSelf: 'center' }}>

                <NextButton disabled={origin.longitude !== null && destination.longitude !== null ? false : true} text="next" onPress={onNextPress} />
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    addressSearch: {
        height: Dimensions.get('window').height * 0.2,
        width: Dimensions.get('window').width * 1,
    },
    searchBarOne: {
        flex: 1
    },
    searchBarTwo: {
        flex: 1
    },
    line: {
        borderBottomWidth: 0.5,
        width: '85%',
        borderColor: 'grey',
        alignSelf: 'center',
        // marginBottom: Dimensions.get('screen').height * 0.01
    }
})

export default DriverRouteOne;