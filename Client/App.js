import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, AppRegistry, SafeAreaView } from 'react-native';
// import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/customer/HomeScreen';
import ExploreScreen from './screens/customer/Explore/ExploreScreen';
import MyOrdersScreen from './screens/customer/MyOrdersScreen';
import MenuScreen from './screens/customer/MenuScreen';
import LoginScreen from './screens/LoginScreen';
import CameraScreen from './screens/CameraScreen';
import SignUpForm from './screens/user/SignUpForm';
import BusinessForm from './screens/business/BusinessForm';
import Insights from './screens/business/Insights';
import CreditCardScreen from './screens/CreditCardScreen';
import SplashScreen from './screens/SplashScreen';
import Navigator from './navigation/Navigator';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from "react-redux";
import Store from "./redux/Store";

console.disableYellowBox = true;
console.warn = () => {};

export default class App extends Component {
  render() {
    return (
      <Provider store={Store}>
        <NavigationContainer>
          <Navigator/>
        </NavigationContainer>
      </Provider>
    );
  }
}

AppRegistry.registerComponent("Simpliify", () => App);
