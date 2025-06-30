import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ExpertiseSelectionScreen = () => {
  const [selectedField, setSelectedField] = useState(null);

  const fields = [
    'Electrician',
    'Electrician',
    'Electrician',
    'Electrician',
    'Electrician',
    'Electrician',
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => {}}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* Titre et sous-titre */}
      <View style={styles.header}>
        <Text style={styles.title}>What Is Your Field Of Expertise ?</Text>
        <Text style={styles.subtitle}>please select your field of expertise (up to 1)</Text>
      </View>

      {/* Field Selection */}
      <View style={styles.fieldsContainer}>
        {fields.map((field, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.fieldItem,
              selectedField === field && styles.fieldItemSelected,
            ]}
            activeOpacity={0.8}
            onPress={() => setSelectedField(field)}
          >
            <View style={styles.checkbox}>
              {selectedField === field && <View style={styles.checkboxChecked} />}
            </View>
            <Text style={styles.fieldText}>{field}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          disabled={selectedField === null}
          activeOpacity={selectedField === null ? 1 : 0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          {/* Add navigation logic here, e.g., navigation.navigate('NextScreen', { field: selectedField }) */}
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
  backButton: {
    padding: 10,
    marginTop: 10,
  },
  backText: {
    fontSize: 20,
    color: '#0A77FF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0A77FF',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
  fieldsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fieldItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // For Android shadow
  },
  fieldItemSelected: {
    backgroundColor: '#E6F0FA', // Light blue background when selected
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: '#0A77FF',
    borderRadius: 2,
  },
  fieldText: {
    fontSize: 16,
    color: '#333',
  },
  bottomContainer: {
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: '#0A77FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',

  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExpertiseSelectionScreen;