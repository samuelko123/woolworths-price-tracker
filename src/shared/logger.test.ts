import { logger } from "./logger";

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls console.info", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});

    logger.info({
      message: "hello",
    });

    expect(spy).toHaveBeenCalledWith({
      message: "hello",
    });
  });

  it("calls console.error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    logger.error({
      message: "something went wrong",
    });

    expect(spy).toHaveBeenCalledWith({
      message: "something went wrong",
    });
  });
});
