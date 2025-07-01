import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Service_client from '../api/client_service';

const { width, height } = Dimensions.get('window');

const CreateServiceRequestModal = ({ visible, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    category: 'Plumber',
    description: '',
    budget: '',
    urgency: 'normal',
    latitude: 36.7538, // Alger par défaut
    longitude: 3.0588,
  });
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const categories = [
    'Plumber',
    'Electrician',
    'Carpenter',
    'Painter',
    'Mechanic',
    'Cleaner',
    'Gardener',
  ];

  const urgencyLevels = [
    { label: 'urgent', value: 'urgent' },
    { label: 'normal', value: 'normal' },
      { label: 'normal', value: 'normal' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setFormData(prev => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const validateForm = () => {
    if (!formData.category) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }
    if (!formData.budget || isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const requestData = {
        category: formData.category,
        description: formData.description.trim(),
        status: 'open',
        budget: parseFloat(formData.budget),
        urgency: formData.urgency,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      await Service_client.createServiceRequest(requestData);
      
      Alert.alert(
        'Success',
        'Service request created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess && onSuccess();
              handleClose();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating service request:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create service request'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      category: 'Plumber',
      description: '',
      budget: '',
      urgency: 'normal',
      latitude: 36.7538,
      longitude: 3.0588,
    });
    setShowMap(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Service Request</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Category Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
                style={styles.picker}
              >
                {categories.map((category) => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe your service request in detail..."
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Budget */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Budget (DA)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your budget"
              value={formData.budget}
              onChangeText={(value) => handleInputChange('budget', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Urgency */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Urgency</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.urgency}
                onValueChange={(value) => handleInputChange('urgency', value)}
                style={styles.picker}
              >
                {urgencyLevels.map((level) => (
                  <Picker.Item key={level.value} label={level.label} value={level.value} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.formGroup}>
            <View style={styles.locationHeader}>
              <Text style={styles.label}>Location</Text>
              <TouchableOpacity
                style={styles.mapToggleButton}
                onPress={() => setShowMap(!showMap)}
              >
                <Text style={styles.mapToggleText}>
                  {showMap ? 'Hide Map' : 'Select on Map'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinatesText}>
                📍 Lat: {formData.latitude.toFixed(4)}, Lng: {formData.longitude.toFixed(4)}
              </Text>
            </View>

            {showMap && (
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: 36.7538,
                    longitude: 3.0588,
                    latitudeDelta: 5.0,
                    longitudeDelta: 5.0,
                  }}
                  onPress={handleMapPress}
                >
                  <Marker
                    coordinate={{
                      latitude: formData.latitude,
                      longitude: formData.longitude,
                    }}
                    title="Selected Location"
                    description="Tap on the map to change location"
                  />
                </MapView>
                <Text style={styles.mapInstruction}>
                  Tap anywhere on the map to select your location
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Create Service Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formGroup: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1D1D1F',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textArea: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1D1D1F',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minHeight: 100,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapToggleButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mapToggleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  coordinatesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 12,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  mapContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  map: {
    width: '100%',
    height: 250,
  },
  mapInstruction: {
    padding: 12,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    backgroundColor: '#F8F9FA',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#8E8E93',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateServiceRequestModal;