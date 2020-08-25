import {EventEmitter, Injectable, NgZone} from '@angular/core';
import {Actions} from 'functions/src/actions';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs';
import {distinctUntilChanged, filter, map, mergeMap, publishReplay, refCount, tap} from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/database';
import {GameState} from 'functions/src/state';

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

interface Result { action: Actions; state: GameState; }

export interface GameInfo { gameId: string; playerName: string; team: number; index: number; }

@Injectable()
export class Store {
  model$ = new ReplaySubject<GameState>(1);
  gameInfo$: Observable<GameInfo>;

  action$ = new EventEmitter<Actions>();
  actionDispatched$: Observable<any>;

  constructor(private httpClient: HttpClient, private ngZone: NgZone) {
    this.gameInfo$ = this.action$.pipe(
      mergeMap((action) =>
        this.httpClient
          .post<Result>(
             'https://us-central1-jass-backend.cloudfunctions.net/dispatch',
            // 'http://localhost:5001/jass-backend/us-central1/dispatch',
            action
          )
          .pipe(
            // map((result) => result.action),
            filter((result) => Actions.is.JoinGame(result.action) || Actions.is.StartGame(result.action)),
            map((result: any) => ({
              gameId: result.action.gameId,
              playerName: result.action.playerName,
              team: result.state.players[result.action.playerName].team,
              index: result.state.players[result.action.playerName].index
            })),
            distinctUntilChanged((prev, next) => prev === next)
          )
      ),
      publishReplay(1), refCount()
    );

    this.gameInfo$
      .pipe(
        tap((info) =>
          database
            .ref('games/' + info.gameId)
            .off()
        ),
        tap((info) =>
          database
            .ref('games/' + info.gameId)
            .on('value', (snapshot) => this.ngZone.run(() => this.model$.next(snapshot.val())))
        )
      ).subscribe();


    this.model$.subscribe(x => console.log(x));
  }

  dispatch(action: Actions) {
    this.action$.emit(action);
  }
}
