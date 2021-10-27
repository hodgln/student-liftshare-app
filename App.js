import React from 'react'
import { Provider } from 'react-redux';
import RootStack from './navigation/practise'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { StripeProvider } from '@stripe/stripe-react-native';

// const rootReducer = combineReducers({
//   locations: locationReducer,
//   authorisation: persistReducer(persistConfig, authReducer)
// });

// const store = createStore(rootReducer);

// const persistConfig = {
//   key: 'root',
//   storage: storage,
//   whitelist: ['isLoggedIn']
// };

// const persistor = persistStore(store);

export default function App() {
  return (
  <Provider store={store} >
    <PersistGate loading={null} persistor={persistor} >
    <StripeProvider publishableKey="pk_test_51IxqKxDSswVkzYl6yUdE2l58HEiScXybtxZMFdE3lHxLporfFzSJacB3hGgj79FkQrQHLez6o4BCkAdBSfU448QF00k305f0vp">
    <RootStack />
    </StripeProvider>
    </PersistGate>
  </Provider>
  )
};




