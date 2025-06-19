import { logger } from "./logger";

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls console.info with string", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => { });

    logger.info("hello world");

    expect(spy).toHaveBeenCalledWith({
      message: "hello world",
    });
  });

  it("calls console.info with object", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => { });

    logger.info({
      message: "hello",
    });

    expect(spy).toHaveBeenCalledWith({
      message: "hello",
    });
  });

  it("passes an error to console.error with error message and stacktrace", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => { });

    logger.error(new Error("something went wrong"));

    expect(spy).toHaveBeenCalledWith({
      name: "Error",
      message: "something went wrong",
      stack: expect.any(String),
    });
  });

  it("passes an object to console.error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => { });

    logger.error({ hello: "world" });

    expect(spy).toHaveBeenCalledWith({
      hello: "world",
    });
  });

  it("passes a string to console.error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => { });

    logger.error("something went wrong");

    expect(spy).toHaveBeenCalledWith("something went wrong");
  });

  it("passes a number to console.error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => { });

    logger.error(123);

    expect(spy).toHaveBeenCalledWith(123);
  });
});
