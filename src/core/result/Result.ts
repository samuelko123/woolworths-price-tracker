export type Result<T> = Ok<T> | Err;

export class Ok<T> {
  readonly success = true;
  readonly value: T;

  constructor(_value: T) {
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

export const ok = <T>(value: T): Result<T> => new Ok(value);

export const err = (error: Error): Result<never> => new Err(error);
