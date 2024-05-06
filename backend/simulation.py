import math
import random
import time
import threading
from firebase_utils import update_parking_status, initialize_firebase

# Dictionary of parking lots with identifier and capacity
parking_lots = {
    0: 30,
    1: 50,
    2: 60,
    3: 60,
    4: 50,
    5: 40,
    6: 15,
}


def poisson_random(lambda_):
    k = 0
    p = 1.0
    exp_lambda = math.exp(-lambda_)

    while p >= exp_lambda:
        k += 1
        p *= random.random()

    return k - 1


def simulate_parking_lot(parkinglot, no_slots):
    parking_lot = [0] * no_slots
    time_unit = 0

    while time_unit < 8 * 4:  # Run for 8 hours, assuming each unit is 15 minutes
        if time_unit % 4 == 0:
            lambda_ = random.randint(10, 60)  # Random arrival rate between 10 and 60
            arrivals = poisson_random(lambda_)
            print(f"Lot {parkinglot}: {arrivals} cars arrived.")

            for _ in range(arrivals):
                if 0 in parking_lot:
                    free_index = parking_lot.index(0)
                    parking_lot[free_index] = 1

        print(f"Lot {parkinglot}: {parking_lot.count(1)} cars parked out of {no_slots}")
        update_parking_status(parkinglot, no_slots - parking_lot.count(1))

        # Simulate some cars leaving
        for i in range(len(parking_lot)):
            if parking_lot[i] == 1 and random.random() < 0.1:
                parking_lot[i] = 0

        time_unit += 1
        time.sleep(1)

    print(f"Lot {parkinglot}: Simulation ends.")


if __name__ == '__main__':
    initialize_firebase()
    threads = []
    for lot_id, capacity in parking_lots.items():
        thread = threading.Thread(target=simulate_parking_lot, args=(lot_id, capacity))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()
