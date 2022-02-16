import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Dimensions, ProgressViewIOSComponent } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '../navigation/RootNavigation'
import { useSelector, useDispatch } from 'react-redux';
import LogIn from '../screens/LogIn';
import ChoiceScreen from '../screens/ChoiceScreen';
import PassengerRoute from '../screens/PassengerRoute';
import ProfileScreen from '../screens/ProfileScreen'
import PassengerLiftFinder from '../screens/PassengerLiftFinder';
import DriverMyLifts from '../screens/DriverMyLifts';
import PassengerMyLifts from '../screens/PassengerMyLifts';
import { LOGGED_OUT } from '../store/actions/authentication';
import DriverCheckIn from '../screens/DriverCheckIn';
import PayScreen from '../screens/PayScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import SignUpOne from '../screens/SignUpOne';
import SignUpTwo from '../screens/SignUpTwo';
import SignUpThree from '../screens/SignUpThree';
import PasswordResetScreen from '../screens/ResetPassword';
import PassengerRouteDetails from '../screens/PassengerRouteDetails';
import DriverRouteDetails from '../screens/DriverRouteDetails';
import LiftSearchDetails from '../screens/LiftSearchDetails';
import DriverSignUp from '../screens/DriverSignUp';
import DriverRoute from '../screens/DriverRoute';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator()
const RootStack = () => {

  // manage below in state and pass state into ? : function for navigation permissions

  const [signedIn, setSignedIn] = useState(false);
  const [isDriver, setIsDriver] = useState(true);

  // console.log(`signed in is: ${signedIn}`);

  const dispatch = useDispatch()

  const driverOrPassenger = useSelector(state => state.authorisation.userCategory);
  const token = useSelector(state => state.authorisation.userToken);



  const isAuth = async () => {
    try {

      const verify = await fetch("http://api.spareseat.app/auth/verified", {
        method: "GET",
        headers: { token: token }
      });

      const parseRes = await verify.json();

      parseRes === true ? setSignedIn(true) : setSignedIn(false) && dispatch({ type: LOGGED_OUT })

      // console.log(`parse ${parseRes}`)

    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    isAuth()
  })

  // useEffect(() => {if(signedIn === false) {
  //   dispatch({type: LOGGED_OUT})
  // }}, [signedIn]);

  const DriverNavBar = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            let size = 34

            if (route.name === 'Post Route') {
              iconName = focused
                ? 'ios-location'
                : 'ios-location-outline';
            } else if (route.name === 'My Lifts') {
              iconName = focused ? 'ios-car' : 'ios-car-outline';
            } else if (route.name === 'Profile') {
              iconName = focused
                ? 'ios-person-circle'
                : 'ios-person-circle-outline'
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0466c8',
          // tabBarInactiveTintColor: 'white',
          // tabBarInactiveBackgroundColor: '#0466c8',
          // tabBarActiveBackgroundColor: '#0466c8'
        })}
      >
        <Tab.Screen name="Post Route" component={DriverRoute} />
        <Tab.Screen name="My Lifts" component={DriverStackTwo} options={{
          headerShown: false }}/>
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    )
  }

  const PassengerNavBar = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            let size = 34

            if (route.name === 'Post Route') {
              iconName = focused
                ? 'ios-location'
                : 'ios-location-outline';
            } else if (route.name === 'My Lifts') {
              iconName = focused ? 'ios-car' : 'ios-car-outline';
            } else if (route.name === 'Profile') {
              iconName = focused
                ? 'ios-person-circle'
                : 'ios-person-circle-outline'
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0466c8',
          // tabBarInactiveTintColor: 'white',
          // tabBarInactiveBackgroundColor: '#0466c8',
          // tabBarActiveBackgroundColor: '#0466c8'
        })}
      >
        <Tab.Screen name="Post Route" component={PassengerStackOne} options={{
          headerShown: false }}/>
        <Tab.Screen name="My Lifts" component={PassengerStackTwo} options={{
          headerShown: false }}/>
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    )
  }


  const PassengerStackOne = () => {
    return (
      <Stack.Navigator screenOptions={{ headerTitleStyle: {fontFamily: 'Inter_600SemiBold' }}} >
        <Stack.Screen name="Lift Search" component={PassengerRoute} />
        <Stack.Screen name="Choose Driver" component={PassengerLiftFinder} />
        <Stack.Screen name="Lift Details" component={LiftSearchDetails} />
        <Stack.Screen name="Payment" component={PayScreen} />
      </Stack.Navigator>
    )
  }

  const PassengerStackTwo = () => {
    return (
      <Stack.Navigator screenOptions={{ headerTitleStyle: {fontFamily: 'Inter_600SemiBold' }}} >
        <Stack.Screen name="My Lifts" component={PassengerMyLifts} />
        <Stack.Screen name="Route Details" component={PassengerRouteDetails} />
      </Stack.Navigator>
    )
  }

  const DriverStackTwo = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="My Lifts" component={DriverMyLifts} />
        <Stack.Screen name="Route Details" component={DriverRouteDetails} />
        <Stack.Screen name="Check In" component={DriverCheckIn} />
      </Stack.Navigator>
    )
  }

  const DriverStackOne = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="DRouteOne" component={DriverRouteOne} options={{ headerShown: false }} />
        <Stack.Screen name="DRouteTwo" component={DriverRouteTwo} options={{ headerShown: false }} />
      </Stack.Navigator>
    )
  }


  console.log(driverOrPassenger)



  // const commonScreens = {
  //   Choice: ChoiceScreen,
  //   Profile: ProfileScreen,
  //   Chat: ChatScreen
  // };

  const authScreens = {
    Choice: ChoiceScreen,
    LogIn: LogIn,
    SignUpOne: SignUpOne,
    SignUpTwo: SignUpTwo,
    SignUpThree: SignUpThree,
    DriverSignUp: DriverSignUp,
    CScreen: ConfirmationScreen,
    PReset: PasswordResetScreen
  };

  const driverScreens = {
    DScreens: DriverNavBar,
  };

  const passengerScreens = {
    PScreens: PassengerNavBar
  }






  useEffect(() => {
    if (driverOrPassenger === 'driver') {
      setIsDriver(true)
    } else { setIsDriver(false) }
  }, [driverOrPassenger])


  // isloggedin = check token 
  //see https://reactnavigation.org/docs/upgrading-from-4.x
  //if isloggedin = 'driver' then send to driverRoute
  // if isloggedin = 'passenger' send to passengerRoute
  // make async function in other stack and implement ? : logic



  return (
    <NavigationContainer style={styles.container} ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          initialRouteName: "Choice",
          // headerRight: () => signedIn ? <HeaderProfileButton /> : null
          // ,
          headerShown: false

          //headerTitle: signedIn ? null : () => <HeaderButton />
        }}
      >
        {Object.entries({

          //...commonScreens,

          ...(signedIn ? (isDriver ? driverScreens : passengerScreens) : authScreens),
        }).map(([name, component]) => (
          <Stack.Screen name={name} component={component} />
        ))}
        {/* <Tab.Navigator>
        <Tab.Screen name='Home'  component={HomeScreen}/>
      </Tab.Navigator> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerText: {
    // add a fontfamily here
    borderColor: 'black',
    padding: 8,
    borderRadius: 20,
    borderWidth: 4
  }
});