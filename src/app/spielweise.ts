import {Farbe} from "./farbe.enum";
import {Variante} from "./variante.enum";

export interface Spielweise {
  variante: Variante;
  farben: Farbe[];
}
