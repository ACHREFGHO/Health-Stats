import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    async function checkBluetoothState() {
      // Assuming there's a method to check Bluetooth state
      const isEnabled = await checkBluetoothStatus();
      if (!isEnabled) {
        alert('Bluetooth is not enabled. Please enable Bluetooth to use this app.');
        Linking.openSettings();
      }
    }
    checkBluetoothState();
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState({ latitude: 36.809294, longitude: 10.132979 });

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const handleMapPress = () => {
    const url = `https://www.openstreetmap.org/?mlat=${coordinates.latitude}&mlon=${coordinates.longitude}#map=13/${coordinates.latitude}/${coordinates.longitude}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Stats</Text>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Patient X</Text>
        <TouchableOpacity onPress={handleMapPress} style={styles.iconContainer}>
          <MaterialIcons name="location-on" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.text}>BPM: 72</Text>
          <Text style={styles.text}>SpO2: 98%</Text>
        </View>
      </View>
      <View style={styles.mapContainer}>
        <WebView
          originWhitelist={['*']}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Leaflet Map</title>
                  <meta charset="utf-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                  <style>
                    #map { height: 100%; }
                  </style>
                </head>
                <body>
                  <div id="map"></div>
                  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                  <script>
                    var map = L.map('map').setView([${coordinates.latitude}, ${coordinates.longitude}], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);
                    
                    // Add a marker with a popup showing coordinates
                    var marker = L.marker([36.7718, 9.7724]).addTo(map);
                    marker.bindPopup("Latitude: ${coordinates.latitude}<br>Longitude: ${coordinates.longitude}").openPopup();
                  </script>
                </body>
              </html>
            `
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </View>
  );
}

function MapScreen({ route }) {
  const { coordinates } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <title>Leaflet Map</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                <style>
                  #map { height: 100%; }
                </style>
              </head>
              <body>
                <div id="map"></div>
                <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                <script>
                  var map = L.map('map').setView([${coordinates.latitude}, ${coordinates.longitude}], 13);
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  }).addTo(map);

                  // Add a marker with the default icon and popup showing coordinates
                  var marker = L.marker([${coordinates.latitude}, ${coordinates.longitude}]).addTo(map);
                  marker.bindPopup("Latitude: ${coordinates.latitude}<br>Longitude: ${coordinates.longitude}").openPopup();
                </script>
              </body>
            </html>
          `
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#51AFF7',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: 'white',
  },
  box: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: '80%',
    marginBottom: 10,
  },
  boxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E3B55',
  },
  iconContainer: {
    marginBottom: 10, // Add margin bottom for spacing
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column', // Change to column for vertical alignment
    alignItems: 'flex-start', // Align text to the left
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginRight: 10,
    marginBottom: 5, // Add margin bottom for spacing
  },
  mapContainer: {
    width: '100%',
    height: 300,
    marginTop: 10,
  },
});

// Assuming a mock function to check Bluetooth status
async function checkBluetoothStatus() {
  // Implement the actual check for Bluetooth status here
  return true; // Or false if Bluetooth is not enabled
}
