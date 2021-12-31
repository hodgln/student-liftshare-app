import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Dimensions, Button } from 'react-native';
import RatingCard from "./Cards/RatingCard";

const DriverRatings = (props) => {

    const { passengers, setIsVisibleRatings, liftshare_id } = props

    const [rated, setRated] = useState([])

    console.log(passengers.passengers[0].destinationname)

    useEffect(() => {
        if(passengers.length === rated.length) {
            console.log(rated)
            setIsVisibleRatings(false)
        }
    }, [rated])

    const renderRatings = ({ item }) => {
        return(
            <View style={{paddingVertical: '3%'}}>
            <RatingCard
            firstname={item.user_firstname}
            user_id={item.user_id}
            picture={item.profile_picture}
            setIsVisibleRatings={setIsVisibleRatings}
            liftshare_id={liftshare_id}
            setRated={setRated}
            />
            </View>
        )
    }

    return (
        <View style={styles.QRmodal}>
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <Text style={{ fontSize: 16, fontFamily: 'Inter_400Regular', }}>Please rate your passengers to </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#0352A0' }}>{JSON.parse(passengers.passengers[0].destinationname)}</Text>
                </View>
            </View>
            
            <FlatList
                style={styles.modal}
                data={passengers.passengers}
                renderItem={renderRatings}
                keyExtractor={item => JSON.stringify(item.request_id)}
            />
            <Button title="close" onPress={() => setIsVisibleRatings(false)}/>
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
        height: Dimensions.get('window').height * 0.5,
        width: Dimensions.get('window').width * 0.88,
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