export interface Moves { [playerIndex: number]: number; }
export interface Cards { [playerIndex: number]: number }

export interface GameState {
  players: {
    [playerName: string]: {
      cards: Cards;
      team: number;
      index: number;
    };
  };
  currentMove?: Moves;
  score?: number;
  error?: string; // TODO: different error types
}
