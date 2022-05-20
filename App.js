import React from 'react'
import { Provider } from 'react-redux';
import RootStack from './navigation/practise'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { StripeProvider } from '@stripe/stripe-react-native';
// import {
//   useFonts,
//   Inter_100Thin,
//   Inter_200ExtraLight,
//   Inter_300Light,
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_600SemiBold,
//   Inter_700Bold,
//   Inter_800ExtraBold,
//   Inter_900Black,
// } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';



export default function App() {

  Notifications.setNotificationHandler({
    handleNotification: async () => {
      return { shouldShowAlert: true }
    }
  })

  let [loaded] = 
    useFonts({
      Inter_Bold: require('./assets/Inter/Inter-Bold.otf'),
      Inter_Medium: require('./assets/Inter/Inter-Medium.otf'),
      Inter_Regular: require('./assets/Inter/Inter-Regular.otf'),
      Inter_Thin: require('./assets/Inter/Inter-Thin.otf'),
      Inter_SemiBold: require('./assets/Inter/Inter-SemiBold.otf'),
      Inter_Light: require('./assets/Inter/Inter-Light.otf'),
      Inter_ExtraLight: require('./assets/Inter/Inter-ExtraLight.otf'),
      Inter_ExtraBold: require('./assets/Inter/Inter-ExtraBold.otf')
    })
  
  

  if (!loaded) {
    return <AppLoading />
  } else {

    return (
      <Provider store={store} >
        <PersistGate loading={null} persistor={persistor} >
          <StripeProvider publishableKey="pk_test_51IxqKxDSswVkzYl6yUdE2l58HEiScXybtxZMFdE3lHxLporfFzSJacB3hGgj79FkQrQHLez6o4BCkAdBSfU448QF00k305f0vp" 
          urlScheme={Constants.appOwnership === 'expo'
            ? Linking.createURL('/--/')
            : Linking.createURL('')
            }>
            <RootStack />
          </StripeProvider>
        </PersistGate>
      </Provider>
    )
  }
};




