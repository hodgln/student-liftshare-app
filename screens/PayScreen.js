import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/core';




const PayScreen = ({ route, navigation }) => {
  /*eventually style this so that onPress of the 'book lift' button it expands and 
  unfocusses on the rest of the screen ( like a modal ) with a border around the outside
  for the paycard*/
  const { liftid } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const token = useSelector(state => state.authorisation.userToken);
  const [intentID, setIntentID] = useState()

  const fetchPaymentSheetParams = async () => {

    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", token);

    const response = await fetch(`http://localhost:8081/payment/checkout/${liftid}`, {
      method: "POST",
      headers: myHeaders
    });

    const { paymentIntent, ephemeralKey, customer } = await response.json();

    setIntentID(paymentIntent.id)

    //console.log({paymentIntent, ephemeralKey, customer})

    console.log(`payment intent is ${paymentIntent.id}`)

    return {
      paymentIntent,
      ephemeralKey,
      customer
    };
  };

  const requestLift = async() => {
    try {
        const status = 'pending'
        const body = { liftid, status, intentID };
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        const response = await fetch("http://localhost:8081/dashboard/Requests/post", {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(body)
        });

        //send notification here to user who posted the lift

        const parseRes = await response.json()

        return(parseRes)

    } catch (error) {
        console.log(error.message)
    }
}



  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent.client_secret,
    });

    if (!error) {
      setLoading(true);
    } else {
      console.log(error)
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      const response = await requestLift()
      //Alert.alert(response);
      Alert.alert(
        response.title,
        response.body,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('My Lifts')
            //once directed to homescreen, add notification in myLifts
          }
        ]
      )
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);


  //screen was the wrapper here before
  return (

    <View>
      <Button
        variant="primary"
        disabled={!loading}
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('window').height * 0.2,
    borderRadius: 20,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  buttons: {
    flexDirection: 'row'
  },
  modal: {
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('window').height * 0.2,
    // borderWidth: 7
  },
  flatListView: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default PayScreen;