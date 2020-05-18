export interface GameState {
  players?: {
    [playerId: string]: {
      cards: number[];
    };
  };
  currentMove?: number[];
  score?: number;
  error?: string; // TODO: different error types
}
