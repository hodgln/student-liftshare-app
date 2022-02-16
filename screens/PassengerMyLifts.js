import React, { useState, useEffect } from 'react'
import { View, Text, Button, Modal, StyleSheet, Dimensions, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import PassengerRatings from '../components/PassengerRatings';
import { useIsFocused } from '@react-navigation/core';
import PreviewCard from '../components/Cards/PreviewCard';


const PassengerMyLifts = (props) => {

    const token = useSelector(state => state.authorisation.userToken);
    const [displayInfo, setDisplayInfo] = useState();
    const [notRatedDriver, setNotRatedDriver] = useState();
    const [isVisibleRatings, setIsVisibleRatings] = useState()

    const isFocused = useIsFocused()

    const getLiftData = async () => {
        try {
            const response = await fetch(`http://api.spareseat.app/dashboard/passengerlifts`, {
                method: "GET",
                headers: { token: token }
            });



            const parseRes = await response.json();

            setDisplayInfo(parseRes);

        } catch (error) {
            console.log(`error message is: ${error.message}`)
        }
    }


    const checkUnratedDrivers = async () => {
        try {

            const response = await fetch(`http://api.spareseat.app/dashboard/ratings/frompassenger`, {
                method: 'GET',
                headers: { token: token }
            })

            const parseRes = await response.json()

            console.log(parseRes)

            if (parseRes.length !== 0) {
                setNotRatedDriver(parseRes)
                // setNotRatedLiftshare(parseRes.liftID)
                setIsVisibleRatings(true)
            } else {
                return
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const onRefresh = async () => {
        await checkUnratedDrivers()
        getLiftData()

        // check unrated drivers isnt resolving

    }

    useEffect(() => { onRefresh() }, [isFocused === true]);


    //console.log(isFocused)




    const renderPassenger = ({ item }) => {
        return (
            <View style={styles.categoriesContainer}>
                <PreviewCard
                    from={item.originname}
                    to={item.destinationname}
                    date={item.datepicked}
                    firstname={item.user_firstname}
                    surname={item.user_surname}
                    picture={item.profile_picture}
                    status={item.status}
                    requestid={item.request_id}
                    liftid={item.liftshare_id}
                    price={item.passengerprice}
                    phone={item.phone_number}
                    userID={item.user_id}
                    origin={item.originlocation}
                    destination={item.destinationlocation}
                    nextScreen={'Route Details'}
                />
            </View>
        )
    }

    //liftshare ids are being used as keys in somewhere they shouldnt be 

    return (
        // <View style={styles.categoriesContainer}>
        <View>
            <FlatList
                data={displayInfo}
                renderItem={renderPassenger}
                keyExtractor={item => JSON.stringify(item.request_id)}
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
                            <PassengerRatings driver={notRatedDriver} setIsVisibleRatings={setIsVisibleRatings} />
                        </View>

                    </Modal>) : null}
        </View>
    )
};

const styles = StyleSheet.create({
    categoriesContainer: {
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
        shadowOpacity: 0.15,
        padding: '2%'
    },
    centredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 22,
        height: Dimensions.get('window').height * 0.4
    }
})

export default PassengerMyLifts;