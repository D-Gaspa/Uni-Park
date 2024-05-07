import firebase_admin
from firebase_admin import credentials, db
from credentials import firebase_config

cred = credentials.Certificate(firebase_config)

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://uni-park-9ac04-default-rtdb.firebaseio.com/'
})


def get_parking_spots():
    # Get a reference to the parking spots in the database
    spots_ref = db.reference('spots')

    # Get the data
    spots = spots_ref.get()

    return spots


def update_parking_lot(spot_id: int, spot_data: dict):
    # Get a reference to the parking spots in the database
    spots_ref = db.reference('spots')

    # Convert spot_id to string, subtract 1 to match the database index, and update the data
    spots_ref.child(str(spot_id - 1)).update(spot_data)
