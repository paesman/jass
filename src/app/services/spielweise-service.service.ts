import {Injectable} from '@angular/core';
import {Spielweise} from "../spielweise";
import {SPIELWEISEN} from "../mocks/mock-spielweisen";

@Injectable({
  providedIn: 'root'
})
export class SpielweiseServiceService {

  constructor() { }

  getSpielweisen(): Spielweise[] {
    return SPIELWEISEN;
  }
}
