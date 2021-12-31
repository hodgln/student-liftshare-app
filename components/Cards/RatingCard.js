import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import RatingButton from '../Buttons/RatingButton';
import { useSelector } from 'react-redux';


const RatingCard = (props) => {

    const { firstname, user_id, picture, setRated, liftshare_id } = props;

    const [rating, setRating] = useState()

    // post rating to the database, user id and rating in body. 

    const token = useSelector(state => state.authorisation.userToken);

    const postRating = async() => {
        try {

            const body = { user_id, rating, liftshare_id }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch("http://192.168.86.99:8081/dashboard/ratings", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const parseRes = await response.json()

            if(parseRes.rows !== 0) {
                setRated(rated => [...rated, true])
            } else {
                Alert.alert("Something went wrong")
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if(rating !== undefined ) {
            postRating()
            console.log("hello")
        }
    }, [rating])

    return (
        <View style={styles.container}>
            <View style={styles.leftColumn}>
                <Avatar
                    rounded
                    size='medium'
                    source={{
                        uri:
                            picture,
                    }}
                />
                <Text style={{ fontSize: 17, fontFamily: 'Inter_600SemiBold', color: '#0352A0' }}>{firstname}</Text>
            </View>
            <View style={styles.verticalLine}></View>
            <View style={styles.rightColumn}>
                <View style={{ flexDirection: 'row' }}>
                    <RatingButton onPress={() => setRating(1)} Styles={rating >= 1} />
                    <RatingButton onPress={() => setRating(2)} Styles={rating >= 2} />
                    <RatingButton onPress={() => setRating(3)} Styles={rating >= 3} />
                    <RatingButton onPress={() => setRating(4)} Styles={rating >= 4} />
                    <RatingButton onPress={() => setRating(5)} Styles={rating >= 5} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: Dimensions.get("screen").width * 0.7
    },
    leftColumn: {
        alignItems: 'center',
        width: '20%'
    },
    rightColumn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%'
    },
    verticalLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#909090',
        //justifyContent: 'center',
        marginHorizontal: '3%'
    },

})

export default RatingCard;