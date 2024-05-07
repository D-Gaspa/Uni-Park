import datetime
import random

from backend.firebase_service import update_parking_spot


class ParkingLot:
    def __init__(self, num_spots: int):
        self.spots = [ParkingSpot(i + 1) for i in range(num_spots)]

    def find_available_spot(self):
        random.shuffle(self.spots)  # Shuffle the list of spots
        for spot in self.spots:
            if not spot.is_closed and spot.available_spots > 0:
                return spot
        return None  # All spots are full or closed

    def get_status(self):
        return [
            {
                "id": spot.id,
                "availableSpots": spot.available_spots,
                "totalSpots": spot.total_spots,
                "isClosed": spot.is_closed
            }
            for spot in self.spots
        ]


default_parking_spots_data = [
    {"availableSpots": 0, "id": 1, "isClosed": False, "totalSpots": 30},
    {"availableSpots": 25, "id": 2, "isClosed": False, "totalSpots": 80},
    {"availableSpots": 10, "id": 3, "isClosed": False, "totalSpots": 40},
    {"availableSpots": 30, "id": 4, "isClosed": False, "totalSpots": 60},
    {"availableSpots": 2, "id": 5, "isClosed": False, "totalSpots": 60},
    {"availableSpots": 50, "id": 6, "isClosed": False, "totalSpots": 50},
    {"availableSpots": 10, "id": 7, "isClosed": False, "totalSpots": 15},
    {"availableSpots": 5, "id": 8, "isClosed": False, "totalSpots": 40}
]


class ParkingSpot:
    def __init__(self, spot_id: int):
        self.id = spot_id
        self.total_spots = self.get_total_spots(spot_id)
        self.available_spots = self.total_spots
        self.is_closed = self.get_is_closed(spot_id)

    @staticmethod
    def get_total_spots(spot_id):
        for spot in default_parking_spots_data:
            if spot["id"] == spot_id:
                return spot["totalSpots"]

    @staticmethod
    def get_is_closed(spot_id):
        for spot in default_parking_spots_data:
            if spot["id"] == spot_id:
                return spot["isClosed"]

    def close(self):
        self.is_closed = True

    def open(self):
        self.is_closed = False

    def enter(self):
        if not self.is_closed and self.available_spots > 0:
            self.available_spots -= 1

    def leave(self):
        if self.available_spots < self.total_spots:
            self.available_spots += 1

    def resetToDefault(self):
        for spot in default_parking_spots_data:
            if spot["id"] == self.id:
                self.available_spots = spot["availableSpots"]
                self.is_closed = spot["isClosed"]
                self.total_spots = spot["totalSpots"]


class Simulation:
    def __init__(self, parking_lot: ParkingLot):
        self.parking_lot = parking_lot
        self.current_time = datetime.datetime.now().replace(hour=7, minute=0, second=0)  # Start at 7 AM

    def advance_time(self):
        self.current_time += datetime.timedelta(hours=1)

    def get_current_hour(self):
        return self.current_time.hour

    def open_all_parking_spots(self):
        for spot in self.parking_lot.spots:
            spot.open()
            spot.available_spots = spot.total_spots

    def reset_to_default(self):
        for spot in self.parking_lot.spots:
            spot.resetToDefault()

        self.current_time = datetime.datetime.now().replace(hour=7, minute=0, second=0)


def update_database(simulation):
    for spot in simulation.parking_lot.spots:
        update_parking_spot(spot.id, {
            "availableSpots": spot.available_spots,
            "isClosed": spot.is_closed
        })


def demand_model(hour):
    if 7 <= hour <= 8:
        return 0.2  # Small demand
    elif 8 < hour <= 10:
        return 0.6  # Moderate-high demand
    elif 10 < hour <= 14:
        return 0.8  # High demand
    elif 14 < hour <= 16:
        return 0.6  # Moderate-high demand
    elif 16 < hour <= 18:
        return 0.4  # Moderate demand
    else:
        return 0.2  # Small demand


def start_simulation(simulation, specific_time=False):
    print("Starting simulation...")

    # Initialize all parking spots to be open and available
    simulation.open_all_parking_spots()

    if specific_time:
        go_to_specific_time(simulation)

    print(f"Simulation started at {simulation.current_time.strftime('%H:%M')}.")

    # Update the Firebase database with the initial values
    update_database(simulation)


def simulate_one_hour(simulation):
    cars_in_parking_lot = 0
    cars_entering = 0
    cars_leaving = 0
    current_hour = simulation.get_current_hour()

    for _ in range(60):  # Simulate 60 minutes
        for spot in simulation.parking_lot.spots:
            if random.random() < demand_model(current_hour):
                if not spot.is_closed and spot.available_spots > 0:
                    spot.enter()
                    cars_entering += 1
                    cars_in_parking_lot += 1

    # TODO: Implement cars leaving the parking lot

    print(f"Hour {current_hour}: {cars_entering} cars entered, {cars_leaving} cars left")

    simulation.advance_time()  # Move to the next hour

    update_database(simulation)  # Update the Firebase database


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
                simulate_one_hour(simulation)

            simulation.current_time = simulation.current_time.replace(hour=target_time.hour, minute=target_time.minute)
            print(f"Simulation time set to {target_time_str}")
            break

        except ValueError:
            print("Invalid time format. Please use HH:MM (24-hour).")


def close_parking_spot(simulation):
    while True:  # Loop for input validation
        spot_id = int(input("Enter the ID of the parking spot to close: "))
        spot = next((s for s in simulation.parking_lot.spots if s.id == spot_id), None)
        if spot:
            spot.close()
            print(f"Parking spot {spot_id} has been closed.")
            break
        else:
            print(f"Error: Parking spot {spot_id} not found. Please try again.")


def stop_and_reset(simulation):
    print("Stopping and resetting simulation...")

    simulation.reset_to_default()

    print("Simulation has been stopped and reset.")

    # Reset the Firebase database to the default values
    for spot in simulation.parking_lot.spots:
        update_parking_spot(spot.id, {
            "availableSpots": spot.available_spots,
            "isClosed": spot.is_closed
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
    print("3. Close a parking spot")
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
            simulate_one_hour(simulation)
        elif sim_choice == "2":
            go_to_specific_time(simulation)
        elif sim_choice == "3":
            close_parking_spot(simulation)
        elif sim_choice == "4":
            stop_and_reset(simulation)
            break
        elif sim_choice == "5":
            break
        else:
            print("Invalid choice! Please enter a valid number.")


def main():
    parking_lot = ParkingLot(8)  # Create a parking lot with 8 spots
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
