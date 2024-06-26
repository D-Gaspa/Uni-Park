import React, {useEffect, useRef, useState} from "react";
import {Alert, Animated, StyleSheet, TouchableOpacity, View,} from "react-native";
import MapView, {Marker, Polygon} from "react-native-maps";
import {getParkingSpots, ParkingSpot, updateParkingSpot,} from "@/components/parkingSpots";
import mapStyleLight from "@/map-style-light-mode.json";
import mapStyleBlue from "@/map-style-blue-mode.json";
import {db} from "@/firebase-config";
import {useSession} from "@/components/AuthContext";
import {FontAwesome5} from "@expo/vector-icons";
import {useColorSchemeWithSession} from "@/components/useColorScheme";

export default function HomeScreen() {
    const colorScheme = useColorSchemeWithSession();
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
            console.log("Database not initialized");
            return;
        }
        return getParkingSpots(role, (spots) => {
            const updatedSpots = spots.map((spot) => ({...spot, selected: false}));
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
        const spot = parkingSpots.find((spot) => spot.id === id);
        if (role === "admin" && spot) {
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

    function getSpotColor(availableSpots: number, totalSpots: number): string {
        const ratio = availableSpots / totalSpots;
        let red, green;

        if (ratio > 0.5) {
            // Transition from green to yellow
            red = Math.round(255 * (1 - (ratio - 0.5) * 2));
            green = 255;
        } else {
            // Transition from yellow to red
            red = 255;
            green = Math.round(255 * ratio * 2);
        }

        return `rgba(${red}, ${green}, 0, 0.5)`;
    }

    const handleLockPress = () => {
        if (selectedSpot) {
            const newIsClosed = !selectedSpot.isClosed;
            Alert.alert(
                "Confirm",
                `Are you sure you want to ${newIsClosed ? "close" : "reopen"} this spot?`,
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        onPress: () => {
                            const spotIndex = parkingSpots.findIndex(
                                (spot) => spot.id === selectedSpotId
                            );
                            updateParkingSpot(spotIndex, newIsClosed)
                                .then(() => {
                                    setParkingSpots((spots) =>
                                        spots.map((spot) =>
                                            spot.id === selectedSpotId ? {...spot, isClosed: newIsClosed} : spot
                                        )
                                    );
                                    setSelectedSpot((prevSpot) =>
                                        prevSpot ? {...prevSpot, isClosed: newIsClosed} : null
                                    );
                                })
                                .catch((error) => {
                                    console.error("Failed to update parking spot:", error);
                                });
                        },
                    },
                ]
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* Map View */}
            <MapView
                customMapStyle={colorScheme === 'light' ? mapStyleLight : mapStyleBlue}
                initialRegion={region}
                onPress={handleMapPress}
                ref={mapRef}
                provider={"google"}
                style={styles.map}
                showsBuildings={false}
                showsCompass={false}
                showsIndoors={false}
            >
                {/* Parking Spots */}
                {parkingSpots.map((spot) => (
                    <React.Fragment key={spot.id}>
                        {/* Parking Spot Polygon */}
                        <Polygon
                            coordinates={spot.coordinates}
                            fillColor={
                                spot.isClosed
                                    ? "rgba(50, 50, 50, 0.2)" : getSpotColor(spot.availableSpots, spot.totalSpots)
                            }
                            strokeColor={spot.selected ? "white" : "black"}
                        />

                        {/* Parking Spot Marker */}
                        <Marker
                            coordinate={getCenter(spot.coordinates)}
                            icon={spot.isClosed ? require("@/assets/images/map-marker-closed.png") :
                                spot.availableSpots === 0 ? require("@/assets/images/map-marker.png") :
                                    colorScheme === "light" ? require("@/assets/images/map-marker-white.png") :
                                        require("@/assets/images/map-marker-white-blue.png")}
                            onPress={() => handlePress(spot.id)}
                            opacity={1}
                            title={spot.teacherOnly ? `Teacher Parking Spot ${spot.id}` : `Parking Spot ${spot.id}`}
                            description={spot.isClosed ? 'Closed' : `Available Spots: ${spot.availableSpots} / ${spot.totalSpots}`}
                        />
                    </React.Fragment>
                ))}
            </MapView>

            {/* Lock Icon for Admin */}
            {role === 'admin' && (
                <Animated.View style={[styles.lockIcon, lockIconStyle]}>
                    <TouchableOpacity onPress={handleLockPress}>
                        <FontAwesome5
                            name={selectedSpot ? (selectedSpot.isClosed ? 'unlock' : 'lock') : 'lock'}
                            size={25}
                            color={colorScheme === 'light' ? 'black' : 'white'}
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
        position: "absolute",
        right: 19,
        bottom: 70,
    },
});
