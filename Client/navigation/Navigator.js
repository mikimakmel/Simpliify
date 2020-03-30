import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/customer/HomeScreen';
import ExploreScreen from '../screens/customer/ExploreScreen';
import ScheduleScreen from '../screens/customer/ScheduleScreen';
import NotificationsScreen from '../screens/customer/NotificationsScreen';
import MenuScreen from '../screens/customer/MenuScreen';
import BusinessScreen from '../screens/customer/BusinessScreen';
import BookingScreen from '../screens/customer/BookingScreen';
import LoginScreen from '../screens/LoginScreen';
import CameraScreen from '../screens/CameraScreen';
import CreditCardScreen from '../screens/CreditCardScreen';
import { AntDesign, EvilIcons, Feather, Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Menu';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Business" component={BusinessScreen} options={{headerShown: true}} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{headerShown: true}} />
    </Stack.Navigator>
  );
}

function LogInStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogIn" component={LoginScreen}/>
    </Stack.Navigator>
  );
}

function creditCardStack({ navigation, route }) {
  // test.setOptions({ tabBarVisible: false })

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Camera" component={CameraScreen}/>
      <Stack.Screen name="Card" component={CreditCardScreen}/>
    </Stack.Navigator>
  );
}

function MenuStack({navigation}) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Menu" component={MenuScreen}/>
      <Stack.Screen name="Scan" component={creditCardStack}/>
    </Stack.Navigator>
  );
}

function ExploreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Explore" component={ExploreScreen} />
    </Stack.Navigator>
  );
}

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName={"Profile"}>
      <Stack.Screen
        name="LogIn"
        component={LogInStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function BottomTabNavigator({ navigation, route }) {

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
        component={ScheduleScreen}
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
            <Ionicons name="ios-menu" size={40} color={color} style={{ paddingTop: 2 }} />
          )
        }}
      />
    </BottomTab.Navigator>
  );
}

