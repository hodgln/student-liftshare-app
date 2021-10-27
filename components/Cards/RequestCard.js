import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { Avatar } from 'react-native-elements';

const RequestCard = (props) => {

    const token = useSelector(state => state.authorisation.userToken);
    const [disabled, setDisabled] = useState(false);
    

const {
    firstname,
    surname,
    id,
    request_id,
    picture
} = props

    const bookLift = async () => {
        try {
            

            // const myHeaders = new Headers();
            // myHeaders.append("Content-Type", "application/json");
            // myHeaders.append("token", token);

            const response = await fetch(`http://localhost:8081/dashboard/seats/${id}`, {
                method: "PUT",
                headers: {token: token}
            });

            const reqParseRes = await response.json()

            setDisabled(true)

            console.log(reqParseRes)
            //     '',
            //     [
            //       {text: 'OK', onPress: () => navigation.navigate('Home')},
            //     ],
            //     {cancelable: false},
            //   );
        } catch (error) {
            console.log(error.message)
        }
        
    }

    const statusHandler = async(status) => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);
            const body = { status, request_id }

            const response = await fetch("http://localhost:8081/dashboard/handlestatus", {
                method: "PUT",
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const statusParseRes = await response.json()

            console.log(statusParseRes);

            setDisabled(true)

        } catch (error) {
            console.log(error.message)
        }
    }

    

    const acceptOnPress = () => {
        bookLift()
        statusHandler('confirmed')
    }

return (
     //(liftStatus === 'pending') ?
     <View style={styles.shadow}>
        <View style={styles.container}>
            <View style={styles.leftColumn}>
        <Text style={{ fontSize: 17, fontWeight: '600', marginBottom: 10}}>{firstname}</Text>
        <Text>rating:</Text>
        <Text style={{ fontSize: 25, fontWeight: '700'}}>91%</Text>
        </View>
        <View style={styles.avatar}>
        <Avatar
          rounded
          size='large'
          source={{
            uri:
              picture,
          }}
        />
        </View>
        <View style={styles.buttons}>
        <Button title="accept" onPress={acceptOnPress} disabled={disabled}/>
        <Button title="decline" onPress={() => statusHandler('declined')} disabled={disabled}/>
        </View>
        </View>
        </View>
        // ) : null

)
}

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({
container: {
    //width: Dimensions.get('screen').width * 0.8,
    // height: Dimensions.get('window').height * 0.125,
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'white',
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
    padding: '3%',
    justifyContent: 'space-evenly'
},
buttons: {
    // flexDirection: 'row'
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
leftColumn: {
    alignItems: 'center'
},
avatar: {
    padding: '10%'
}
})

export default RequestCard;
