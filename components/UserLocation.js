import React, { useState } from 'react'
import { View, Button, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Map from '../components/Map';
import { useDispatch } from 'react-redux'

const UserLocation = props => {
    const [fetching, setFetching] = useState(false)
    const [chosenLocation, setChosenLocation] = useState()


    const permissionVerify = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION)
        if (result.status !== 'granted') {
            Alert.alert('Please turn on location to make your lift finding easier', [{ text: 'okay' }])
            return false
        }
        return true
    }

    const getLocation = async (props) => {
        const hasPermission = await permissionVerify()
        if (!hasPermission) {
            return;
        }

        try {
            setFetching(true);
            const location = await Location.getCurrentPositionAsync();
            setChosenLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            });
        } catch (err) {
            Alert.alert('could not obtain location', [{ text: 'okay' }])
        }
        setFetching(false)
        //const locationToSend = chosenLocation
    }

    console.log(`chosen location is ${chosenLocation}`)
    

    return (
        <View>
            <View style={styles.locationButton}>
                <Button onPress={getLocation} title="location" />
            </View>
            <View style={styles.mapPreview}>
                {fetching ? <ActivityIndicator size="large" /> : null}
                {/* <Map locationHandle={chosenLocation}/> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        //borderWidth: 5,
        //borderRadius: 50,
        height: '80%',
        padding: '3%'
    },
    locationButton: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default UserLocation;
