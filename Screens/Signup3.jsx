import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ExpertiseSelectionScreen = () => {
  const [selectedFields, setSelectedFields] = useState([]);

  const fields = [
    'Electrician',
    'Plumber',
    'Carpenter',
    'HVAC Technician',
    'Welder',
    'Painter',
    'Mason',
    'Roofer',
    'Landscaper',
    'Solar Installer',
    'Appliance Repair',
    'Handyman'
  ];

  const toggleField = (field) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(item => item !== field));
    } else {
      if (selectedFields.length < 1) {
        setSelectedFields([...selectedFields, field]);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => {}}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>What Is Your Field Of Expertise?</Text>
          <Text style={styles.subtitle}>Please select your field of expertise (up to 1)</Text>
        </View>
      </View>

      {/* Liste scrollable des expertises */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {fields.map((field, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.fieldItem,
              selectedFields.includes(field) && styles.fieldItemSelected,
            ]}
            activeOpacity={0.7}
            onPress={() => toggleField(field)}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedFields.includes(field) && styles.checkboxSelected
              ]}>
                {selectedFields.includes(field) && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </View>
            </View>
            <Text style={styles.fieldText}>{field}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bouton continuer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedFields.length === 0 
              ? styles.continueButtonInactive 
              : styles.continueButtonActive
          ]}
          disabled={selectedFields.length === 0}
        >
          <Text style={[
            styles.continueButtonText,
            selectedFields.length === 0 
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

    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fieldItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldItemSelected: {
    backgroundColor: '#F0F7FF',
    borderColor: '#0A77FF',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#0A77FF',
    borderColor: '#0A77FF',
  },
  checkIcon: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fieldText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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

export default ExpertiseSelectionScreen;