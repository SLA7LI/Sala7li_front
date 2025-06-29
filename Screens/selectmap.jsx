import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const LocationScreen = () => {

  const [selectedLocation, setSelectedLocation] = useState(null);


  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };
console.log(selectedLocation)
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Select Your Location</Text>
      </View>


      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 28.0339, 
            longitude: 1.6596,
            latitudeDelta: 10, 
            longitudeDelta: 10,
          }}

          region={{
            latitude: 28.0339,
            longitude: 1.6596,
            latitudeDelta: 10,
            longitudeDelta: 10,
          }}
          minZoomLevel={4} 
          maxZoomLevel={15} 
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Selected Location"
              description={`Lat: ${selectedLocation.latitude.toFixed(4)}, Lng: ${selectedLocation.longitude.toFixed(4)}`}
            />
          )}
        </MapView>
      </View>


      <View style={styles.bottomContainer}>

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
    marginLeft:20,
    marginRight:20
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
    marginLeft:20,
    marginRight:20
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationScreen;