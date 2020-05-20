import * as functions from "firebase-functions";
import { GameState } from "./state";
import * as cors from "cors";
const corsHandler = cors({ origin: true });

import { Actions } from "./actions";
// tslint:disable-next-line: no-duplicate-imports
import {
  chain,
  tryCatch,
  map,
  right,
  mapLeft,
  fold,
  fromEither,
} from "fp-ts/lib/TaskEither";
import { ErrorTypes, toHttpResult, HttpResult } from "./errortypes";

import { of } from "fp-ts/lib/Task";
import { setState, readState } from "./database";
import { reducerFunction } from "./reducer";

type Combined = { action: Actions; state: GameState };

export const dispatch = functions.https.onRequest((request, response) =>
  corsHandler(request, response, () =>
    fold(
      (l: HttpResult) => of(response.status(l.statusCode).send(l.payload)),
      (r: Combined) => of(response.send(r))
    )(
      mapLeft<ErrorTypes, HttpResult>((err) => toHttpResult(err))(
        chain<ErrorTypes, Combined, Combined>((comb) =>
          map<void, Combined>(() => comb)(
            tryCatch(
              () => setState(comb.action.gameId, comb.state),
              (err) => ErrorTypes.UnexpectedError(err as Error)
            )
          )
        )(
          chain<ErrorTypes, Combined, Combined>((comb) =>
            map<GameState, Combined>((state) => ({ ...comb, state }))(
              fromEither(reducerFunction(comb.state, comb.action))
            )
          )(
            chain<ErrorTypes, Actions, Combined>((action) =>
              map<GameState, Combined>(
                (state) => ({ state, action } as Combined)
              )(
                tryCatch(
                  () => readState(action.gameId),
                  (err) => ErrorTypes.UnexpectedError(err as Error)
                )
              )
            )(right(request.body))
          )
        )
      )
    )().catch((err) => response.status(500).send(err))
  )
);
