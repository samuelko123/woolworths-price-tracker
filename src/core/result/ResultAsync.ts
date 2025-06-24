import { err, ok, type Result } from "./Result";

export class ResultAsync<T> {
  constructor(private readonly promise: Promise<Result<T>>) { }

  static from<T>(promise: Promise<Result<T>>): ResultAsync<T> {
    return new ResultAsync(promise);
  }

  static fromResult<T>(res: Result<T>): ResultAsync<T> {
    return new ResultAsync(Promise.resolve(res));
  }

  static ok<T>(value: T): ResultAsync<T> {
    return new ResultAsync(Promise.resolve(ok(value)));
  }

  static err(error: Error): ResultAsync<never> {
    return new ResultAsync(Promise.resolve(err(error)));
  }

  async unwrap(): Promise<Result<T>> {
    return this.promise;
  }

  flatMap<U>(fn: (value: T) => ResultAsync<U>): ResultAsync<U> {
    return new ResultAsync(
      this.promise
        .then((result) =>
          result.success ? fn(result.value).unwrap() : result,
        )
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
