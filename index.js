/**
 * @format
 */
import './i18n.config';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

const RNLocalize = require("react-native-localize");
if ('__setDefaultTimeZone' in Intl.DateTimeFormat) {
  Intl.DateTimeFormat.__setDefaultTimeZone(RNLocalize.getTimeZone());
}

// Callback called when notification received by device in background state
messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (__DEV__){
    console.log('Message handled in the background!', remoteMessage);
  }
});

AppRegistry.registerComponent(appName, () => App);

