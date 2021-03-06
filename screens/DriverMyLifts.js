import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import DriverRatings from '../components/DriverRatings';
import PreviewCard from '../components/Cards/PreviewCard';
import driverPriceCalc from '../server/utilities/driverPriceCalc';
import { useIsFocused } from '@react-navigation/core';

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
            const response = await fetch(`https://spareseat-app.herokuapp.com/dashboard/profilelifts`, {
                method: "GET",
                headers: { token: token }
            });


            const parseRes = await response.json();

            return(parseRes)
            
        } catch (error) {
            console.log(error.message)
        }
    }

    const checkIncompleteLifts = async () => {
        try {

            const response = await fetch(`https://spareseat-app.herokuapp.com/dashboard/ratings/fromdriver`, {
                method: 'GET',
                headers: { token: token }
            })

            const parseRes = await response.json()

            return(parseRes)

        } catch (error) {
            console.log(error.message)
        }
    }

    // const onRefresh = async () => {
    //     await getLiftData()
    //     checkIncompleteLifts()

    // }

    //function that asks db for completed lifts, returns liftshare_id and user_ids

    //unfinishedratings = true then launch ratings modal, 

    useEffect(() => {
        let isMounted = true

        Promise.all([
            getLiftData(), checkIncompleteLifts()
        ]).then((data) => {
            if(isMounted) {
            setDisplayInfo(data[0])
            data[1].passengers.length !== 0 ? (
                setNotRatedPassengers(data[1].passengers) &&
                setNotRatedID(data[1].liftshareID) &&
                setIsVisibleRatings(true)
            ) : (
                setIsVisibleRatings(false)
            )
            }
        });

        return () => { isMounted = false };

    }, [isFocused === true, refresh]);



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
            {displayInfo?.length !== 0 ? <FlatList
                style={styles.myLifts}
                data={displayInfo}
                renderItem={renderDriver}
                keyExtractor={item => JSON.stringify(item.liftshare_id)}
            /> : 
            <View style={{ alignItems: 'center'}}>
                 <Text style={styles.textStyle}>Nothing to see here!</Text>
                 <Text style={styles.textStyleTwo}>Please post a lift to get started ???? </Text>
            </View>
           }
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
        height: '100%',
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
    textStyle: {
        fontFamily: 'Inter_Medium',
        fontSize: 17,
        padding: '1%'
    },
    textStyleTwo: {
        fontFamily: 'Inter_Regular',
        fontSize: 15,
        padding: '1%'
    }
});