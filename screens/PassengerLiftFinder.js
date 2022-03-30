
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import DriverCard from '../components/Cards/DriverCard';
import PreviewCard from '../components/Cards/PreviewCard';


const PassengerLiftFinder = ({ route, navigation }) => {

    const { origin, destination } = route.params

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
            const response = await fetch(`https://spareseat-app.herokuapp.com/dashboard/Liftshares/distance`, {
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
            console.log(item.passengerprice)
        return (<View style={styles.container}>
            <PreviewCard
                name={item.category}
                date={item.datepicked}
                origin={item.originlocation}
                destination={item.destinationlocation}
                distance={item.distance}
                from={item.originname}
                to={item.destinationname}
                seats={item.seats}
                price={item.passengerprice}
                liftshare_id={item.liftshare_id}
                driver_firstname={item.user_firstname}
                driver_surname={item.user_surname}
                picture={item.profile_picture}
                driver_id={item.user_id}
                nextScreen={'Lift Details'}
            />
        </View>)
        }
    }

    return (     
            <FlatList
                data={lifts}
                renderItem={renderItem}
                keyExtractor={item => JSON.stringify(item.liftshare_id)}
            />
    )
}

export default PassengerLiftFinder;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        //flex: 1, 
        width: Dimensions.get('screen').width * 1,
        shadowOffset: {
            height: 3,
            width: -3
        },
        shadowRadius: 2,
        //shadowColor: 'black',
        shadowOpacity: 0.15
    }
});