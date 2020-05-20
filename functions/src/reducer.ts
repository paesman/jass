import { isEmpty } from "./utils";
import { left, right } from "fp-ts/lib/Either";
import { ErrorTypes } from "./errortypes";
import { Actions } from "./actions";
import { GameState } from "./state";

const initialState: GameState = {
  players: {},
  currentMove: [],
  score: 0,
};

export const reducerFunction = (state: GameState, action: Actions) =>
  Actions.match(action, {
    JoinGame: (a) =>
      isEmpty(state)
        ? left(
            ErrorTypes.BadRequest(
              new Error(
                `Game does not exist!, You can create a new game if you want.`
              )
            )
          )
        : right({
            ...state,
            players: {
              ...state.players,
              [a.playerName]: { cards: [1, 2, 3] },
            },
          } as GameState),
    StartGame: (a) =>
      !isEmpty(state)
        ? left(
            ErrorTypes.BadRequest(
              new Error(
                `Game ${a.gameId} already exists!, You can join that game if you want.`
              )
            )
          )
        : right({
            ...initialState,
            players: { [a.playerName]: { cards: [1, 2, 3] } },
          } as GameState),
    PlayCard: (a) =>
      isEmpty(state)
        ? left(
            ErrorTypes.BadRequest(
              new Error(`No such game with id: ${a.gameId} exists!`)
            )
          )
        : right({
            ...state,
            currentMove: state.currentMove
              ? [...state.currentMove, a.card]
              : [a.card],
          } as GameState),
    default: (a) =>
      left(ErrorTypes.BadRequest(new Error(`Unknown Action ${a}`))),
  });