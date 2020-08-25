export interface Moves { [index: number]: number; }
export interface Cards { [index: number]: number }

export interface Player {
  cards: Cards;
  team: number;
  index: number;
}

export interface GameState {
  players: {
    [playerName: string]: Player
  };
  currentMove?: Moves;
  cards?: number[]
  score?: number;
  status: 'gameReady' | 'gameCreated' | 'initial';
  error?: string; // TODO: different error types
}
