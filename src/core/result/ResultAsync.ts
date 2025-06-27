import { err, ok, type Result } from "./Result";

const toError = (e: unknown) => (e instanceof Error ? e : new Error(String(e)));

export class ResultAsync<T> {
  private readonly promise: Promise<Result<T>>;

  constructor(_promise: Promise<Result<T>>) {
    this.promise = _promise;
  }

  static from<T>(promise: Promise<Result<T>>): ResultAsync<T> {
    return new ResultAsync(promise);
  }

  static fromResult<T>(res: Result<T>): ResultAsync<T> {
    return new ResultAsync(Promise.resolve(res));
  }

  static fromPromise<T>(promise: Promise<T>): ResultAsync<T> {
    return new ResultAsync(
      promise
        .then((value) => ok(value))
        .catch((e) => err(toError(e))),
    );
  }

  async toPromise(): Promise<Result<T>> {
    return this.promise;
  }

  static ok<T>(value: T): ResultAsync<T> {
    return new ResultAsync(Promise.resolve(ok(value)));
  }

  static err(error: Error): ResultAsync<never> {
    return new ResultAsync(Promise.resolve(err(error)));
  }

  map<U>(fn: (value: T) => U): ResultAsync<U> {
    return new ResultAsync(
      this.promise.then((result) =>
        result.success ? ok(fn(result.value)) : result,
      ),
    );
  }

  flatMap<U>(fn: (value: T) => ResultAsync<U>): ResultAsync<U> {
    return new ResultAsync(
      this.promise
        .then((result) => {
          return result.success ? fn(result.value).toPromise() : result;
        })
        .catch(err),
    );
  }

  flatMapAsync<U>(fn: (value: T) => Promise<Result<U>>): ResultAsync<U> {
    return this.flatMap((value) => ResultAsync.from(fn(value)));
  }

  tap(fn: (value: T) => void): ResultAsync<T> {
    return new ResultAsync(
      this.promise.then((result) => {
        if (result.success) fn(result.value);
        return result;
      }),
    );
  }
}
