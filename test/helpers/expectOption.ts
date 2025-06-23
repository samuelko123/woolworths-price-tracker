import { isEmpty, isPresent, type Option } from "@/core/option";

export function expectPresent<T>(opt: Option<T>): asserts opt is { kind: "some"; value: T } {
  expect(isPresent(opt)).toBe(true);
}

export function expectEmpty<T>(opt: Option<T>): asserts opt is { kind: "none" } {
  expect(isEmpty(opt)).toBe(true);
}
