import {Spielweise} from "../spielweise";
import {Variante} from "../variante.enum";
import {Farbe} from "../farbe.enum";


export const SPIELWEISEN: Spielweise[] = [
  {variante: Variante.Trumpf, farben: [Farbe.Ecke, Farbe.Herz, Farbe.Kreuz, Farbe.Schaufel]},
  {variante: Variante.Obeabe, farben: [Farbe.Ecke, Farbe.Herz, Farbe.Kreuz, Farbe.Schaufel]},
  {variante: Variante.Ungeufe, farben: [Farbe.Ecke, Farbe.Herz, Farbe.Kreuz, Farbe.Schaufel]}
];
