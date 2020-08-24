import { isEmpty } from "./utils";
import { left, right } from "fp-ts/lib/Either";
import { ErrorTypes } from "./errortypes";
import { Actions } from "./actions";
import { GameState } from "./state";

const nextPlayerIndex = (state: GameState) =>
  Math.max(
    ...Object.keys(state.players).map(
      (playerName) => state.players[playerName].index
    )
  ) + 1;

const assignTeam = (index: number) => (index % 2 ? 2 : 1);

const shuffleCards = (cards: number[]) => {
  for(let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = cards[i]
    cards[i] = cards[j]
    cards[j] = temp
  }
  return cards;
}

const createCards = (count: number) => {
  const sequence = [];
  for(let i = 1; i <= count; i++) {
    sequence.push(i);
  }
  return sequence;
}

const initialState: GameState = {
  players: {},
  currentMove: {},
  score: 0,
  cards: shuffleCards(createCards(36))
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
              [a.playerName]: {
                cards: state.cards.slice(nextPlayerIndex(state)*9, nextPlayerIndex(state)*9+8),
                team: assignTeam(nextPlayerIndex(state)),
                index: nextPlayerIndex(state),
              },
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
            players: {
              [a.playerName]: {
                cards: state.cards.slice(0, 8),
                team: 1,
                index: 0,
              },
            },
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
              ? {
                  ...state.currentMove,
                  [state.players[a.playerName].index]: a.card,
                }
              : { [state.players[a.playerName].index]: a.card },
            players: {
              ...state.players,
              [a.playerName]: {
                ...state.players[a.playerName],
                cards: {
                  ...Object.keys(state.players[a.playerName].cards).reduce(
                    (acc, curr) => {
                      return state.players[a.playerName].cards[
                        parseInt(curr)
                      ] === a.card
                        ? { ...acc }
                        : {
                            ...acc,
                            [curr]:
                              state.players[a.playerName].cards[parseInt(curr)],
                          };
                    },
                    {}
                  ),
                },
              },
            },
          } as GameState),
    default: (a) =>
      left(ErrorTypes.BadRequest(new Error(`Unknown Action ${a}`))),
  });
