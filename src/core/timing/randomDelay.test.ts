import { randomDelay } from "./randomDelay";

describe("randomDelay", () => {
  it("resolves after a delay between min and max", async () => {
    const min = 50;
    const max = 100;

    const start = Date.now();
    await randomDelay({ min, max });
    const duration = Date.now() - start;

    expect(duration).toBeGreaterThanOrEqual(min);
    expect(duration).toBeLessThanOrEqual(max + 20); // allow some overhead
  });
});
