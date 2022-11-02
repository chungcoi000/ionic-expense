import {Trip} from './models/Trip';
import {openDB} from 'idb';

const DATABASE_NAME = "TripDB";

initDB().then(() => {
  console.log("Database created!");
});

export async function addTrip(tripInfo: Trip) {
  const db = await openDB(DATABASE_NAME, 1);
  const id = await db.put("trips", tripInfo);
  return id;
}

export async function getAllTrips() {
  const db = await openDB(DATABASE_NAME, 1);
  const results = await db.getAll("trips");
  return results;
}

export async function getTripById(id: number) {
  const db = await openDB(DATABASE_NAME, 1);
  const result = await db.get("trips", id);
  return result;
}

export async function deleteTripById(id: number) {
  const db = await openDB(DATABASE_NAME, 1);
  const result = await db.delete("trips", id);
  return result;
}

export async function updateTripById(id: any, tripInfo: Trip) {
  console.log("trip");
  const db = await openDB(DATABASE_NAME, 1);
  const trip = await db.get("trip", id);
  if (trip) {
    const tripId = await db.put("trip", {...tripInfo, id});
    return tripId;
  } else {
    console.log("This trip not found!");
  }
}

export async function initDB() {
  await openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      db.createObjectStore('trips', {
        keyPath: "id",
        autoIncrement: true
      })
    }
  })
}