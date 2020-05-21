import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { Actions } from 'functions/src/actions';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable } from 'rxjs';
import { tap, filter, map, mergeMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { GameState } from 'functions/src/state';

const firebaseConfig = {
  apiKey: 'AIzaSyB8rdKbdHnLZVAkET8-W_bKDhszxnDdqWc',
  authDomain: 'jass-backend.firebaseapp.com',
  databaseURL: 'https://jass-backend.firebaseio.com',
  projectId: 'jass-backend',
  storageBucket: 'jass-backend.appspot.com',
  messagingSenderId: '926115738920',
  appId: '1:926115738920:web:9805a30cfe99d482478c1d',
  measurementId: 'G-TK494GR1GM',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Get a reference to the database service
const database = firebase.database();

interface Result { action: Actions; state: GameState };

@Injectable()
export class Store {
  model$ = new ReplaySubject<GameState>(1);
  gameId$: Observable<string>;

  action$ = new EventEmitter<Actions>();
  actionDispatched$: Observable<any>;

  constructor(private httpClient: HttpClient, private ngZone: NgZone) {
    this.gameId$ = this.action$.pipe(
      mergeMap((action) =>
        this.httpClient
          .post<Result>(
            'https://us-central1-jass-backend.cloudfunctions.net/dispatch',
            action
          )
          .pipe(
            map((result) => result.action),
            filter((a) => Actions.is.JoinGame(a) || Actions.is.StartGame(a)),
            map(() => action.gameId),
          )
      )
    );

    this.gameId$
      .pipe(
        tap((id) =>
          database
            .ref('games/' + id)
            .off('value', (snapshot) => this.ngZone.run(() => this.model$.next(snapshot.val())))
        ),
        tap((id) =>
          database
            .ref('games/' + id)
            .on('value', (snapshot) => this.ngZone.run(() => this.model$.next(snapshot.val())))
        )
      )
      .subscribe();
  }

  dispatch(action: Actions) {
    this.action$.emit(action);
  }
}
