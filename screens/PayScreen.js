import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert } from 'react-native';
import { useStripe, initStripe } from '@stripe/stripe-react-native'
import { useSelector } from 'react-redux'
import CheckInButton from '../components/Buttons/CheckInButton';
import { Ionicons } from '@expo/vector-icons'
import * as Linking from 'expo-linking';




const PayScreen = ({ route, navigation }) => {

  const { liftid, to, from, price, date, time } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const token = useSelector(state => state.authorisation.userToken);
  const [intentID, setIntentID] = useState();


  const fetchPaymentSheetParams = async () => {

    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", token);

    const response = await fetch(`https://spareseat-app.herokuapp.com/payment/checkout/${liftid}`, {
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

  const requestLift = async () => {
    try {
      const status = 'pending'
      const body = { liftid, status, intentID };
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", token);

      const response = await fetch("https://spareseat-app.herokuapp.com/dashboard/Requests/post", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body)
      });

      //send notification here to user who posted the lift



      const parseRes = await response.json()

      return (parseRes)

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
            onPress: () => {
              navigation.navigate('My Lifts')
              navigation.popToTop()
            }
            //once directed to homescreen, add notification in myLifts
          }
        ]
      )
    }
  };

  useEffect(() => {

    initStripe({
      publishableKey: "pk_test_51IxqKxDSswVkzYl6yUdE2l58HEiScXybtxZMFdE3lHxLporfFzSJacB3hGgj79FkQrQHLez6o4BCkAdBSfU448QF00k305f0vp",
      urlScheme: Linking.createURL(''),
      merchantIdentifier: "merchant.com.spareseat"
    }).then(() => {
      initializePaymentSheet();
    })

  }, []);


  //screen was the wrapper here before
  return (

    <View style={styles.container}>
      <Text style={{ fontFamily: 'Inter_Light', fontSize: 27 }}>Lift Summary:</Text>
      <View style={styles.line}></View>

      <View style={{ flexDirection: 'row', height: '40%' }}>
        <View style={{ width: '30%', height: '100%', alignItems: 'flex-end', justifyContent: 'center' }}>
          <View style={{ height: '25%', justifyContent: 'center' }}>
            <Text style={styles.smallText}>Leaving from: </Text>
          </View>

          <View style={{ height: '25%', justifyContent: 'center' }}>
            <Text style={styles.smallText}>Going to: </Text>
          </View>

          <View style={{ height: '25%', justifyContent: 'center' }}>
            <Text style={styles.smallText}>Date: </Text>
          </View>

          <View style={{ height: '25%', justifyContent: 'center' }}>
            <Text style={styles.smallText}>Time: </Text>
          </View>

        </View>
        <View style={{ borderWidth: 0.5, marginHorizontal: '2%', borderColor: 'grey' }}></View>

        <View style={{ width: '70%', height: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>

          <View style={{ height: '25%', justifyContent: 'center' }}>
            <Text style={styles.routeText}>{JSON.parse(from)}</Text>
          </View>

          <View style={{ height: '25%', justifyContent: 'center' }}>
            <Text style={styles.routeText}>{JSON.parse(to)}</Text>
          </View>

          <View style={{ height: '25%', justifyContent: 'center' }}>
            <Text style={styles.routeText}>{date}</Text>
          </View>

          <View style={{ height: '25%', justifyContent: 'center' }}>
            <Text style={styles.routeText}>{time}</Text>
          </View>

        </View>


      </View>

      <View style={styles.priceBox}>
        <Text style={{ fontSize: 28, fontFamily: 'Inter_SemiBold', padding: '2%', color: '#0352A0' }}>£{price}</Text>
        <View style={styles.infoBox}>
          <View style={{ padding: '1.5%' }}>
            <Ionicons name="information-circle-sharp" size={30} color="#D6438C" />
          </View>
          <View>
            <Text style={styles.infoText}>Money will not be taken out of your account unless the driver accepts your request</Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <View style={{ padding: '1.5%' }} >
            <Ionicons name="information-circle-sharp" size={30} color="#D6438C" />
          </View>

          <Text style={styles.infoText} >This request will expire in 7 days</Text>
        </View>
      </View>
      <CheckInButton
        disabled={!loading}
        text="Checkout"
        onPress={openPaymentSheet}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: '3%'
  },
  buttons: {
    flexDirection: 'row'
  },
  priceBox: {
    padding: '2%',
    backgroundColor: 'lightgrey',
    borderWidth: 0.4,
    borderRadius: 10,
    marginVertical: '4%'
  },
  modal: {
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('window').height * 0.2,
    // borderWidth: 7
  },
  flatListView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  routeText: {
    fontFamily: 'Inter_Medium',
    fontSize: 22,
    color: '#0352A0'
  },
  line: {
    borderBottomWidth: 0.5,
    width: Dimensions.get('screen').width * 0.9,
    borderColor: 'grey',
    padding: '1%',
    marginVertical: '1.5%',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '4%',
    width: '90%'
  },
  infoText: {
    fontFamily: 'Inter_Regular',
    fontSize: 15,
  },
  smallText: {
    fontFamily: 'Inter_Light'
  }
});

export default PayScreen;