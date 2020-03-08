import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/customer/HomeScreen';
import ExploreScreen from '../screens/customer/ExploreScreen';
import ScheduleScreen from '../screens/customer/ScheduleScreen';
import BusinessScreen from '../screens/customer/BusinessScreen';
import { AntDesign, EvilIcons, Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Explore';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* <Stack.Screen name="Business" component={BusinessScreen}/> */}
    </Stack.Navigator>
  );
}

// function ScheduleStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Schedule" component={ScheduleScreen} />
//     </Stack.Navigator>
//   );
// }

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

export default function BottomTabNavigator({ navigation, route }) {

  return (
      <BottomTab.Navigator 
        initialRouteName={INITIAL_ROUTE_NAME}
        tabBarOptions={{
          activeTintColor: Colors.red,
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
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={31} color={color} style={{ paddingTop: 5 }} />
          )
        }}
      />
      <BottomTab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => (
            <EvilIcons name="calendar" size={40} color={color} style={{ paddingTop: 5 }} />
          )
        }}
      />
    </BottomTab.Navigator>
  );
}

