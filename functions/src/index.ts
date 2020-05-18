import * as functions from "firebase-functions";
import * as firebase from "firebase"; // Your web app's Firebase configuration

import { Actions } from "./actions";
// tslint:disable-next-line: no-duplicate-imports
import {
  chain,
  tryCatch,
  map,
  right,
  mapLeft,
  fold,
} from "fp-ts/lib/TaskEither";
import { ErrorTypes, toHttpResult, HttpResult } from "./errortypes";
import { tryCatchR, isEmpty } from "./utils";
import { of } from "fp-ts/lib/Task";

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

interface GameState {
  players?: {
    [playerId: string]: {
      cards: number[];
    };
  };
  currentMove?: number[];
  score?: number;
  error?: string; // TODO: different error types
}

type Combined = { action: Actions; state: GameState };

const initialState: GameState = {
  players: {},
  currentMove: [],
  score: 0
};

const setState = (gameId: string, state: GameState) => {
  return database.ref("games/" + gameId).set(state);
};

const readState = (gameId: string) =>
  database
    .ref("games/" + gameId)
    .once("value")
    .then((snapshot) => snapshot.val() || {}) as Promise<GameState>;

const reducerFunction = (state: GameState, action: Actions) =>
  Actions.match(action, {
    JoinGame: (a) => {
      if (isEmpty(state)) {
        throw new Error(
          `Game does not exist!, You can create a new game if you want.`
        );
      } else {
        return {
          ...state,
          players: { ...state.players, [a.playerName]: { cards: [1, 2, 3] } },
        } as GameState;
      }
    },
    StartGame: (a) => {
      if (!isEmpty(state)) {
        throw new Error(
          "Game already exists!, You can join that game if you want."
        );
      } else {
        return {
          ...initialState,
          players: { [a.playerName]: { cards: [1, 2, 3] } },
        } as GameState;
      }
    },
    PlayCard: (a) => {
      if (isEmpty(state)) {
        throw new Error(`No such game with id: ${a.gameId} exists!`);
      } else {
        return {
          ...state,
          currentMove: state.currentMove ? [...state.currentMove, a.card] : [a.card]
        } as GameState;
      }
    },
    default: (a) => {
      throw new Error(`Unknown Action ${a}`);
    },
  });

export const dispatch = functions.https.onRequest((request, response) =>
  fold(
    (l: HttpResult) => of(response.status(l.statusCode).send(l.payload)),
    (r: Combined) => of(response.send(r))
  )(
    mapLeft<ErrorTypes, HttpResult>(toHttpResult)(
      chain<ErrorTypes, Combined, Combined>((comb) =>
        map<void, Combined>(() => comb)(
          tryCatch(
            () => setState(comb.action.gameId, comb.state),
            (err) => ErrorTypes.UnexpectedError(err as Error)
          )
        )
      )(
        chain<ErrorTypes, Combined, Combined>((comb) =>
          map<GameState, Combined>((state) => ({ ...comb, state }))(
            tryCatchR(
              () => reducerFunction(comb.state, comb.action),
              (err) => ErrorTypes.BadRequest(err)
            )
          )
        )(
          chain<ErrorTypes, Actions, Combined>((action) =>
            map<GameState, Combined>(
              (state) => ({ state, action } as Combined)
            )(
              tryCatch(
                () => readState(action.gameId),
                (err) => ErrorTypes.UnexpectedError(err as Error)
              )
            )
          )(right(request.body))
        )
      )
    )
  )().catch((err) => response.status(500).send(err))
);
