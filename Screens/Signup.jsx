import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const SignUpScreen = () => {
  const navigator = useNavigation();
  const route = useRoute();
  const { data: initialData = { role: null } } = route.params || {};
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    ...initialData,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <AntDesign name="appstore-o" size={50} color="black" />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Join sala7li</Text>
        <Text style={styles.subtitle}>Discover jobs, and share your resume with 100 million recruiters</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="#0A77FF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            autoCapitalize="words"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#0A77FF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#0A77FF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#0A77FF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            navigator.navigate('NextStep', { data: formData });
          }}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInContainer} onPress={() => navigator.navigate('Login')}>
          <Text style={styles.signInText}>
            Already have an account?{' '}
            <Text style={styles.signInLink}>Sign In</Text>
          </Text>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 30,
  },
  header: {
    marginBottom: 40,
    marginLeft: 50,
    marginRight: 50,
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
  form: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
    paddingBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: '#0A77FF',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: 'gray',
  },
  signInLink: {
    color: '#0A77FF',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;