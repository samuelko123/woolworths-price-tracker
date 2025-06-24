export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  readonly success = true;
  readonly value: T;

  constructor(readonly _value: T) {
    this.value = _value;
  }

  flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    return fn(this.value);
  }
}

export class Err {
  readonly success = false;

  constructor(readonly error: Error) { }

  flatMap(): Err {
    return this;
  }
}

export function ok<T>(value: T): Result<T> {
  return new Ok(value);
}

export function err(error: Error): Result<never> {
  return new Err(error);
}

export function tryCatch<T>(fn: () => Promise<T> | T): Promise<Result<T>> {
  return Promise.resolve()
    .then(fn)
    .then(ok)
    .catch((e) => err(e));
}
