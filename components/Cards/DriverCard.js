import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Avatar } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 



const DriverCard = (props) => {

    const token = useSelector(state => state.authorisation.userToken);

    const navigation = useNavigation()

    const dateFormat = new Date(props.date)

    const [confirmedRequests, setConfirmedRequests] = useState();

    // use this request in the 'requests' section of profileScreen for drivers to decrement the seats on confirmation of the requests
   


    const passengerPrice = async () => {
        try {
            const response = await fetch(`http://localhost:8081/dashboard/passengerprice/${liftshare_id}`, {
                method: "GET",
                headers: { token: token }
            });


            const parseRes = await response.json();

            setConfirmedRequests(parseRes);

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => { passengerPrice() }, [])

    const {
        name,
        originName,
        destinationName,
        distance,
        seats,
        liftshare_id,
        price,
        driver_firstname,
        picture
    } = props



    //console.log(profile_picture)

    const priceHandler = (price) => {
        //console.log(confirmedRequests[0].count);
        return `£${((price / (JSON.parse(confirmedRequests) + 1)) + 0.5).toFixed(2)}`
    }

    return (
        // if seats >= 0 ... use ternary operator

        // only render date if const currentDate = new Date() --> if(currentDate > dateFormat) {return null} else {...}

        <View>
            {seats === 0 ? null : (
                <View style={styles.container}>
                    <View>
                        {/* <Text>{name}</Text> */}
                        <Text style={{ fontSize: 20, fontWeight: '500', padding: '3%' }}>{JSON.parse(originName)} to {JSON.parse(destinationName)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.column}>
                            <Text style={{ fontSize:18, fontWeight: '500', padding: '1%' }}>{moment(dateFormat).format('DD / MM / YYYY')}</Text>
                            <Text style={{ fontSize: 18, fontWeight: '500', padding: '1%' }}>{moment(dateFormat).format('HH:mm')}</Text>
                            <View style={{ flexDirection: 'row', padding: '1%' }}>
                            {Array.from({ length: seats }, (_, index) => <MaterialCommunityIcons name="car-seat" size={25} color={"black"} key={index} />)}
                            </View>
                            {/* three seat icons here */}
                            <Text style={{ fontSize: 22, fontWeight: '700', padding: '2%' }}>{confirmedRequests === undefined ? price : priceHandler(price)}</Text>
                        </View>
                        <View style={styles.verticalLine}></View>
                        <View style={styles.column}>
                            <View >
                                <Avatar
                                    rounded
                                    size='large'
                                    source={{
                                        uri:
                                            picture,
                                    }}
                                />
                            </View>
                            <Text style={{ fontSize: 22, fontWeight: '600', padding: '2%' }}>{driver_firstname}</Text>
                        </View>
                    </View>
                    {/* <Button title="book lift" onPress={} /> */}
                    {/* custom button here  */}
                    <View>
                    <Button title="book lift" onPress={() => navigation.navigate('Payment', { liftid: liftshare_id })} />
                    </View>
                </View>
            )}
        </View>

    )
}

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width * 0.9,
        height: Dimensions.get('window').height * 0.225,
        // flex: 1,
        borderRadius: 30,
        // borderWidth: 0.5,
        alignItems: 'center',
        //justifyContent: 'center',
        marginBottom: 15,
        alignSelf: 'center',
        backgroundColor: 'white',
        //flexDirection: 'row',
        flex: 1
    },
    column: {
        width: '50%',
        alignItems: 'center'
    },
    verticalLine: {
        height: '70%',
        width: 1,
        backgroundColor: '#909090',
        alignSelf: 'center'
    }
})

export default DriverCard;
