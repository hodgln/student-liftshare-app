import { createStore, combineReducers } from 'redux';
import locationReducer from './store/reducers/locations';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import storage from 'redux-persist/lib/storage'
import authReducer from './store/reducers/authentication';


const rootReducer = combineReducers({
    locations: locationReducer,
    authorisation:  authReducer
  });

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['authorisation'],
    //blacklist: ['locations']
  };

  const pReducer = persistReducer(persistConfig, rootReducer);
  
  export const store = createStore(pReducer);
  export const persistor = persistStore(store);