import { randomDelay } from "./randomDelay";

describe("randomDelay with fake timers and spy", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each`
    mathRandom | min   | max    | expected
    ${0}       | ${50} | ${100} | ${50}
    ${0.5}     | ${50} | ${100} | ${75}
    ${1}       | ${50} | ${100} | ${100}
  `(
    "resolves after $expected ms when Math.random returns $mathRandom",
    async ({ mathRandom, min, max, expected }) => {
      vi.spyOn(Math, "random").mockReturnValue(mathRandom);

      const spy = vi.fn();
      const promise = randomDelay({ min, max }).then(spy);

      vi.advanceTimersByTime(expected);
      await promise;

      expect(spy).toHaveBeenCalled();
    },
  );
});
