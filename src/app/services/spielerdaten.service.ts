import {Injectable} from '@angular/core';
import {Team} from 'src/app/team';
import {Spielweise} from "../spielweise";


@Injectable({
  providedIn: 'root'
})
export class SpielerdatenService {

  Team1: Team;
  Team2: Team;

  Spielweise: Spielweise;

}
