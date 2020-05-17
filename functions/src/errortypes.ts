import { PathReporter } from "io-ts/lib/PathReporter";
import { left } from "fp-ts/lib/Either";
import { tryCatch, getOrElse } from "fp-ts/lib/Option";
import { unionize, ofType } from "unionize";
import { Errors } from "io-ts";

export const ErrorTypes = unionize({
  UnexpectedError: ofType<Error>(),
  DecodeError: ofType<Errors>(),
});

export type ErrorTypes = typeof ErrorTypes._Union;

export type HttpResult = {
  statusCode: number;
  payload?: string | any;
};

export const BadRequest = (reason: string) =>
  ({
    statusCode: 400,
    payload: reason,
  } as HttpResult);

export const InternalServerError = (error: any) =>
  ({
    statusCode: 500,
    payload: error,
  } as HttpResult);

export const toHttpResult = (error: ErrorTypes) =>
  ErrorTypes.match(error, {
    UnexpectedError: (e) => InternalServerError(e),
    DecodeError: (e) =>
      BadRequest(
        `Input contract is not valid!: ${getOrElse(() => "malformed request")(
          tryCatch(() => PathReporter.report(left(e)).join("\n"))
        )}`
      ),
  });
