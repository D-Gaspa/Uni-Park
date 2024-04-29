import React, {useEffect, useRef, useState} from "react";
import {Alert, Animated, StyleSheet, TouchableOpacity, useColorScheme, View} from 'react-native';
import MapView, {Marker, Polygon} from "react-native-maps";
import {getParkingSpots, ParkingSpot, updateParkingSpot} from "@/components/parkingSpots";
import mapStyleDark from "@/map-style-dark-mode.json";
import mapStyleLight from "@/map-style-light-mode.json";
import {db} from "@/backend/firebaseInit";
import {useSession} from "@/components/AuthContext";
import {FontAwesome5} from "@expo/vector-icons";

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
    const {role} = useSession();
    const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);
    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
    const lockIconPosition = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!db) {
            console.log('Database not initialized');
            return;
        }
        return getParkingSpots(role, spots => {
            const updatedSpots = spots.map(spot => ({...spot, selected: false}));
            setParkingSpots(updatedSpots);
        });
    }, [db]); // Only run effect if database object changes

    useEffect(() => {
        Animated.timing(lockIconPosition, {
            toValue: selectedSpotId ? 0 : 100,
            duration: 225,
            useNativeDriver: true,
        }).start();
    }, [selectedSpotId]);

    const lockIconStyle = {
        transform: [{translateX: lockIconPosition}],
    };

    const handlePress = (id: number) => {
        const spot = parkingSpots.find(spot => spot.id === id);
        if (role === 'admin' && spot) {
            setSelectedSpotId(id);
            setSelectedSpot(spot);
        }
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
        setSelectedSpotId(null);
        setSelectedSpot(null);
    };

    const handleLockPress = () => {
        if (selectedSpot) {
            const newIsClosed = !selectedSpot.isClosed;
            Alert.alert(
                'Confirm',
                `Are you sure you want to ${newIsClosed ? 'close' : 'reopen'} this spot?`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: () => {
                            const spotIndex = parkingSpots.findIndex(spot => spot.id === selectedSpotId);
                            updateParkingSpot(spotIndex, newIsClosed)
                                .then(() => {
                                    setParkingSpots((spots) =>
                                        spots.map((spot) =>
                                            spot.id === selectedSpotId ? {...spot, isClosed: newIsClosed} : spot
                                        )
                                    );
                                    setSelectedSpot((prevSpot) => prevSpot ? {
                                        ...prevSpot,
                                        isClosed: newIsClosed
                                    } : null);
                                })
                                .catch((error) => {
                                    console.error('Failed to update parking spot:', error);
                                });
                        },
                    },
                ],
            );
        }
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
                                spot.isClosed
                                    ? spot.selected
                                        ? "rgba(255, 0, 0, 0.5)"
                                        : "rgba(180, 0, 0, 0.5)"
                                    : spot.teacherOnly
                                        ? spot.selected
                                            ? "rgba(30, 144, 255, 0.5)"
                                            : "rgba(164, 238, 255, 0.5)"
                                        : spot.selected
                                            ? spot.availableSpots === 0
                                                ? "rgba(12, 62, 102, 0.5)"
                                                : "rgba(30, 144, 255, 0.5)"
                                            : spot.availableSpots === 0
                                                ? "rgba(50, 50, 50, 0.5)"
                                                : "rgba(250, 250, 250, 0.5)"
                            }
                            strokeColor={"black"}
                        />
                        <Marker
                            coordinate={getCenter(spot.coordinates)}
                            image={require("@/assets/images/map-marker.png")}
                            onPress={() => handlePress(spot.id)}
                            opacity={0.85}
                            title={spot.teacherOnly ? `Teacher Parking Spot ${spot.id}` : `Parking Spot ${spot.id}`}
                            description={spot.isClosed ? 'Closed' : `Available Spots: ${spot.availableSpots} / ${spot.totalSpots}`}
                        />
                    </React.Fragment>
                ))}
            </MapView>
            {role === 'admin' && (
                <Animated.View style={[styles.lockIcon, lockIconStyle]}>
                    <TouchableOpacity onPress={handleLockPress}>
                        <FontAwesome5
                            name={selectedSpot ? (selectedSpot.isClosed ? 'unlock' : 'lock') : 'lock'}
                            size={25}
                            color={colorScheme === 'dark' ? 'white' : 'black'}
                        />
                    </TouchableOpacity>
                </Animated.View>
            )}
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
    lockIcon: {
        opacity: 0.75,
        position: 'absolute',
        right: 19,
        bottom: 70,
    },
});