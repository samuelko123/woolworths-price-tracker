import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
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
});
