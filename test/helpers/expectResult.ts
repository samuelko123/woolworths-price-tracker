import { type Err, type Ok, type Result } from "@/core/result";

export function expectOk<T>(result: Result<T>): asserts result is Ok<T> {
  expect(result.success).toBe(true);
}

export function expectErr<T>(result: Result<T>): asserts result is Err {
  expect(result.success).toBe(false);
}
