import { tryCatch } from "fp-ts/lib/Either";
// tslint:disable-next-line: no-duplicate-imports
import { fromEither } from 'fp-ts/lib/TaskEither';

export const tryCatchR = <E, A>(f: () => A, onError: (e: Error) => E) =>
  fromEither(tryCatch(() => f(), err => onError(err as Error)));

export function isEmpty(obj: any) {
    return Object.keys(obj).length === 0;
}
