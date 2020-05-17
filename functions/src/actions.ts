import unionize, { ofType } from 'unionize';

export interface JoinGame {
  gameId: string;
  playerName: string;
}

// const JoinGame = t.type({
//   type: t.literal("JoinGame"),
//   gameId: t.string, // id of the new game, an arbitrary string
//   playerName: t.string, // the player starting the game
// });

export interface StartGame {
  gameId: string;
  playerName: string;
}

// const StartGame = t.type({
//   type: t.literal("StartGame"),
//   gameId: t.string, // an existing game to join
//   playerName: t.string, // the joining player name
// });

export interface PlayCard {
  gameId: string;
  player: string;
  card: number;
}

// const PlayCard = t.type({
//   type: t.literal("PlayCard"),
//   gameId: t.string, // the game id
//   player: t.string, // the player that plays the card
//   card: t.Int, // card id
// });

// type JoinGame = t.TypeOf<typeof JoinGame>;
// type StartGame = t.TypeOf<typeof StartGame>;
// type PlayCard = t.TypeOf<typeof PlayCard>;

// const Actions = t.union([JoinGame, StartGame, PlayCard]);
// type Actions = t.TypeOf<typeof Actions>;

// export { JoinGame, StartGame, PlayCard, Actions };

const Actions = unionize({
  JoinGame: ofType<JoinGame>(),
  StartGame: ofType<StartGame>(),
  PlayCard: ofType<PlayCard>()
});

type Actions = typeof Actions._Union;

export { Actions };
