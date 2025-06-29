import { errAsync, ResultAsync } from "neverthrow";

import { toError } from "@/core/error";
import { expectErr, expectOk } from "@/tests/helpers";

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

    const delayedPromise = new Promise((resolve) => setTimeout(() => resolve(fakeResult), 100));
    const fn = vi.fn(() => ResultAsync.fromPromise(delayedPromise, toError));

    const promise = logDuration(label, fn);
    vi.advanceTimersByTime(100);
    const result = await promise;

    expect(fn).toHaveBeenCalledOnce();

    expectOk(result);
    expect(result.value).toBe(fakeResult);

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

  it("returns errors from the inner function", async () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => { });

    const error = new Error("fail");
    const fn = vi.fn(() => errAsync(error));

    const result = await logDuration(label, fn);

    expectErr(result);
    expect(result.error).toBe(error);

    expect(spy).toHaveBeenCalledWith({
      message: "Function started.",
      label,
    });
  });
});
