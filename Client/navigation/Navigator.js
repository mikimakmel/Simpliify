import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/customer/HomeScreen';
import ExploreScreen from '../screens/customer/Explore/ExploreScreen';
import MyOrdersScreen from '../screens/customer/MyOrdersScreen';
// import NotificationsScreen from '../screens/customer/NotificationsScreen';
import MenuScreen from '../screens/customer/MenuScreen';
import BusinessScreen from '../screens/customer/BusinessScreen';
import BookingScreen from '../screens/customer/BookingScreen';
import LoginScreen from '../screens/LoginScreen';
import CameraScreen from '../screens/CameraScreen';
import CreditCardScreen from '../screens/CreditCardScreen';
import SignUpForm from '../screens/user/SignUpForm';
import SplashScreen from '../screens/SplashScreen';
// import ResultsList from '../screens/customer/Explore/ResultsList';
import MyBusiness from '../screens/business/MyBusiness';
import CalendarScreen from '../screens/business/CalendarScreen';
import BusinessForm from '../screens/business/BusinessForm';
import Insights from '../screens/business/Insights';
import { AntDesign, EvilIcons, Feather, Ionicons, MaterialIcons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { connect } from "react-redux";

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();
const CUSTOMER_INITIAL_ROUTE_NAME = 'Home';
const BUSINESS_INITIAL_ROUTE_NAME = 'Schedule';

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Business" component={BusinessScreen} options={{headerShown: true, title: null}}/>
      <Stack.Screen name="Booking" component={BookingScreen} options={{headerShown: true}}/>
    </Stack.Navigator>
  );
}

function LogInStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogIn" component={LoginScreen}/>
      <Stack.Screen name="SplashScreen" component={SplashScreen}/>
      <Stack.Screen name="SignUpForm" component={SignUpForm}/>
    </Stack.Navigator>
  );
}

function creditCardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Camera" component={CameraScreen}/>
      <Stack.Screen name="Card" component={CreditCardScreen} options={{headerShown: true}}/>
    </Stack.Navigator>
  );
}

function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Menu" component={MenuScreen}/>
      <Stack.Screen name="Scan" component={creditCardStack}/>
      <Stack.Screen name="SignUpForm" component={SignUpForm} options={{headerShown: true}}/>
      <Stack.Screen name="BusinessForm" component={BusinessForm} options={{headerShown: true, title: 'Create Business'}}/>
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

function ScheduleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Schedule" component={CalendarScreen} options={{title: 'Business Schedule'}}/>
    </Stack.Navigator>
  );
}

function CustomerBottomTabNavigator() {
  return (
      <BottomTab.Navigator 
        initialRouteName={CUSTOMER_INITIAL_ROUTE_NAME}
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
            <EvilIcons name="search" size={42} color={color} style={{}}/>
          )
        }}
      />
      <BottomTab.Screen
        name="Schedule"
        component={MyOrdersScreen}
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => (
            <EvilIcons name="calendar" size={42} color={color} style={{paddingTop: 1}}/>
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
            <EvilIcons name="heart" size={42} color={color} style={{}}/>
          )
        }}
      />
      {/* <BottomTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-notifications-outline" size={36} color={color} style={{ paddingTop: 3 }} />
          )
        }}
      /> */}
      <BottomTab.Screen
        name="Menu"
        component={MenuStack}
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-menu" size={42} color={color} style={{}}/>
          )
        }}
      />
    </BottomTab.Navigator>
  );
}

function BusinessBottomTabNavigator() {
  return (
      <BottomTab.Navigator 
        initialRouteName={BUSINESS_INITIAL_ROUTE_NAME}
        tabBarOptions={{
          activeTintColor: Colors.red,
          showLabel: false,
          style: {
            borderTopWidth: 0.8,
          },
        }}
      >
      <BottomTab.Screen
        name="Insight"
        component={Insights}
        options={{
          title: 'Insight',
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="chart" size={27} color={color} style={{paddingBottom: 4}}/>
          )
        }}
      />
      <BottomTab.Screen
        name="Schedule"
        component={ScheduleStack}
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => (
            <EvilIcons name="calendar" size={42} color={color} style={{}}/>
          )
        }}
      />
      <BottomTab.Screen
        name="Home"
        component={MyBusiness}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={30} color={color} style={{paddingBottom: 4}}/>
          )
        }}
      />
      {/* <BottomTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-notifications-outline" size={36} color={color} style={{ paddingTop: 3 }} />
          )
        }}
      /> */}
      <BottomTab.Screen
        name="Menu"
        component={MenuStack}
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-menu" size={42} color={color} style={{}}/>
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
