import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LocationSelectionScreen = () => {
  const navigator = useNavigation();
  const route = useRoute();
  const { data: initialData = {} } = route.params || {};
  const [selectedWilaya, setSelectedWilaya] = useState(initialData.selectedWilaya || null);
  const [selectedBaladiya, setSelectedBaladiya] = useState(initialData.selectedBaladiya || null);

  const wilayas = [
    { id: 1, name: 'Alger' },
    { id: 2, name: 'Oran' },
    { id: 3, name: 'Constantine' },
    { id: 4, name: 'Annaba' },
    { id: 5, name: 'Blida' },
    { id: 6, name: 'Tizi Ouzou' },
    { id: 7, name: 'Bejaia' },
    { id: 8, name: 'Sétif' },
    { id: 9, name: 'Batna' },
    { id: 10, name: 'Djelfa' },
  ];

  const baladiyas = {
    1: ['Alger Centre', 'Sidi Mhamed', 'El Madania', 'Belouizdad'],
    2: ['Oran Centre', 'Es Senia', 'Bir El Djir', 'Aïn El Turk'],
    3: ['Constantine Centre', 'El Khroub', 'Aïn Smara', 'Zighoud Youcef'],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigator.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>What is your wilaya and baladiya?</Text>
          <Text style={styles.subtitle}>Wilaya is the town where you live and baladiya is the town hall where you live</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Sélection de la wilaya */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wilaya</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedWilaya}
              onValueChange={(itemValue) => {
                setSelectedWilaya(itemValue);
                setSelectedBaladiya(null); // Réinitialiser la baladiya quand on change de wilaya
              }}
              style={styles.picker}
              dropdownIconColor="#0A77FF"
            >
              <Picker.Item label="Select your wilaya" value={null} />
              {wilayas.map((wilaya) => (
                <Picker.Item key={wilaya.id} label={wilaya.name} value={wilaya.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Sélection de la baladiya */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Baladiya</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedBaladiya}
              onValueChange={(itemValue) => setSelectedBaladiya(itemValue)}
              style={styles.picker}
              dropdownIconColor="#0A77FF"
              enabled={!!selectedWilaya}
            >
              <Picker.Item 
                label={selectedWilaya ? "Select your baladiya" : "First select a wilaya"} 
                value={null} 
              />
              {selectedWilaya && baladiyas[selectedWilaya]?.map((baladiya, index) => (
                <Picker.Item key={index} label={baladiya} value={baladiya} />
              ))}
            </Picker>
          </View>
        </View>
      </ScrollView>

      {/* Bouton continuer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedWilaya || !selectedBaladiya) 
              ? styles.continueButtonInactive 
              : styles.continueButtonActive
          ]}
          disabled={!selectedWilaya || !selectedBaladiya}
          onPress={() => {
            const updatedData = { ...initialData, selectedWilaya, selectedBaladiya };
            navigator.navigate('IdentityVerification', { data: updatedData });
          }}
        >
          <Text style={[
            styles.continueButtonText,
            (!selectedWilaya || !selectedBaladiya) 
              ? styles.continueButtonTextInactive 
              : styles.continueButtonTextActive
          ]}>
            Continue
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
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  picker: {
    width: '100%',
    color: '#333',
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

export default LocationSelectionScreen;