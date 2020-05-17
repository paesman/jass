import { mapLeft, tryCatch } from "fp-ts/lib/Either";
import * as t from 'io-ts';
// tslint:disable-next-line: no-duplicate-imports
import { fromEither } from 'fp-ts/lib/TaskEither';
import { ErrorTypes } from "./errortypes";

export const decode = <A, O>(type: t.Type<A, O>) => (i: A) =>
    fromEither(mapLeft(ErrorTypes.DecodeError)(type.decode(i)));

export const tryCatchR = <E, A>(f: () => A, onError: (e: Error) => E) =>
  fromEither(tryCatch(() => f(), err => onError(err as Error)));
