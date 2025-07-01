import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WorkerHomeScreen from './home';

// Dummy screens
const WorkersScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Workers Screen</Text>
  </View>
);

const WorkerDetailsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Worker Details Screen</Text>
  </View>
);

const WorkersMapScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Explore Screen</Text>
  </View>
);

const AllServiceRequestsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Bid Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Profile Screen</Text>
  </View>
);

// Stack navigator for Home tab
const HomeStack = createStackNavigator();

const HomeScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="WorkerDetails" component={WorkerDetailsScreen} />
  </HomeStack.Navigator>
);

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

export default function Home_main_Worker() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Bid') {
            iconName = focused ? 'hammer' : 'hammer-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5,
          height: 60,
          paddingBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={WorkerHomeScreen} />
      <Tab.Screen name="Explore" component={WorkersMapScreen} />
      <Tab.Screen name="Bid" component={AllServiceRequestsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});