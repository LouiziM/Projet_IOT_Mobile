import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapComponent from './MapComponent';
import TrafficLight from './TrafficLight';

export default function App() {
  return (
    <View style={styles.container}>
      <MapComponent/>
   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
