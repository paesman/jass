import { unionize, ofType } from "unionize";

export const ErrorTypes = unionize({
  BadRequest: ofType<Error>(),
  UnexpectedError: ofType<Error>()
}, {
  tag: "tag",
  value: "payload"
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
    BadRequest: (e) => BadRequest(`Action is not valid! ${e.message}`)
  });
