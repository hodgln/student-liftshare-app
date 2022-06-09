import React from 'react'
import { Provider } from 'react-redux';
import RootStack from './navigation/practise'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import * as Sentry from 'sentry-expo';




export default function App() {

  Sentry.init({
    dsn: 'https://f0d7aebb1d034d93b7c4755de0a4d73d@o1257287.ingest.sentry.io/6428130',
    enableInExpoDevelopment: true,
    debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  });

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
    return null
  } else {

    return (
      <Provider store={store} >
        <PersistGate loading={null} persistor={persistor} >
            <RootStack />
        </PersistGate>
      </Provider>
    )
  }
};




