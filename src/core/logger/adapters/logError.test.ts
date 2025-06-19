import { logError } from "./logError";

describe("logError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("passes error to console.error with error message and stacktrace", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => { });

    logError(new Error("something went wrong"));

    expect(spy).toHaveBeenCalledWith({
      name: "Error",
      message: "something went wrong",
      stack: expect.any(String),
    });
  });

  it("passes non-error to console.error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => { });

    logError({ hello: "world" });

    expect(spy).toHaveBeenCalledWith({
      hello: "world",
    });
  });
});
