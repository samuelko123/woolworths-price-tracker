import { mockEnvData } from "@/tests/mocks/env.data";

import { getEnv, resetEnvCache } from "./getEnv";

describe("getEnv", () => {
  beforeEach(() => {
    resetEnvCache();
  });

  it("returns parsed env vars", () => {
    const env = getEnv();

    expect(env).toEqual({
      NODE_ENV: "test",
      ...mockEnvData,
    });
  });

  it("throws if required env var is missing", () => {
    delete process.env.AWS_REGION;

    expect(() => getEnv()).toThrow();
  });

  it("uses cached value after first call", () => {
    const first = getEnv();
    process.env.AWS_REGION = "https://should-not-be-used";
    const second = getEnv();

    expect(second).toBe(first); // Same object reference
    expect(second.AWS_REGION).toBe(first.AWS_REGION);
  });
});
