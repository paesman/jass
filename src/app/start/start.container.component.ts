import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Actions } from 'functions/src/actions';
import { Store } from '../state/store';


interface Model {
  gameId: string;
  playerName: string;
}

@Component({
  templateUrl: './start.container.component.html',
  selector: 'app-start',
})
export class StartContainerComponent {

  startForm: FormGroup;

  constructor(private store: Store, private builder: FormBuilder) {
    this.startForm = this.builder.group({
      gameId: this.builder.control('', [Validators.required]),
      playerName: this.builder.control('', [Validators.required])
    });
  }

  joinGame() {
    this.store.dispatch(Actions.JoinGame(this.startForm.value));
  }

  startGame() {
    this.store.dispatch(Actions.StartGame(this.startForm.value));
  }
}
