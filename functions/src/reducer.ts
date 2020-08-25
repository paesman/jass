import {isEmpty} from "./utils";
import {left, right} from "fp-ts/lib/Either";
import {ErrorTypes} from "./errortypes";
import {Actions} from "./actions";
import {GameState, Player} from "./state";

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

const distributeCards = (players: { [playerName: string]: Player }) => {
  const cards = shuffleCards(createCards(36));
  return Object.keys(players).reduce((acc, playerName) => {
    return {...acc, [playerName]: {...players[playerName], cards: cards.splice(0, 9)}};
  }, {} as { [playerName: string]: Player })
}

const initialState: GameState = {
  players: {},
  currentMove: {},
  score: 0,
  status: 'initial'
};

export const reducerFunction = (state: GameState, action: Actions) =>
  Actions.match(action, {
    StartRound: (a) =>
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
          players: distributeCards(state.players)
        } as GameState),
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
            status: Object.values(state.players).length === 3 ? 'gameReady' : 'gameCreated',
            players: {
              ...state.players,
              [a.playerName]: {
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
