import { Component, EventEmitter } from '@angular/core';
import { Store } from '../state/store';
import { Observable } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';
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
  playerIndex$: Observable<number>;

  playCardClicked$ = new EventEmitter<number>();
  playerIndexNameMap$: Observable<{ [playerIndex: number]: string }>;
  playedCardsMap$: Observable<{ [playerIndex: number]: number }>;

  constructor(private store: Store) {
    this.model$ = this.store.model$;

    this.playerIndexNameMap$ = this.store.model$.pipe(
      map(model =>
        Object.keys(model.players).reduce(
          (acc, curr) => ({ ...acc, [model.players[curr].index]: curr }),
          {} as { [playerIndex: number]: string }
        )
      )
    );

    this.playedCardsMap$ = this.store.model$.pipe(
      map((model) => model.currentMove)
    );

    this.cards$ = this.store.model$.pipe(
      withLatestFrom(this.store.gameInfo$, (model, gameInfo) =>
        Object.keys(model.players[gameInfo.playerName].cards).map(
          (card) => model.players[gameInfo.playerName].cards[card]
        )
      )
    );

    this.playerIndex$ = this.store.gameInfo$.pipe(map(gameInfo => gameInfo.index));

    this.playCardClicked$
      .pipe(
        withLatestFrom(this.store.gameInfo$, (playedCard, gameInfo) => ({
          playedCard,
          gameInfo,
        }))
      )
      .subscribe(context =>
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
