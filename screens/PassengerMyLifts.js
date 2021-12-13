import React, { useState, useEffect } from 'react'
import { View, Text, Button, Modal, StyleSheet, Dimensions, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import PassengerCard from '../components/Cards/PassengerCard';
import { useIsFocused } from '@react-navigation/core';


const PassengerMyLifts = () => {

    const token = useSelector(state => state.authorisation.userToken);
    const [displayInfo, setDisplayInfo] = useState()
    const [cancelled, setCancelled] = useState(false);

    const isFocused = useIsFocused()

const getLiftData = async () => {
    try {
        const response = await fetch(`http://192.168.1.142:8081/dashboard/passengerlifts`, {
            method: "GET",
            headers: {token: token}
        });

        console.log("refreshed!!")

        const parseRes = await response.json();

        setDisplayInfo(parseRes);

        setCancelled(false)
        
    } catch (error) {
        console.log(`error message is: ${error.message}`)
    }
}

useEffect(() => { getLiftData() }, [isFocused, cancelled]);


//console.log(isFocused)


const renderPassenger = ({ item }) => {
        return(
            <View style={styles.categoriesContainer}>
            <PassengerCard 
            from={item.originname}
            to={item.destinationname}
            date={item.datepicked}
            firstname={item.user_firstname}
            surname={item.user_surname}
            picture={item.profile_picture}
            status={item.status}
            requestid={item.request_id}
            liftid={item.liftshare_id}
            price={item.driverprice}
            phone={item.phone_number}
            isFocused={isFocused}
            setCancelled={setCancelled}
            userID={item.user_id}
            origin={item.originlocation}
            destination={item.destinationlocation}
            />
            </View>
        )
}

//liftshare ids are being used as keys in somewhere they shouldnt be 

return(
                // <View style={styles.categoriesContainer}>
                    <FlatList
                        data={displayInfo}
                        renderItem={renderPassenger}
                        keyExtractor={item => JSON.stringify(item.request_id)}
                        horizontal={true}
                    />
                // </View>
                )
};

const styles = StyleSheet.create({
    categoriesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        //flex: 1, 
        width: Dimensions.get('screen').width * 1,
        // shadowOffset: {
        //     height: 3,
        //     width: -3
        // },
        // shadowRadius: 2,
        // //shadowColor: 'black',
        // shadowOpacity: 0.15,
        padding: '2%'
    }
})

export default PassengerMyLifts;