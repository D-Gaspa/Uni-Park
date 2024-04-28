import { ref, onValue } from "firebase/database";
import { db } from '@/app/_layout'

interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface ParkingSpot {
  id: string;
  coordinates: Coordinate[];
  totalSpots: number;
  availableSpots: number;
  selected?: boolean; // Local property
}

export function getParkingSpots(
  setParkingSpots: (spots: ParkingSpot[]) => void,
): void {
  const spotsRef = ref(db,'/spots/');
  onValue(spotsRef, snapshot => {
    const spotsArray: ParkingSpot[] = [];
    const data = snapshot.val();
    for (const id in data) {
      const spot = data[id];
      spotsArray.push({
        id,
        coordinates: spot.coordinates,
        totalSpots: spot.totalSpots,
        availableSpots: spot.availableSpots,
      });
    }
    setParkingSpots(spotsArray);
  });
}
