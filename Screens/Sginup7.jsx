import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const IdentityVerificationScreen2 = () => {
  const navigator = useNavigation();
  const route = useRoute();
  const { data: initialData = {} } = route.params || {};
  const [idCard, setIdCard] = useState(initialData.idCard || null);

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'id') {
        setIdCard(result.assets[0].uri);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigator.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Who are you?</Text>
            <Text style={styles.subtitle}>Select your ID card scan</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ID Card</Text>
            <TouchableOpacity 
              style={styles.uploadBox}
              onPress={() => pickImage('id')}
            >
              {idCard ? (
                <Image source={{ uri: idCard }} style={styles.imagePreview} />
              ) : (
                <View style={styles.uploadContent}>
                  <Ionicons name="cloud-upload" size={40} color="#0A77FF" />
                  <Text style={styles.uploadText}>Tap to upload ID card</Text>
                  <Text style={styles.uploadHint}>Front side only</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !idCard ? styles.continueButtonInactive : styles.continueButtonActive
            ]}
            disabled={!idCard}
            onPress={() => {
              const updatedData = { ...initialData, idCard };
              navigator.navigate('FinalStep', { data: updatedData });
            }}
          >
            <Text style={[
              styles.continueButtonText,
              !idCard ? styles.continueButtonTextInactive : styles.continueButtonTextActive
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
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    fontSize: 24,
    color: '#0A77FF',
    fontWeight: 'bold',
  },
  headerTextContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A77FF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  uploadBox: {
    height: 200,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    overflow: 'hidden',
  },
  uploadContent: {
    alignItems: 'center',
    padding: 20,
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  uploadHint: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: '#F0F0F0',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  continueButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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

export default IdentityVerificationScreen2;