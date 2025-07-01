import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RoleSelectionScreen = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigator = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.logoContainer}>
          <AntDesign name="appstore-o" size={50} color="black" />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Join SALA7LI</Text>
          <Text style={styles.subtitle}>
            Discover jobs, and share your resume with 100 million recruiters.
          </Text>
        </View>

        <View style={styles.bubblesContainer}>
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

        <TouchableOpacity style={styles.signInLink} onPress={() => navigator.navigate('Login')}>
          <Text style={styles.signInText}>Already have an account? Sign In</Text>
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedRole === null ? styles.continueButtonInactive : styles.continueButtonActive,
            ]}
            disabled={selectedRole === null}
            activeOpacity={selectedRole === null ? 1 : 0.8}
            onPress={() => {
              navigator.navigate('SignUp', { data: { role: selectedRole } });
            }}
          >
            <Text style={[
              styles.continueButtonText,
              selectedRole === null ? styles.continueButtonTextInactive : styles.continueButtonTextActive,
            ]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    elevation: 3,
  },
  bubbleSelected: {
    backgroundColor: '#E6F0FA',
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
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 2,
  },
  continueButtonInactive: {
    backgroundColor: 'white',
    borderColor: '#0A77FF',
  },
  continueButtonActive: {
    backgroundColor: '#0A77FF',
    borderColor: '#0A77FF',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButtonTextInactive: {
    color: '#0A77FF',
  },
  continueButtonTextActive: {
    color: 'white',
  },
});

export default RoleSelectionScreen;