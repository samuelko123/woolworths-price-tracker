import { toError } from "./toError";

describe("toError", () => {
  it("returns the same error instance if input is an Error", () => {
    const err = new Error("original error");
    const result = toError(err);
    expect(result).toBe(err);
  });

  it("converts a string input into an Error", () => {
    const input = "some error string";
    const result = toError(input);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(input);
  });

  it("converts a number input into an Error with string message", () => {
    const input = 123;
    const result = toError(input);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("123");
  });

  it("converts null into an Error with string 'null'", () => {
    const input = null;
    const result = toError(input);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("null");
  });

  it("converts undefined into an Error with string 'undefined'", () => {
    const input = undefined;
    const result = toError(input);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("undefined");
  });

  it("converts an object into an Error with string '[object Object]'", () => {
    const input = { foo: "bar" };
    const result = toError(input);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("[object Object]");
  });
});
