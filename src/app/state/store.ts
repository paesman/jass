import { Component, Injectable, EventEmitter } from '@angular/core';
import { Actions } from 'functions/src/actions';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable } from 'rxjs';
import { GameState } from 'shared/state';
import { tap, filter, map, mergeMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/database';

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

@Injectable()
export class Store {
  model$ = new ReplaySubject<GameState>();
  gameId$: Observable<string>;

  action$ = new EventEmitter<Actions>();
  actionDispatched$: Observable<any>;

  constructor(private httpClient: HttpClient) {
    this.gameId$ = this.action$.pipe(
      tap(a => console.log(a)),
      mergeMap((action) =>
        this.httpClient
          .post(
            'https://us-central1-jass-backend.cloudfunctions.net/dispatch',
            action
          )
          .pipe(
            filter(Actions.is.StartGame || Actions.is.JoinGame),
            map(() => action.gameId)
          )
      )
    );

    this.gameId$
      .pipe(
        tap(() => console.log('hfdkjshdkh')),
        tap((id) => database.ref('games/' + id).off()),
        tap((id) =>
          database
            .ref('games/' + id)
            .on('value', (snapshot) => this.model$.next(snapshot.val()))
        )
      )
      .subscribe();
  }

  dispatch(action: Actions) {
    this.action$.emit(action);
  }
}
