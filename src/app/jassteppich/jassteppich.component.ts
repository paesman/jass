import { Component, EventEmitter } from '@angular/core';
import { Store } from '../state/store';
import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { Actions } from 'functions/src/actions';
import { GameState } from 'functions/src/state';

@Component({
  selector: 'app-jassteppich',
  templateUrl: './jassteppich.component.html',
  styleUrls: ['./jassteppich.component.css'],
})
export class JassteppichComponent {

  cards$: Observable<number[]>; // The users cards
  model$: Observable<GameState>; // The full state of the Game

  playCardClicked$ = new EventEmitter<number>();

  constructor(private store: Store) {
    this.model$ = this.store.model$;

    this.cards$ = this.store.model$.pipe(
      withLatestFrom(
        this.store.gameInfo$,
        (model, gameInfo) => model.players[gameInfo.playerName].cards
      )
    );

    this.playCardClicked$
      .pipe(
        withLatestFrom(this.store.gameInfo$, (playedCard, gameInfo) => ({
          playedCard,
          gameInfo,
        }))
      )
      .subscribe((context) =>
        this.store.dispatch(
          Actions.PlayCard({
            card: context.playedCard,
            gameId: context.gameInfo.gameId,
            playerName: context.gameInfo.playerName,
          })
        )
      );
  }
}
