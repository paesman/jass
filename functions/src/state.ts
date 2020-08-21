export interface Moves { [playerIndex: string]: number; }
export interface Cards { [playerIndex: string]: number }

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
