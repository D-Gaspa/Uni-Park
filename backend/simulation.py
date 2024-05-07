import datetime
import random
import numpy as np

from backend.firebase_service import update_parking_lot

# Default parking lot data
default_parking_lots_data = [
    {"availableSpots": 0, "id": 1, "isClosed": False, "totalSpots": 30},
    {"availableSpots": 25, "id": 2, "isClosed": False, "totalSpots": 80},
    {"availableSpots": 10, "id": 3, "isClosed": False, "totalSpots": 40},
    {"availableSpots": 30, "id": 4, "isClosed": False, "totalSpots": 60},
    {"availableSpots": 2, "id": 5, "isClosed": False, "totalSpots": 60},
    {"availableSpots": 50, "id": 6, "isClosed": False, "totalSpots": 50},
    {"availableSpots": 10, "id": 7, "isClosed": False, "totalSpots": 15},
    {"availableSpots": 5, "id": 8, "isClosed": False, "totalSpots": 40}
]


class ParkingStructure:
    def __init__(self, num_spots: int):
        self.parking_lots = [ParkingLot(i + 1) for i in range(num_spots)]

    def get_total_available_spots(self):
        total_available_spots = 0
        for lot in self.parking_lots:
            total_available_spots += lot.get_total_available_spots()
        return total_available_spots

    def getTotalAvailability(self):
        total_spots = 0
        total_available_spots = 0
        for lot in self.parking_lots:
            total_spots += lot.total_spots
            total_available_spots += lot.available_spots

        return total_available_spots, total_spots


class ParkingLot:
    def __init__(self, spot_id: int):
        self.id = spot_id
        self.total_spots = self.get_total_spots(spot_id)
        self.available_spots = self.total_spots
        self.is_closed = self.get_is_closed(spot_id)
        self.spots = [ParkingSpot(i + 1) for i in range(self.total_spots)]

    @staticmethod
    def get_total_spots(spot_id):
        for spot in default_parking_lots_data:
            if spot["id"] == spot_id:
                return spot["totalSpots"]

    @staticmethod
    def get_is_closed(spot_id):
        for spot in default_parking_lots_data:
            if spot["id"] == spot_id:
                return spot["isClosed"]

    def get_total_available_spots(self):
        return self.available_spots

    def close(self):
        self.is_closed = True

    def open(self):
        self.is_closed = False

    def find_available_spot(self):
        random.shuffle(self.spots)  # Shuffle the list of parking spots
        for spot in self.spots:
            if spot.arrival_time is None:  # The spot is empty
                return spot
        return None  # No spots available in this lot

    def enter(self, time):
        spot = self.find_available_spot()
        if spot:
            spot.arrival_time = time
            self.available_spots -= 1
            return True
        return False  # Could not find an available spot

    def leave(self):
        occupied_spots = [spot for spot in self.spots if spot.arrival_time is not None]
        if occupied_spots:
            spot = random.choice(occupied_spots)
            spot.arrival_time = None
            self.available_spots += 1
            return True
        return False  # Empty lot

    def resetToDefault(self):
        for spot in default_parking_lots_data:
            if spot["id"] == self.id:
                self.available_spots = spot["availableSpots"]
                self.is_closed = spot["isClosed"]
                self.total_spots = spot["totalSpots"]


class ParkingSpot:
    def __init__(self, spot_id):
        self.id = spot_id
        self.arrival_time = None  # Tracks arrival time if occupied


class Simulation:
    def __init__(self, parking_structure: ParkingStructure):
        self.parking_structure = parking_structure
        self.current_time = datetime.datetime.now().replace(hour=7, minute=0, second=0)  # Start at 7 AM

    def advance_time(self):
        self.current_time += datetime.timedelta(hours=1)

    def get_current_hour(self):
        return self.current_time.hour

    def open_all_parking_spots(self):
        for parking_lot in self.parking_structure.parking_lots:
            parking_lot.open()
            parking_lot.available_spots = parking_lot.total_spots

    def reset_to_default(self):
        for parking_lot in self.parking_structure.parking_lots:
            parking_lot.resetToDefault()

        self.current_time = datetime.datetime.now().replace(hour=7, minute=0, second=0)

    def simulate_one_hour(self):
        # Check if the simulation has reached the end time
        if self.current_time.hour == 22:
            print("Simulation has reached the end time (9 PM).")
            return False

        current_hour = self.get_current_hour()

        for parking_lot in self.parking_structure.parking_lots:
            target_occupancy = calculate_occupancy(parking_lot.total_spots, current_hour)
            adjust_parking_lot(parking_lot, target_occupancy)

        # Print the availability of the structure Available/Total
        total_available_spots, total_spots = self.parking_structure.getTotalAvailability()

        self.advance_time()  # Move to the next hour
        current_hour = self.get_current_hour()

        print(f"Hour {current_hour}: {total_available_spots}/{total_spots} spots available.")

        update_database(self)  # Update the Firebase database
        return True


def update_database(simulation):
    for parking_lot in simulation.parking_structure.parking_lots:
        update_parking_lot(parking_lot.id, {
            "availableSpots": parking_lot.available_spots,
            "isClosed": parking_lot.is_closed
        })


def get_mean_occupancy(current_hour):
    if current_hour <= 7:  # 7 AM
        return np.random.uniform(0.5, 0.75)  # 50-75%
    elif 7 < current_hour <= 9:  # 8-9 AM
        return np.random.uniform(0.8, 0.85)  # 80-85%
    elif 9 < current_hour <= 12:  # 10-12 PM
        return np.random.uniform(0.95, 1)  # 95-100%
    elif 12 < current_hour <= 14:  # 1-2 PM
        return np.random.uniform(0.9, 0.95)  # 90-95%
    elif 14 < current_hour <= 16:  # 3-4 PM
        return np.random.uniform(0.5, 0.75)  # 50-75%
    elif 16 < current_hour <= 18:  # 5-6 PM
        return np.random.uniform(0.4, 0.6)  # 40-60%
    elif 18 < current_hour <= 19:  # 7-8 PM
        return np.random.uniform(0.2, 0.4)  # 20-40%
    elif 19 < current_hour <= 21:  # 8-9 PM
        return np.random.uniform(0, 0.10)  # 0-10%
    else:
        return 1  # Placeholder for other hours


def calculate_occupancy(total_spots, current_hour):
    mean_occupancy = get_mean_occupancy(current_hour) * total_spots
    occupied_spots = np.random.poisson(mean_occupancy)
    # Ensure occupied_spots is within valid range
    occupied_spots = max(0, min(occupied_spots, total_spots))
    return occupied_spots


def adjust_parking_lot(parking_lot, target_occupancy):
    num_occupied = sum(spot.arrival_time is not None for spot in parking_lot.spots)

    if num_occupied > target_occupancy:
        occupied_spots = [spot for spot in parking_lot.spots if spot.arrival_time is not None]
        spots_to_free = num_occupied - target_occupancy

        np.random.shuffle(occupied_spots)
        for spot in occupied_spots[:spots_to_free]:
            spot.arrival_time = None
        parking_lot.available_spots += spots_to_free

    elif num_occupied < target_occupancy:
        available_spots = [spot for spot in parking_lot.spots if spot.arrival_time is None]
        spots_to_occupy = target_occupancy - num_occupied
        np.random.shuffle(available_spots)
        for spot in available_spots[:spots_to_occupy]:
            spot.arrival_time = datetime.datetime.now()
        parking_lot.available_spots -= spots_to_occupy


def start_simulation(simulation, specific_time=False):
    print("Starting simulation...")

    # Initialize all parking spots to be open and available
    simulation.open_all_parking_spots()

    if specific_time:
        go_to_specific_time(simulation)

    print(f"Simulation started at {simulation.current_time.strftime('%H:%M')}.")

    # Update the Firebase database with the initial values
    update_database(simulation)


def go_to_specific_time(simulation):
    while True:
        target_time_str = input("Enter target time (HH:MM, 24-hour format): ")
        try:
            target_time = datetime.datetime.strptime(target_time_str, '%H:%M').time()

            # Input Validation
            if simulation.current_time > datetime.datetime.combine(simulation.current_time.date(), target_time):
                print("Target time must be later than current simulation time.")
                continue  # Ask for input again

            if target_time.hour > 21:
                print("Target time must be within the simulation range (7 AM to 9PM).")
                continue  # Ask for input again

            # Simulate up to the target time
            while simulation.current_time.hour < target_time.hour:
                simulation.simulate_one_hour()

            simulation.current_time = simulation.current_time.replace(hour=target_time.hour, minute=target_time.minute)
            print(f"Simulation time set to {target_time_str}")
            break

        except ValueError:
            print("Invalid time format. Please use HH:MM (24-hour).")


def close_parking_lot(simulation):
    while True:  # Loop for input validation
        slot_id = int(input("Enter the ID of the parking lot to close: "))
        parking_lot = next((s for s in simulation.parking_structure.parking_lots if s.id == slot_id), None)
        if parking_lot:
            parking_lot.close()
            print(f"Parking lot {slot_id} has been closed.")
            break
        else:
            print(f"Error: Parking lot {slot_id} not found. Please try again.")


def stop_and_reset(simulation: Simulation):
    print("Stopping and resetting simulation...")

    simulation.reset_to_default()

    print("Simulation has been stopped and reset.")

    # Reset the Firebase database to the default values
    for parking_lot in simulation.parking_structure.parking_lots:
        update_parking_lot(parking_lot.id, {
            "availableSpots": parking_lot.available_spots,
            "isClosed": parking_lot.is_closed
        })


def main_menu():
    print("\nMain Menu:")
    print("1. Start or restart simulation")
    print("2. Start from a specific hour")
    print("3. Reset to default values")
    print("3. Exit")


def simulation_menu():
    print("Simulation Menu:")
    print("1. Simulate one hour")
    print("2. Go to specific time")
    print("3. Close a parking lot")
    print("4. Reset and go back to main menu")
    print("5. Go back to main menu")


def run_simulation(simulation, specific_time=False):
    if specific_time:
        start_simulation(simulation, True)
    else:
        start_simulation(simulation)

    while True:
        simulation_menu()
        sim_choice = input("\nEnter your choice: ")
        if sim_choice == "1":
            if simulation.simulate_one_hour() is False:
                stop_and_reset(simulation)
                break
        elif sim_choice == "2":
            go_to_specific_time(simulation)
        elif sim_choice == "3":
            close_parking_lot(simulation)
        elif sim_choice == "4":
            stop_and_reset(simulation)
            break
        elif sim_choice == "5":
            break
        else:
            print("Invalid choice! Please enter a valid number.")


def main():
    parking_lot = ParkingStructure(8)  # Create a parking lot with 8 spots
    simulation = Simulation(parking_lot)  # Create a simulation instance

    while True:
        main_menu()
        choice = input("\nEnter your choice: ")

        if choice == "1":
            run_simulation(simulation)
        elif choice == "2":
            run_simulation(simulation, True)
        elif choice == "3":
            stop_and_reset(simulation)
        elif choice == "4":
            print("Exiting program...")
            break
        else:
            print("Invalid choice! Please enter a valid number.")


if __name__ == '__main__':
    main()
