import * as firebase from "firebase";
import { GameState } from "./state";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const firebaseConfig = {
  apiKey: "AIzaSyB8rdKbdHnLZVAkET8-W_bKDhszxnDdqWc",
  authDomain: "jass-backend.firebaseapp.com",
  databaseURL: "https://jass-backend.firebaseio.com",
  projectId: "jass-backend",
  storageBucket: "jass-backend.appspot.com",
  messagingSenderId: "926115738920",
  appId: "1:926115738920:web:6f3bd116edab49c8478c1d",
  measurementId: "G-NBGVTJRT22",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

export const setState = (gameId: string, state: GameState) =>
  database.ref("games/" + gameId).set(state);

export const readState = (gameId: string) =>
  database
    .ref("games/" + gameId)
    .once("value")
    .then((snapshot) => snapshot.val() || {}) as Promise<GameState>;
