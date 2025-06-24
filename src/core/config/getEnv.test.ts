import { ZodError } from "zod";

import { expectErr, expectOk } from "@/tests/helpers/expectResult";
import { mockEnvData } from "@/tests/mocks/env.data";

import { getEnv, resetEnvCache } from "./getEnv";

describe("getEnv", () => {
  beforeEach(() => {
    resetEnvCache();
  });

  it("returns parsed env vars", () => {
    process.env.AWS_REGION = mockEnvData.AWS_REGION;
    process.env.CATEGORY_QUEUE_URL = mockEnvData.CATEGORY_QUEUE_URL;

    const result = getEnv();

    expectOk(result);
    expect(result.value).toEqual(mockEnvData);
  });

  it("returns error if required env var is missing", () => {
    delete process.env.AWS_REGION;

    const result = getEnv();

    expectErr(result);
    expect(result.error).toBeInstanceOf(ZodError);
    expect(result.error.message).toMatch(/AWS_REGION/);
  });

  it("return cached result on next call", () => {
    process.env.NODE_ENV = "test";
    process.env.AWS_REGION = mockEnvData.AWS_REGION;
    process.env.CATEGORY_QUEUE_URL = mockEnvData.CATEGORY_QUEUE_URL;

    const first = getEnv();
    process.env.AWS_REGION = "https://should-not-be-used";
    const second = getEnv();

    expectOk(first);
    expectOk(second);
    expect(second.value.AWS_REGION).toBe(first.value.AWS_REGION);
    expect(second.value.AWS_REGION).not.toBe("https://should-not-be-used");
  });
});
