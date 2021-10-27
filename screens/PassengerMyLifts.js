import React, { useState, useEffect } from 'react'
import { View, Text, Button, Modal, StyleSheet, Dimensions, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import PassengerCard from '../components/Cards/PassengerCard';


const PassengerMyLifts = ({ route }) => {

    const token = useSelector(state => state.authorisation.userToken);
    const [displayInfo, setDisplayInfo] = useState()
    
    const refresh  = route.params

    // console.log(refresh)

const getLiftData = async () => {
    try {
        const response = await fetch(`http://localhost:8081/dashboard/passengerlifts`, {
            method: "GET",
            headers: {token: token}
        });


        const parseRes = await response.json();

        setDisplayInfo(parseRes);

        
    } catch (error) {
        console.log(`error message is: ${error.message}`)
    }
}

useEffect(() => { getLiftData() }, [refresh]);




const renderPassenger = ({ item }) => {
        return(<View>
            <PassengerCard 
            from={item.originname}
            to={item.destinationname}
            date={item.datepicked}
            firstname={item.user_firstname}
            surname={item.user_surname}
            picture={item.profile_picture}
            status={item.status}
            id={item.request_id}
            liftid={item.liftshare_id}
            price={item.driverprice}
            phone={item.phone_number}
            />
        </View>)
    
}

//liftshare ids are being used as keys in somewhere they shouldnt be 

return(
                <View style={styles.categoriesContainer}>
                    <FlatList
                        data={displayInfo}
                        renderItem={renderPassenger}
                        keyExtractor={item => JSON.stringify(item.request_id)}
                    />
                </View>)

};

const styles = StyleSheet.create({
    categoriesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        shadowOffset: {
            height: 3,
            width: -3
        },
        shadowRadius: 5,
        //shadowColor: 'black',
        shadowOpacity: 0.6,
        padding: '2%'
    }
})

export default PassengerMyLifts;