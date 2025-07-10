import { errAsync, okAsync } from "neverthrow";

import { getCategoryQueueUrl } from "@/core/config";
import { purgeQueue } from "@/gateways/sqs";
import { expectErr, expectOk } from "@/tests/helpers";

import { purgeCategoryQueue } from "./purgeCategoryQueue";

vi.mock("@/gateways/sqs");
vi.mock("@/core/config");

describe("purgeCategoryQueue", () => {
  const queueUrl = "https://test-queue-url";

  beforeEach(() => {
    vi.mocked(getCategoryQueueUrl).mockReturnValue(okAsync(queueUrl));
    vi.clearAllMocks();
  });

  it("calls PurgeQueue once", async () => {
    vi.mocked(purgeQueue).mockReturnValue(okAsync());

    const result = await purgeCategoryQueue();

    expectOk(result);
    expect(purgeQueue).toHaveBeenCalledTimes(1);
  });

  it("returns error if PurgeQueue fails", async () => {
    const error = new Error("Purge failed");
    vi.mocked(purgeQueue)
      .mockReturnValueOnce(errAsync(error));

    const result = await purgeCategoryQueue();

    expectErr(result);
    expect(result.error).toEqual(error);
  });
});
