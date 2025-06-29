import LoginScreen from "@/Screens/login";
import SignUpScreen from "@/Screens/Signup";
import NextStepScreen from "@/Screens/Signup2";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

const Stack = createStackNavigator();

export default function Main() {
  return (
   
 <Stack.Navigator
  initialRouteName="Login"
  screenOptions={{ headerShown: false }}
>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="SignUp" component={SignUpScreen} />
  <Stack.Screen name="NextStep" component={NextStepScreen} />
</Stack.Navigator>
  
  );
}