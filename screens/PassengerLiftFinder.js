
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { useSelector } from 'react-redux';
import DriverCard from '../components/Cards/DriverCard';


const PassengerLiftFinder = ({ route }) => {

    const { origin, destination } = route.params

    // const passengerOriginLatitude = useSelector(state => state.locations.origin.lat)
    // const passengerOriginLongitude = useSelector(state => state.locations.origin.lng)
    // const passengerDestinationLatitude = useSelector(state => state.locations.destination.lat);
    // const passengerDestinationLongitude = useSelector(state => state.locations.destination.lng)
    const token = useSelector(state => state.authorisation.userToken);

    const originlocation = (`${origin.longitude}, ${origin.latitude}`);
    const destinationlocation = (`${destination.longitude}, ${destination.latitude}`);

    //create button component which goes on each driver card, takes in driver id (user id) and liftshare id from the 'liftFetcher' request 

    //callback function button component onPress calls a put request with logic thats in the database.sql file - it takes in the two id's and implements them into the request



    const [lifts, setLifts] = useState()

    

    const liftFetcher = async () => {
        try {
            // const originlocation = (`${passengerOriginLongitude}, ${passengerOriginLatitude}`)
            //const id = 20

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const body = { originlocation, destinationlocation }
            const response = await fetch(`http://localhost:8081/dashboard/Liftshares/distance`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(body)
            });


            const jsonData = await response.json()


            setLifts(jsonData)
        } catch (error) {
            console.log(error.message)
        }
    }


    




    useEffect(() => { liftFetcher() }, [])

    const renderItem = ({ item }) => {
        // + if moment format date is less than today then return null
        if(item.seats <= 0) {
            return null
        } else {
        return (<View>
            <DriverCard
                name={item.category}
                date={item.datepicked}
                origin={item.originlocation}
                distance={item.distance}
                originName={item.originname}
                destinationName={item.destinationname}
                seats={item.seats}
                price={item.driverprice}
                liftshare_id={item.liftshare_id}
                driver_firstname={item.user_firstname}
                driver_surname={item.user_surname}
                picture={item.profile_picture}
            />
        </View>)
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={lifts}
                renderItem={renderItem}
                keyExtractor={item => JSON.stringify(item.liftshare_id)}
            />
        </View>
    )
}

export default PassengerLiftFinder;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        shadowOffset: {
            height: 3,
            width: -3
        },
        shadowRadius: 5,
        //shadowColor: 'black',
        shadowOpacity: 0.6,
        flex: 1
    }
});