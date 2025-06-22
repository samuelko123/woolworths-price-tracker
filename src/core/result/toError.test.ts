import { toError } from "./toError";

describe("toError", () => {
  it("returns the same Error instance if input is already an Error", () => {
    const err = new Error("original error");
    expect(toError(err)).toBe(err);
  });

  it("converts string to Error with the string as message", () => {
    const errorString = "some error message";

    const result = toError(errorString);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(errorString);
  });

  it("converts number to Error with number converted to string", () => {
    const num = 42;

    const result = toError(num);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("42");
  });

  it("converts null to Error with string 'null'", () => {
    const result = toError(null);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("null");
  });

  it("converts undefined to Error with string 'undefined'", () => {
    const result = toError(undefined);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("undefined");
  });

  it("converts an object to Error with stringified message", () => {
    const obj = { foo: "bar" };

    const result = toError(obj);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("[object Object]");
  });
});
