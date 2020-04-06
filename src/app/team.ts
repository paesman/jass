import {Spieler} from './spieler';

export class Team {
  spieler1: Spieler;
  spieler2: Spieler;

  constructor(spieler1: Spieler, spieler2: Spieler) {
    this.spieler1 = spieler1;
    this.spieler2 = spieler2;
  }
}
