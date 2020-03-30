import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, AppRegistry } from 'react-native';
import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/customer/HomeScreen';
import ExploreScreen from './screens/customer/ExploreScreen';
import ScheduleScreen from './screens/customer/ScheduleScreen';
import MenuScreen from './screens/customer/MenuScreen';
import LoginScreen from './screens/LoginScreen';
import CameraScreen from './screens/CameraScreen';
import CreditCardScreen from './screens/CreditCardScreen';
import Navigator from './navigation/Navigator';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from "react-redux";
import Store from "./redux/Store";

console.disableYellowBox = true;

export default class App extends Component {
  render() {
    return (
      <Provider store={Store}>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <Navigator />
          {/* <CameraScreen /> */}
          {/* <CreditCardScreen /> */}
        </NavigationContainer>
      </Provider>
    )
  }
}

AppRegistry.registerComponent("Simpliify", () => App);
