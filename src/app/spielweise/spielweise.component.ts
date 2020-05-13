import {Component } from '@angular/core';
import { SpielerdatenService } from '../services/spielerdaten.service';
import { Team } from '../team';


interface Model {
  team1: Team;
  team2: Team;
}

@Component({
  selector: 'app-spielweise',
  templateUrl: './spielweise.component.html',
  styleUrls: ['./spielweise.component.css']
})
export class SpielweiseComponent {

  model: Model;

  constructor(private spielerdatenService: SpielerdatenService) {
    this.model = { team1: this.spielerdatenService.Team1, team2: this.spielerdatenService.Team2 };
  }
}
