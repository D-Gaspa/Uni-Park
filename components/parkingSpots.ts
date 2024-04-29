import {onValue, ref, update} from "firebase/database";
import {db} from '@/backend/firebaseInit';

interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface ParkingSpot {
    id: number;
    coordinates: Coordinate[];
    totalSpots: number;
    availableSpots: number;
    isClosed: boolean;
    teacherOnly: boolean;
    selected?: boolean;
}

export function updateParkingSpot(spotIndex: number, isClosed: boolean): Promise<void> {
    const spotRef = ref(db, `/spots/${spotIndex}`);
    return update(spotRef, {isClosed});
}

export function getParkingSpots(
    role: string | null | undefined,
    setParkingSpots: (spots: ParkingSpot[]) => void,
): void {
    // removed the useSession hook from here
    const spotsRef = ref(db, '/spots/');
    onValue(spotsRef, snapshot => {
        const spotsArray: ParkingSpot[] = [];
        const data = snapshot.val();
        for (const id in data) {
            const spot = data[id];
            // if the user is a student and the spot is teacherOnly, skip this spot
            if (role === 'student' && spot.teacherOnly) continue;
            spotsArray.push({
                id: spot.id,
                coordinates: spot.coordinates,
                totalSpots: spot.totalSpots,
                availableSpots: spot.availableSpots,
                isClosed: spot.isClosed,
                teacherOnly: spot.teacherOnly,
            });
        }
        setParkingSpots(spotsArray);
    });
}