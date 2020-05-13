import {Farbe} from "./farbe.enum";

export interface Karte {
  name: string;
  farbe: Farbe;
  rang: number;
  wert: number;
  bildName: string;
}
