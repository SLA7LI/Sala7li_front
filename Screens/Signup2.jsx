import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const NextStepScreen = () => {
  const navigator = useNavigation();
  const route = useRoute();
  const { data: initialData = {} } = route.params || {};
  const [formData, setFormData] = useState({
    phoneNumber: '',
    ...initialData,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your identity</Text>
        <Text style={styles.subtitle}>Helps you discover new people and opportunities</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={24} color="#0A77FF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
          />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            if (formData.role === 'jobber') {
              navigator.navigate('ExpertiseSelection', { data: formData });
            } else {
              navigator.navigate('LocationSelection', { data: formData });
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
  },
  header: {
    marginTop: 50,
    marginBottom: 40,
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
});

export default NextStepScreen;