export interface Move { playerName: number, card: number; }

export interface GameState {
  players: {
    [playerName: string]: {
      cards: number[],
      team: number
    };
  };
  currentMove?: Move[];
  score?: number;
  error?: string; // TODO: different error types
}
