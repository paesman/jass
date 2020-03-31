import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {

  teamForm = new FormGroup({
    nameSpieler1: new FormControl(''),
    nameSpieler2: new FormControl(''),
    nameSpieler3: new FormControl(''),
    nameSpieler4: new FormControl(''),
  });

  constructor() { }

  onSubmit() {
    console.log(this.teamForm.value);
  }

}
