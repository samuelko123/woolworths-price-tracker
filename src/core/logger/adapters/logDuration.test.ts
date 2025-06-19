import { logDuration } from "./logDuration";

describe("logDuration", () => {
  const label = "testFunction";
  const fakeResult = 42;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("logs start and finish messages with label and duration", async () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => { });
    const fn = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return fakeResult;
    });

    const promise = logDuration(label, fn);
    vi.advanceTimersByTime(100);
    const result = await promise;

    expect(result).toBe(fakeResult);
    expect(fn).toHaveBeenCalledOnce();

    const calls = spy.mock.calls;
    expect(calls).toHaveLength(2);
    expect(calls[0][0]).toEqual(
      {
        message: "Function started.",
        label,
      },
    );
    expect(calls[1][0]).toEqual(
      expect.objectContaining({
        message: "Function finished.",
        label,
        duration: 100,
      }),
    );
  });

  it("propagates errors from the inner function", async () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => { });

    const error = new Error("fail");
    const fn = vi.fn(async () => {
      throw error;
    });

    await expect(logDuration(label, fn)).rejects.toThrow(error);

    expect(spy).toHaveBeenCalledWith({
      message: "Function started.",
      label,
    });
  });
});
