import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/core';
import DriverRatings from '../components/DriverRatings';
import PreviewCard from '../components/Cards/PreviewCard';
import driverPriceCalc from '../server/utilities/driverPriceCalc';

const DriverMyLifts = ({ route, navigation }) => {

    const [displayInfo, setDisplayInfo] = useState()
    const [isVisibleRatings, setIsVisibleRatings] = useState(false)
    const [notRatedPassengers, setNotRatedPassengers] = useState()
    const [notRatedID, setNotRatedID] = useState()
    const refresh = route.params
    const isFocused = useIsFocused()
    const token = useSelector(state => state.authorisation.userToken);

    const getLiftData = async () => {
        try {
            const response = await fetch(`http://api.spareseat.app/dashboard/profilelifts`, {
                method: "GET",
                headers: { token: token }
            });


            const parseRes = await response.json();

            setDisplayInfo(parseRes);
        } catch (error) {
            console.log(error.message)
        }
    }

    const checkIncompleteLifts = async () => {
        try {

            const response = await fetch(`http://api.spareseat.app/dashboard/ratings/fromdriver`, {
                method: 'GET',
                headers: { token: token }
            })

            const parseRes = await response.json()

            // console.log(parseRes)


            if (parseRes.passengers.length !== 0) {
                setNotRatedPassengers(parseRes.passengers)
                setNotRatedID(parseRes.liftshareID)
                // setNotRatedLiftshare(parseRes.liftID)
                setIsVisibleRatings(true)

                // console.log(parseRes.userIDs)
            } else {
                setIsVisibleRatings(false)
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const onRefresh = async () => {
        await getLiftData()
        checkIncompleteLifts()

    }

    //function that asks db for completed lifts, returns liftshare_id and user_ids

    //unfinishedratings = true then launch ratings modal, 

    useEffect(() => {
        onRefresh()
    }, [isFocused, refresh]);


    const renderDriver = ({ item }) => {

        const priceDiv = +item.seats + +item.passengers 

        const price = driverPriceCalc(item.driverprice, priceDiv)

        return (<View>
            
            <PreviewCard
                from={item.originname}
                to={item.destinationname}
                origin={item.originlocation}
                destination={item.destinationlocation}
                date={item.datepicked}
                seats={item.seats}
                price={item.driverprice}
                displayPrice={price}
                id={item.liftshare_id}
                navigation={navigation}
                nextScreen={'Route Details'}
            />
            {/* <LiftCard
                from={item.originname}
                to={item.destinationname}
                date={item.datepicked}
                seats={item.seats}
                price={item.driverprice}
                id={item.liftshare_id}
            /> */}
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
            {
                isVisibleRatings ?

                    (<Modal animationType="slide"
                        transparent={true}
                        visible={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.")
                        }}>
                        <View style={styles.centredView}>
                            <DriverRatings passengers={notRatedPassengers} setIsVisibleRatings={setIsVisibleRatings} liftshare_id={notRatedID} />
                        </View>

                    </Modal>) : null}
        </View>
    )
}

export default DriverMyLifts;

const styles = StyleSheet.create({
    categoriesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        // padding: 20,
        height: Dimensions.get('window').height * 0.88,
        width: Dimensions.get('window').width * 1,
        // flex: 1
    },
    centredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 22,
        height: Dimensions.get('window').height * 0.7
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