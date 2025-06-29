import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Heatmap } from 'react-native-maps';

// Sample job offer data (latitude, longitude, weight)
const jobData = [
  { latitude: 36.7538, longitude: 3.0588, weight: 10 }, // Algiers
  { latitude: 35.6961, longitude: -0.6349, weight: 8 }, // Oran
  { latitude: 36.3650, longitude: 6.6147, weight: 5 }, // Constantine
  { latitude: 36.7372, longitude: 5.0761, weight: 4 }, // Jijel
  { latitude: 33.8840, longitude: 2.8973, weight: 3 }, // Laghouat
  { latitude: 36.4621, longitude: 2.8277, weight: 6 }, // Blida
  { latitude: 35.5559, longitude: 6.1800, weight: 7 }, // Batna
  { latitude: 36.1911, longitude: 5.4118, weight: 5 }, // Sétif
  { latitude: 36.9075, longitude: 7.7431, weight: 4 }, // Annaba
  { latitude: 35.4073, longitude: 8.1154, weight: 3 }, // Tébessa
];

const JobHeatmapScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Titre */}
      <View style={styles.header}>
        <Text style={styles.title}>Job Offers Heatmap</Text>
      </View>

      {/* Heatmap */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 28.0339, // Center of Algeria
            longitude: 1.6596,
            latitudeDelta: 10, // Zoom level for Algeria
            longitudeDelta: 10,
          }}
          region={{
            latitude: 28.0339,
            longitude: 1.6596,
            latitudeDelta: 10,
            longitudeDelta: 10,
          }}
          minZoomLevel={4} // Prevent zooming out too far
          maxZoomLevel={15} // Allow reasonable zoom-in
          provider="google" // Use Google Maps for better heatmap support
        >
          <Heatmap
            points={jobData}
            opacity={0.7}
            radius={50}
            gradient={{
              colors: ['#00FF00', '#FFFF00', '#FF0000'],
              startPoints: [0.1, 0.5, 0.9],
              colorMapSize: 256,
            }}
          />
        </MapView>
      </View>

      {/* Bottom container for button */}
      <View style={styles.bottomContainer}>
        {/* Bouton Continue */}
        <TouchableOpacity style={styles.continueButton}>
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
  mapContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: '#0A77FF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobHeatmapScreen;