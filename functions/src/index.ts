import * as functions from "firebase-functions";
import * as firebase from "firebase"; // Your web app's Firebase configuration

import { Actions } from "./actions";
// tslint:disable-next-line: no-duplicate-imports
import { chain, tryCatch, map, right } from "fp-ts/lib/TaskEither";
import { ErrorTypes } from "./errortypes";
import { tryCatchR } from "./fp-utils";

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
}; // Initialize Firebase

firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

interface Card {
  id: number;
  color: "red" | "black";
}

interface GameState {
  players: {
    [playerId: string]: {
      cards: Card[];
    };
  };
  currentMove: Card[];
  score?: number;
  error?: string; // TODO: different error types
}

export const setState = (gameId: string, state: GameState) =>
  database.ref("games/" + gameId).set(state);

export const setStateR = (gameId: string, state: GameState) =>
  tryCatch(
    () => setState(gameId, state),
    (err) => ErrorTypes.UnexpectedError(err as Error)
  );

export const readState = (gameId: string) =>
  database
    .ref("games/" + gameId)
    .once("value")
    .then((snapshot) => snapshot.val() || {}) as Promise<GameState>;

export const readStateR = (gameId: string) =>
  tryCatch(
    () => readState(gameId),
    (err) => ErrorTypes.UnexpectedError(err as Error)
  );

export const reducerFunction = (state: any, action: Actions) => {
  return Actions.match(action, {
    JoinGame: (a) => state,
    PlayCard: (a) => state,
    StartGame: (a) => state,
    default: (a) =>  { throw new Error(`Unknown Action ${a}`) }
  });
};

const reducerFunctionR = (state: any, action: Actions) =>
  tryCatchR(
    () => reducerFunction(state, action),
    (err) => ErrorTypes.UnexpectedError(err)
  );

type Mixed = { action: Actions; state: GameState };

export const reducer = functions.https.onRequest((request, response) => {
  return chain<ErrorTypes, GameState, Mixed>((state) =>
    setStateR(request.body.gameId, state)
  )(
    chain<ErrorTypes, Mixed, GameState>((d) =>
      reducerFunctionR(d.state, d.action)
    )(
      chain<ErrorTypes, Actions, Mixed>((action) =>
        map<GameState, Mixed>((state) => ({ state, action } as Mixed))(
          readStateR(action.gameId)
        )
      )(right(request.body))
      //(decode(Actions)(request.body))
    )
  );
});
