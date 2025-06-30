import LoginScreen from "@/Screens/login";
import IdentityVerificationScreen2 from "@/Screens/Sginup7";
import RoleSelectionScreen from "@/Screens/Signhubhead";
import SignUpScreen from "@/Screens/Signup";
import NextStepScreen from "@/Screens/Signup2";
import ExpertiseSelectionScreen from "@/Screens/Signup3";
import LocationSelectionScreen from "@/Screens/Signup4";
import IdentityVerificationScreen from "@/Screens/Signup5";
import EditProfileScreen from "@/Screens/Singup6";
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
   <Stack.Screen name="role" component={RoleSelectionScreen} />
  <Stack.Screen name="SignUp" component={SignUpScreen} />
  <Stack.Screen name="NextStep" component={NextStepScreen} />
  <Stack.Screen name="ExpertiseSelection" component={ExpertiseSelectionScreen} />
  <Stack.Screen name="LocationSelection" component={LocationSelectionScreen} />
  <Stack.Screen name="IdentityVerification" component={IdentityVerificationScreen} />
  <Stack.Screen name="FinalStep" component={EditProfileScreen} />
  <Stack.Screen name="IdentityVerification2" component={IdentityVerificationScreen2} />
 

  
</Stack.Navigator>
  
  );
}