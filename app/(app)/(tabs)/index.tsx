import React, {useEffect, useRef, useState} from "react";
import {StyleSheet, View, Modal, Button, FlatList, TouchableOpacity, useColorScheme} from 'react-native';
import MapView, {Marker, Polygon} from "react-native-maps";
import {getParkingSpots, ParkingSpot} from "@/components/parkingSpots";
import mapStyleDark from "@/map-style-dark-mode.json";
import mapStyleLight from "@/map-style-light-mode.json";
import {db} from "@/app/_layout";
import FontAwesome from '@expo/vector-icons/FontAwesome5';

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const mapRef = useRef<MapView>(null);
    const [region] = useState({
        latitude: 19.05436655381292,
        longitude: -98.28302906826138,
        latitudeDelta: 0.013936579011282646,
        longitudeDelta: 0.00887308269739151,
    });
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if (!db) {
            console.log('Database not initialized');
            return;
        }
      return getParkingSpots(spots => {
          const updatedSpots = spots.map(spot => ({...spot, selected: false}));
          setParkingSpots(updatedSpots);
        });
    }, [db]); // Only run effect if database object changes

    const handlePress = (id: string) => {
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
                customMapStyle={colorScheme === 'dark' ? mapStyleDark : mapStyleLight}
                initialRegion={region}
                onPress={handleMapPress}
                ref={mapRef}
                provider={"google"}
                style={styles.map}
                showsBuildings={false}
                showsCompass={false}
                showsIndoors={false}
            >
                {parkingSpots.map((spot) => (
                    <React.Fragment key={spot.id}>
                        <Polygon
                            coordinates={spot.coordinates}
                            fillColor={
                                spot.selected
                                    ? spot.availableSpots === 0
                                        ? "rgba(12, 62, 102, 0.5)"
                                        : "rgba(30, 144, 255, 0.5)"
                                    : spot.availableSpots === 0
                                        ? "rgba(50, 50, 50, 0.5)"
                                        : "rgba(250, 250, 250, 0.5)"
                            }
                            onPress={() => handlePress(spot.id)}
                            strokeColor={"black"}
                        />
                        <Marker
                            coordinate={getCenter(spot.coordinates)}
                            image={require("@/assets/images/map-marker.png")}
                            onPress={() => handlePress(spot.id)}
                            opacity={0.85}
                            title={`Parking Spot ${spot.id}`}
                            description={`Available Spots: ${spot.availableSpots} / ${spot.totalSpots}`}
                        />
                    </React.Fragment>
                ))}
            </MapView>
            <TouchableOpacity style={styles.searchButton} onPress={() => setIsModalVisible(true)}>
                <FontAwesome name="search-location" size={25} color='white'/>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalContainer} onPress={() => setIsModalVisible(false)}>
                    <View style={styles.modalView}>
                        <FlatList
                            data={parkingSpots}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({item}) => (
                                <Button
                                    title={`Parking Spot ${item.id}`}
                                    onPress={() => handlePress(item.id)}
                                />
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

        </View>
    );
}

function getCenter(coordinates: any[]) {
    let x = coordinates.map((coordinates) => coordinates.latitude);
    let y = coordinates.map((coordinates) => coordinates.longitude);

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
    searchButton: {
        position: 'absolute',
        top: 40,
        left: 65,
        right: 65,
        padding: 10,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // semi-transparent black
        borderRadius: 30,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
