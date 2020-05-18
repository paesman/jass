import {Injectable} from '@angular/core';
import {Karte} from "../karte";
import {KARTEN} from "../mocks/mock-karten";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class KartenService {

  constructor() { }

  getSpielerKarten(): Observable<Karte[]> {
    return of(KARTEN);
  }
}
