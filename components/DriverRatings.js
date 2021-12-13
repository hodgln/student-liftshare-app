import React from "react";
import { Text, View, StyleSheet, FlatList, Dimensions } from 'react-native';
import RatingCard from "./Cards/RatingCard";

const DriverRatings = (props) => {

    const { passengers, setIsVisibleRatings } = props

    const renderRatings = ({ item }) => {
        return(
            <RatingCard
            firstname={item.user_firstname}
            user_id={item.user_id}
            picture={item.profile_picture}
            setIsVisibleRatings={setIsVisibleRatings}
            />
        )
    }

    return (
        <View style={styles.QRmodal}>
            <FlatList
                style={styles.modal}
                data={passengers}
                renderItem={renderRatings}
                keyExtractor={item => JSON.stringify(item.request_id)}
            />
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

export default DriverRatings;