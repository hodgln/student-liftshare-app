import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Dimensions, Button } from 'react-native';
import RatingCard from "./Cards/RatingCard";

const PassengerRatings = (props) => {

    const { driver, setIsVisibleRatings } = props

    const [rated, setRated] = useState([])

    

    useEffect(() => {
        if (driver.length === rated.length) {
            console.log(rated)
            setIsVisibleRatings(false)
        }
    }, [rated])

    const renderRatings = ({ item }) => {
        return (
            <View style={{ justifyContent: 'center' }}>
                <RatingCard
                    firstname={item.user_firstname}
                    user_id={item.user_id}
                    picture={item.profile_picture}
                    setIsVisibleRatings={setIsVisibleRatings}
                    liftshare_id={driver[0].liftshare_id}
                    setRated={setRated}
                />
            </View>
        )
    }

    return (
        <View style={styles.QRmodal}>
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <Text style={{ fontSize: 17, fontFamily: 'Inter_Regular', }}>Please rate your driver to </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 17, fontFamily: 'Inter_SemiBold', color: '#0352A0' }}>{JSON.parse(driver[0].destinationname)}</Text>
                </View>
            </View>
            <View style={{ marginTop: '30%' }}>

                <FlatList
                    style={styles.modal}
                    data={driver}
                    renderItem={renderRatings}
                    keyExtractor={item => JSON.stringify(item.liftshare_id)}
                />
            </View>
            <Button title="close" onPress={() => setIsVisibleRatings(false)} />
        </View>
    )
}

const styles = StyleSheet.create({
    QRmodal: {
        // margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('window').width * 0.8,
        justifyContent: 'center',
    },
    modal: {
        //width: Dimensions.get('window').width * 0.8,
        //height: Dimensions.get('window').height * 0.2,
        // borderWidth: 7,
        alignSelf: 'center',
    },
})

export default PassengerRatings;