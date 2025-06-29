import { type Err, type Result } from "neverthrow";

export function expectErr<T, E>(result: Result<T, E>): asserts result is Err<T, E> {
  expect(result.isErr()).toBe(true);
}
