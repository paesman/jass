export interface Move { playerName: number, card: number; }

export interface GameState {
  players: {
    [playerName: string]: {
      cards: number[]
    };
  };
  currentMove?: Move[];
  score?: number;
  error?: string; // TODO: different error types
}
