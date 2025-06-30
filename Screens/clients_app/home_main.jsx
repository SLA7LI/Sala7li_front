import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Screen components
const HomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Home Screen</Text>
  </View>
);

const ExploreScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Explore Screen</Text>
  </View>
);

const BidScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Bid Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Profile Screen</Text>
  </View>
);

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

export default function Home_main() {
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
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Bid" component={BidScreen} />
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