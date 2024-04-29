import firebase_admin
from firebase_admin import credentials, db


def initialize_firebase():
    cred = credentials.Certificate('C:\\Users\\koqui\\source\\repos\\Uni-Park\\firebase-adminsdk.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://uni-park-9ac04-default-rtdb.firebaseio.com/'
    })


def update_parking_status(spot_id, is_available):
    ref = db.reference(f'spots/{spot_id}')
    ref.update({'availableSpots': is_available})
