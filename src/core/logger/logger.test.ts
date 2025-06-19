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
});
