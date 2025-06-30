import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const RoleSelectionScreen = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigator = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <AntDesign name="appstore-o" size={50} color="black" />
      </View>

      {/* Titre et sous-titre */}
      <View style={styles.header}>
        <Text style={styles.title}>Join SALA7LI</Text>
        <Text style={styles.subtitle}>
          Discover jobs, and share your resume with 100 million recruiters.
        </Text>
      </View>

      {/* Role Selection Bubbles */}
      <View style={styles.bubblesContainer}>
        {/* Jobber Bubble */}
        <TouchableOpacity
          style={[
            styles.bubble,
            selectedRole === 'jobber' && styles.bubbleSelected,
            selectedRole === 'jobber' && styles.bubbleJobber,
          ]}
          activeOpacity={0.8}
          onPress={() => setSelectedRole('jobber')}
        >
          <Text style={styles.bubbleTitle}>Register As A Jobber</Text>
          <Text style={styles.bubbleSubtitle}>I want to find a job.</Text>
        </TouchableOpacity>

        {/* Client Bubble */}
        <TouchableOpacity
          style={[
            styles.bubble,
            selectedRole === 'client' && styles.bubbleSelected,
            selectedRole === 'client' && styles.bubbleJobber,
          ]}
          activeOpacity={0.8}
          onPress={() => setSelectedRole('client')}
        >
          <Text style={styles.bubbleTitle}>Register As A Client</Text>
          <Text style={styles.bubbleSubtitle}>I want to find someone to fix my problem.</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Link */}
      <TouchableOpacity style={styles.signInLink}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          disabled={selectedRole === null}
          activeOpacity={selectedRole === null ? 1 : 0.8}
          onPress={() => {
            const initialData = { role: selectedRole };
            if (selectedRole === 'jobber') {
              navigator.navigate('SignUp', { data: initialData });
            } else {
              navigator.navigate('NextStep', { data: initialData });
            }
          }}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: '#0A77FF',
    borderRadius: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginRight: 20,
    marginLeft: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
  bubblesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  bubble: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  bubbleSelected: {
    backgroundColor: '#E6F0FA', // Light blue background when selected
    borderColor: '#0A77FF',
  },
  bubbleJobber: {
    borderWidth: 2,
    borderColor: '#0A77FF',
  },
  bubbleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  bubbleSubtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
  signInLink: {
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    fontSize: 14,
    color: 'gray',
    textDecorationLine: 'underline',
  },
  bottomContainer: {
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: '#0A77FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoleSelectionScreen;