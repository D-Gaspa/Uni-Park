import React, {useState, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker, Polygon} from 'react-native-maps';
import {getParkingSpots} from '@/components/parkingSpots';
import mapStyle from '@/mapStyle.json';

export default function HomeScreen() {
    const mapRef = useRef<MapView>(null);
    const [region] = useState({
        latitude: 19.05436655381292,
        longitude: -98.28302906826138,
        latitudeDelta: 0.013936579011282646,
        longitudeDelta: 0.00887308269739151,
    });
    const [parkingSpots, setParkingSpots] = useState(getParkingSpots());

    const handlePress = (id: number) => {
        setParkingSpots((spots) =>
            spots.map((spot) =>
                spot.id === id ? {...spot, selected: true} : {...spot, selected: false}
            )
        );
    };

    const handleMapPress = () => {
        setParkingSpots((spots) =>
            spots.map((spot) => ({...spot, selected: false}))
        );
    };

    return (
        <View style={styles.container}>
            <MapView
                customMapStyle={mapStyle}
                initialRegion={region}
                onPress={handleMapPress}
                ref={mapRef}
                style={styles.map}
                showsBuildings={false}
                showsCompass={false}
                showsIndoors={false}
            >
                {parkingSpots.map((spot) => (
                    <React.Fragment key={spot.id}>
                        <Polygon
                            coordinates={spot.coordinates}
                            fillColor={spot.selected ? 'rgba(30, 144, 255, 0.5)' : 'rgba(250, 250, 250, 0.5)'}
                            strokeColor={spot.selected ? 'black' : 'black'}
                        />
                        <Marker
                            coordinate={getCenter(spot.coordinates)}
                            image={require('@/assets/images/map-marker.png')}
                            onPress={() => handlePress(spot.id)}
                            opacity={50}
                            title={`Parking Spot ${spot.id}`}
                            description={`Available Spots: ${spot.availableSpots} / ${spot.totalSpots}`}
                        />
                    </React.Fragment>
                ))}
            </MapView>
        </View>
    );
}

function getCenter(coordinates: any[]) {
    let x = coordinates.map(coordinates => coordinates.latitude);
    let y = coordinates.map(coordinates => coordinates.longitude);

    let minX = Math.min.apply(null, x);
    let maxX = Math.max.apply(null, x);

    let minY = Math.min.apply(null, y);
    let maxY = Math.max.apply(null, y);

    return {
        latitude: (minX + maxX) / 2,
        longitude: (minY + maxY) / 2,
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});