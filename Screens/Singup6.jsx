import { registerAsClient, registerAsWorker } from '@/api/regester';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const FinalStepScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { data: initialData = {} } = route.params || {};
  const [profile, setProfile] = useState({
    name: initialData.fullName || '',
    email: initialData.email || '',
    password: initialData.password || '',
    phone: initialData.phoneNumber || '',
    wilaya: initialData.wilaya || '',
    baladia: initialData.baladia || '',
    genre: initialData.selectedFields ? initialData.selectedFields[0] : '',
    idCard: initialData.idCard || '',
    freelancerCard: initialData.freelancerCard || '',
    role: initialData.role || '',
  });
  const [editableBio, setEditableBio] = useState(initialData.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!profile.name || !profile.email || !profile.password || !profile.phone || !profile.wilaya || !profile.baladia || (!profile.genre && profile.role === 'jobber')) {
      Alert.alert('Error', 'Please ensure all required fields are filled');
      return;
    }

    setLoading(true);

    const registrationData = {
      name: profile.name,
      email: profile.email,
      password: profile.password,
      phone: profile.phone,
      wilaya: profile.wilaya,
      baladia: profile.baladia,
      ...(profile.role === 'jobber' && { genre: profile.genre }),
    };

    try {
      let response;
      if (profile.role === 'jobber') {
        response = await registerAsWorker(registrationData);
      } else {
        response = await registerAsClient(registrationData);
      }
      
      await AsyncStorage.setItem('accessToken', response.accessToken);
      Alert.alert('Registration Successful', 'Your profile has been created successfully.');
      
      if (profile.role === 'jobber') {
        navigation.navigate('WorkerHome');
      } else {
        navigation.navigate('ClientHome');
      }
    } catch (error) {
      console.error('Registration failed:', error.message);
      Alert.alert('Registration Failed', error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Edit Profile</Text>
            <Text style={styles.subtitle}>Update your personal information</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.profilePictureContainer}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} 
              style={styles.profilePicture}
            />
            <TouchableOpacity style={styles.editPictureButton}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{profile.name}</Text>
            </View>

            <Text style={styles.infoLabel}>Email</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{profile.email}</Text>
            </View>

            <Text style={styles.infoLabel}>Phone Number</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{profile.phone}</Text>
            </View>

            <Text style={styles.infoLabel}>Wilaya</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{profile.wilaya}</Text>
            </View>

            <Text style={styles.infoLabel}>Baladiya</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{profile.baladia}</Text>
            </View>

            {profile.role === 'jobber' && (
              <>
                <Text style={styles.infoLabel}>Field of Expertise</Text>
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>{profile.genre}</Text>
                </View>
              </>
            )}

            {profile.role === 'jobber' && (
              <>
                <Text style={styles.infoLabel}>About You</Text>
                <TextInput
                  style={[styles.infoBox, styles.bioInput]}
                  multiline
                  numberOfLines={4}
                  value={editableBio}
                  onChangeText={setEditableBio}
                  placeholder="Tell us about yourself and your experience..."
                  placeholderTextColor="#999"
                />
              </>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
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
    marginBottom: 20,
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
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#0A77FF',
  },
  editPictureButton: {
    position: 'absolute',
    right: 100,
    bottom: 0,
    backgroundColor: '#0A77FF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    marginLeft: 5,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
    backgroundColor: 'white',
    borderColor: '#0A77FF',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  saveButton: {
    backgroundColor: '#0A77FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FinalStepScreen;