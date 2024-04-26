import React, {useState, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Polygon} from 'react-native-maps';

import mapStyle from '@/mapStyle.json';

export default function HomeScreen() {
    const [region, setRegion] = useState({ // State to manage the region
        latitude: 19.05436655381292,
        longitude: -98.28302906826138,
        latitudeDelta: 0.013936579011282646,
        longitudeDelta: 0.00887308269739151,
    });
    const mapRef = useRef(null);
    const handleRegionChange = (newRegion: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    }) => {
        // Set the region information
        setRegion(newRegion);
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                customMapStyle={mapStyle}
                initialRegion={region}
                onRegionChangeComplete={handleRegionChange}
                showsBuildings={false}
                showsIndoors={false}
                showsCompass={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});
