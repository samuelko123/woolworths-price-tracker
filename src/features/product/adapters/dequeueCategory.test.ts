import { ZodError } from "zod";

import { getEnv } from "@/core/config";
import { err, ok } from "@/core/result";
import { receiveMessage } from "@/core/sqs";
import { expectErr, expectOk } from "@/tests/helpers/expectResult";
import { mockEnvData } from "@/tests/mocks/env.data";

import { dequeueCategory } from "./dequeueCategory";
import { mockCategory } from "./dequeueCategory.test.data";

const mockSqsMessage = {
  body: JSON.stringify(mockCategory),
  acknowledge: vi.fn(),
};

vi.mock("@/core/config");
vi.mock("@/core/sqs");

describe("dequeueCategory", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns ok with category and acknowledge on valid message", async () => {
    vi.mocked(getEnv).mockReturnValue(ok(mockEnvData));
    vi.mocked(receiveMessage).mockResolvedValue(ok(mockSqsMessage));

    const result = await dequeueCategory();

    expectOk(result);
    expect(result.value.category).toEqual(mockCategory);
    expect(result.value.acknowledge).toBeInstanceOf(Function);
  });

  it("returns error if env is invalid", async () => {
    vi.mocked(getEnv).mockReturnValue(err(new Error("Missing env")));

    const result = await dequeueCategory();

    expectErr(result);
    expect(result.error.message).toBe("Missing env");
  });

  it("returns error if receiveMessage fails", async () => {
    vi.mocked(getEnv).mockReturnValue(ok(mockEnvData));
    vi.mocked(receiveMessage).mockResolvedValue(err(new Error("SQS failure")));

    const result = await dequeueCategory();

    expectErr(result);
    expect(result.error.message).toBe("SQS failure");
  });

  it("returns error if category message schema is invalid", async () => {
    vi.mocked(getEnv).mockReturnValue(ok(mockEnvData));

    const invalidMessage = {
      body: "Not a valid JSON",
      acknowledge: vi.fn().mockResolvedValue(undefined),
    };

    vi.mocked(receiveMessage).mockResolvedValue(ok(invalidMessage));

    const result = await dequeueCategory();

    expectErr(result);
    expect(result.error).toBeInstanceOf(ZodError);
    expect(result.error.message).toContain("Invalid JSON string");
  });
});
