import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/customer/HomeScreen';
import ExploreScreen from '../screens/customer/ExploreScreen';
import MyOrdersScreen from '../screens/customer/MyOrdersScreen';
import NotificationsScreen from '../screens/customer/NotificationsScreen';
import MenuScreen from '../screens/customer/MenuScreen';
import BusinessScreen from '../screens/customer/BusinessScreen';
import BookingScreen from '../screens/customer/BookingScreen';
import LoginScreen from '../screens/LoginScreen';
import CameraScreen from '../screens/CameraScreen';
import CreditCardScreen from '../screens/CreditCardScreen';
import SignUpForm from '../screens/user/SignUpForm';
import SplashScreen from '../screens/SplashScreen';
import ResultsList from '../screens/customer/Explore/ResultsList';
import ResultCard from '../screens/customer/Explore/ResultCard';
import { AntDesign, EvilIcons, Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { connect } from "react-redux";

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Home';


function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen 
        name="Business" 
        component={BusinessScreen} 
        // options={{headerShown: true, title: null}}
        options={{
          headerShown: true,
          // title: null,
          // headerLeft: () => (
          //   <MaterialIcons
          //     onPress={() => alert('This is a button!')}
          //     name="keyboard-arrow-left"
          //     size={40} 
          //     color={Colors.red} 
          //     style={{ marginLeft: 1 }}
          //   />
          // ),
        }}
      />
      <Stack.Screen name="Booking" component={BookingScreen} options={{headerShown: true}}/>
    </Stack.Navigator>
  );
}

function LogInStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogIn" component={LoginScreen}/>
      <Stack.Screen name="SplashScreen" component={SplashScreen}/>
    </Stack.Navigator>
  );
}

function creditCardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Camera" component={CameraScreen}/>
      <Stack.Screen name="Card" component={CreditCardScreen}/>
    </Stack.Navigator>
  );
}

function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Menu" component={MenuScreen}/>
      <Stack.Screen name="Scan" component={creditCardStack}/>
      <Stack.Screen name="SignUpForm" component={SignUpForm} options={{headerShown: true}}/>
    </Stack.Navigator>
  );
}

function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Explore" component={ExploreScreen}/>
      <Stack.Screen name="Business" component={BusinessScreen} options={{headerShown: true}}/>
      <Stack.Screen name="Booking" component={BookingScreen} options={{headerShown: true}}/>
    </Stack.Navigator>
  );
}

function CustomerBottomTabNavigator() {
  return (
      <BottomTab.Navigator 
        initialRouteName={INITIAL_ROUTE_NAME}
        tabBarOptions={{
          activeTintColor: Colors.red,
          showLabel: false,
          style: {
            borderTopWidth: 0.8,
          },
        }}
      >
      <BottomTab.Screen
        name="Explore"
        component={ExploreStack}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <EvilIcons name="search" size={40} color={color} style={{ paddingTop: 5 }} />
          )
        }}
      />
      <BottomTab.Screen
        name="Schedule"
        component={MyOrdersScreen}
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => (
            <EvilIcons name="calendar" size={44} color={color} style={{ paddingTop: 7 }} />
          )
        }}
      />
      <BottomTab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
          // tabBarVisible: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={31} color={color} style={{ paddingTop: 2 }} />
          )
        }}
      />
      <BottomTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-notifications-outline" size={36} color={color} style={{ paddingTop: 3 }} />
          )
        }}
      />
      <BottomTab.Screen
        name="Menu"
        component={MenuStack}
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => (
            <Feather name="menu" size={34} color={color} style={{}} />
          )
        }}
      />
    </BottomTab.Navigator>
  );
}

function BusinessBottomTabNavigator() {
  return (
      <BottomTab.Navigator 
        initialRouteName={INITIAL_ROUTE_NAME}
        tabBarOptions={{
          activeTintColor: Colors.red,
          showLabel: false,
          style: {
            borderTopWidth: 0.8,
          },
        }}
      >
      <BottomTab.Screen
        name="Explore"
        component={ExploreStack}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bullseye-arrow" size={40} color={color} style={{ paddingTop: 5 }} />
          )
        }}
      />
      <BottomTab.Screen
        name="Schedule"
        component={MyOrdersScreen}
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => (
            <EvilIcons name="calendar" size={44} color={color} style={{ paddingTop: 7 }} />
          )
        }}
      />
      <BottomTab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={31} color={color} style={{ paddingTop: 2 }} />
          )
        }}
      />
      <BottomTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-notifications-outline" size={36} color={color} style={{ paddingTop: 3 }} />
          )
        }}
      />
      <BottomTab.Screen
        name="Menu"
        component={MenuStack}
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => (
            <Feather name="menu" size={34} color={color} style={{}} />
          )
        }}
      />
    </BottomTab.Navigator>
  );
}

function RootStack(props) {
  if(props.view === 'Customer') {
    return (
      <Stack.Navigator initialRouteName={"LogIn"}>
        <Stack.Screen name="LogIn" component={LogInStack} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={CustomerBottomTabNavigator} options={{ headerShown: false }}/>
      </Stack.Navigator>
    );
  }
  else {
    return (
      <Stack.Navigator initialRouteName={"LogIn"}>
        <Stack.Screen name="LogIn" component={LogInStack} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={BusinessBottomTabNavigator} options={{ headerShown: false }}/>
      </Stack.Navigator>
    );
  }
}

const mapStateToProps = ({ User }) => {
  return {
    view: User.view,
  }
}

export default connect(mapStateToProps)(RootStack);