import { type Result } from "@/core/result";

export function expectOk<T, E>(result: Result<T, E>): asserts result is { success: true; value: T } {
  expect(result.success).toBe(true);
}

export function expectErr<T, E>(result: Result<T, E>): asserts result is { success: false; error: E } {
  expect(result.success).toBe(false);
}
