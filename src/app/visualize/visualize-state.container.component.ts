import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '../state/store';
import { Observable } from 'rxjs';
import { GameState } from 'functions/src/state';

@Component({
  selector: 'app-viualize-state',
  template: `
    <div>GameState</div>
    <div *ngIf="model$ | async; let model">{{ model | json }}</div>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualizeStateComponent {

  model$: Observable<GameState>;

  constructor(private store: Store) {
    this.model$ = this.store.model$;
  }
}
