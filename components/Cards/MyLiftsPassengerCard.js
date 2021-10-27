import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { Avatar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons'; 

const MyLiftsPassengerCard = (props) => {

    const token = useSelector(state => state.authorisation.userToken);
    const [disabled, setDisabled] = useState(false);


    const {
        firstname,
        surname,
        phone_number,
        picture
    } = props

    console.log(picture)

    return (
     //(liftStatus === 'pending') ?
     <View style={styles.shadow}>
        <View style={styles.container}>
            <View style={styles.column}>
        <Text style={{ fontWeight: '500', fontSize: 17 }}>{firstname} {surname}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
        <Ionicons name="call-outline" size={20} color="black" />
        <Text style={{ fontSize: 16 }}> {phone_number}</Text>
        </View>
        {/* <Text>passenger rating: 91%</Text> */}
        </View>
        
        <View style={styles.column}>
        <Avatar
          rounded
          size='large'
          source={{
            uri:
              picture,
          }}
        />
        </View>
        </View>
        </View>
        // ) : null

    )
}

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({
    container: {
        // width: Dimensions.get('screen').width * 0.8,
        height: Dimensions.get('window').height * 0.125,
        // flex: 1,
        borderRadius: 20,
        borderWidth: 0.1,
        marginBottom: 15,
        flexDirection: 'row',
        backgroundColor: 'white',
        overflow: 'hidden'
        // justifyContent: 'center'
    },
    column: {
        width: '50%',
        alignItems: 'center',
        padding: '3%',
        justifyContent: 'space-evenly'
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: '1%'
    },
    buttons: {
        flexDirection: 'row'
    }
})

export default MyLiftsPassengerCard;
