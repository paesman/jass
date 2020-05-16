import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SpielerdatenService} from '../services/spielerdaten.service';
import {Team} from '../team';
import {Router} from '@angular/router';

export interface Model {
  nameSpieler1: string;
  nameSpieler2: string;
  nameSpieler3: string;
  nameSpieler4: string;
}

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {

  teamForm: FormGroup;

  constructor(private builder: FormBuilder, private spielerdaten: SpielerdatenService, private router: Router) {
    this.teamForm = builder.group({
      nameSpieler1: builder.control('', [Validators.required]),
      nameSpieler2: builder.control('', [Validators.required]),
      nameSpieler3: builder.control('', [Validators.required]),
      nameSpieler4: builder.control('', [Validators.required]),
    })
  }

  onSubmit() {
    // console.log('on submit');
    const model: Model = this.teamForm.value;
    // console.log(this.teamForm.value);
    this.spielerdaten.Team1 = { spieler1: { name: model.nameSpieler1 }, spieler2: { name: model.nameSpieler2 } } as Team;
    this.spielerdaten.Team2 = { spieler1: { name: model.nameSpieler3 }, spieler2: { name: model.nameSpieler4 } } as Team;

    this.router.navigate(['/jassteppich']);
  }
}

