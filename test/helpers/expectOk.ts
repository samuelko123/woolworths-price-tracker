import type { Ok, Result } from "neverthrow";

export function expectOk<T, E>(result: Result<T, E>): asserts result is Ok<T, E> {
  expect(result.isOk()).toBe(true);
}
