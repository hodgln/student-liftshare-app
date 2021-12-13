import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import LiftCard from '../components/Cards/LiftCard';
import { useNavigation } from '@react-navigation/core';

const DriverMyLifts = ({ route }) => {

    const [displayInfo, setDisplayInfo] = useState()
    const refresh = route.params
    const token = useSelector(state => state.authorisation.userToken);

    const getLiftData = async () => {
        try {
            const response = await fetch(`http://192.168.1.142:8081/dashboard/profilelifts`, {
                method: "GET",
                headers: { token: token }
            });


            const parseRes = await response.json();

            setDisplayInfo(parseRes);
        } catch (error) {
            console.log(error.message)
        }
    }

    //function that asks db for completed lifts, returns liftshare_id and user_ids

    //unfinishedratings = true then launch ratings modal, 

    useEffect(() => { getLiftData() }, [refresh]);


    const renderDriver = ({ item }) => {
        return (<View>
            <LiftCard
                from={item.originname}
                to={item.destinationname}
                date={item.datepicked}
                seats={item.seats}
                price={item.driverprice}
                id={item.liftshare_id}
            />
        </View>)
    };
    return (
        <View style={styles.categoriesContainer}>
            <FlatList
                style={styles.myLifts}
                data={displayInfo}
                renderItem={renderDriver}
                keyExtractor={item => JSON.stringify(item.liftshare_id)}
            />
        </View>
    )
}

export default DriverMyLifts;

const styles = StyleSheet.create({
    categoriesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,

        height: Dimensions.get('window').height * 0.88,
        width: Dimensions.get('window').width * 1
        // flex: 1
    },
    myLifts: {
        //borderWidth: 4,
        width: Dimensions.get('screen').width * 1,
        height: Dimensions.get('window').height * 0.5,
        shadowOffset: {
            height: 3,
            width: -3
        },
        shadowRadius: 5,
        //shadowColor: 'black',
        shadowOpacity: 0.6,
    },
    
    
});