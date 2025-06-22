import { toError } from "./toError";

export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ success: true, value });

export const err = <E = Error>(error: E | unknown): Result<never, Error> => ({
  success: false,
  error: toError(error),
});
