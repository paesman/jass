import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Team} from '../team';
import {Spieler} from '../spieler';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {

  team1: Team;
  team2: Team;

  teamForm = new FormGroup({
    nameSpieler1: new FormControl(''),
    nameSpieler2: new FormControl(''),
    nameSpieler3: new FormControl(''),
    nameSpieler4: new FormControl(''),
  });

  constructor() { }

  onSubmit() {
    let spieler1;
    let spieler2;
    let spieler3;
    let spieler4;

    spieler1 = new Spieler(this.teamForm.get('nameSpieler1').value);
    spieler2 = new Spieler(this.teamForm.get('nameSpieler2').value);
    this.team1 = new Team(spieler1, spieler2);

    spieler3 = new Spieler(this.teamForm.get('nameSpieler3').value);
    spieler4 = new Spieler(this.teamForm.get('nameSpieler4').value);
    this.team2 = new Team(spieler3, spieler4);

    // console.log(this.team1);
    // console.log(this.team2);
  }

}
