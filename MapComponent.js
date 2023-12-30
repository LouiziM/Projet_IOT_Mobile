// MapComponent.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import TrafficLight from './TrafficLight';
import axios from 'axios';

const MapComponent = () => {
  const [trafficLights, setTrafficLights] = useState([]);
  const [openedTrafficLight, setOpenedTrafficLight] = useState(null);

  useEffect(() => {
    const fetchAllTraffic = async () => {
      try {
        const response = await axios.get('http://192.168.43.135:5000/traffic');
        const trafficData = response.data;
        console.log(trafficData);
        const newTrafficLights = trafficData
          .filter((traffic) => traffic.lat !== undefined && traffic.long !== undefined)
          .map((traffic) => ({
            id: traffic.id,
            latitude: traffic.lat,
            longitude: traffic.long,
          }));

        setTrafficLights(newTrafficLights);
      } catch (error) {
        console.error('Error fetching all traffic data:', error.message);
      }
    };

    fetchAllTraffic();
  }, []);

  const renderTrafficLight = (id) => {
    setOpenedTrafficLight(id);
  };

  const handleTrafficLightClose = () => {
    setOpenedTrafficLight(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 51.5,
          longitude: -0.09,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {trafficLights.map((trafficLight) => (
          <Marker
            key={trafficLight.id}
            coordinate={{
              latitude: trafficLight.latitude,
              longitude: trafficLight.longitude,
            }}
            onPress={() => renderTrafficLight(trafficLight.id)}
          />
        ))}
      </MapView>

      {openedTrafficLight !== null && (
        <TrafficLight
          id={openedTrafficLight}
          onClose={handleTrafficLightClose}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
