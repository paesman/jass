import unionize, {ofType} from 'unionize';

export interface JoinGame {
  gameId: string;
  playerName: string;
}

export interface StartGame {
  gameId: string;
  playerName: string;
}

export interface PlayCard {
  gameId: string;
  playerName: string;
  card: number;
}

export interface StartRound {
  gameId: string;
}

const Actions = unionize({
  JoinGame: ofType<JoinGame>(),
  StartGame: ofType<StartGame>(),
  PlayCard: ofType<PlayCard>(),
  StartRound: ofType<StartRound>()
}, { tag: 'type' });

type Actions = typeof Actions._Union;

export { Actions };
