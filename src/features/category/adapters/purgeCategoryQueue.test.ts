import { PurgeQueueCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { purgeCategoryQueue } from "./purgeCategoryQueue";

vi.mock("@/core/logger");

describe("purgeCategoryQueue", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    process.env = { ...OLD_ENV, CATEGORY_QUEUE_URL: "https://mock-queue-url" };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
    sqsMock.callsFake(() => {
      return Promise.resolve({ $metadata: { httpStatusCode: 200 } });
    });
  });

  it("purges the SQS queue", async () => {
    await purgeCategoryQueue();

    const calls = sqsMock.calls();
    expect(calls).toHaveLength(1);

    expect(calls[0].args[0]).toBeInstanceOf(PurgeQueueCommand);
    expect(sqsMock.call(0).args[0].input).toEqual({
      QueueUrl: process.env.CATEGORY_QUEUE_URL,
    });
  });
});
