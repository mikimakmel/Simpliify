import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, AppRegistry, SafeAreaView } from 'react-native';
import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/customer/HomeScreen';
import ExploreScreen from './screens/customer/ExploreScreen';
import ScheduleScreen from './screens/customer/ScheduleScreen';
import MenuScreen from './screens/customer/MenuScreen';
import LoginScreen from './screens/LoginScreen';
import CameraScreen from './screens/CameraScreen';
import SignUpForm from './screens/user/SignUpForm';
import BusinessForm from './screens/business/BusinessForm';
import CreditCardScreen from './screens/CreditCardScreen';
import Navigator from './navigation/Navigator';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from "react-redux";
import Store from "./redux/Store";

console.disableYellowBox = true;

export default class App extends Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Provider store={Store}>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            {/* <Navigator /> */}
            <BusinessForm />
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    )
  }
}

AppRegistry.registerComponent("Simpliify", () => App);
