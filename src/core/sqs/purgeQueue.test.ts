import { PurgeQueueCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers";

import { purgeQueue } from "./purgeQueue";

describe("purgeQueue", () => {
  const queueUrl = "https://mock-queue-url";

  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
    sqsMock.callsFake(() => {
      return Promise.resolve({});
    });
  });

  it("sends a PurgeQueueCommand", async () => {
    const queueUrl = "https://mock-queue-url";

    const reuslt = await purgeQueue(queueUrl);

    expectOk(reuslt);

    const calls = sqsMock.calls();
    expect(calls).toHaveLength(1);

    expect(calls[0].args[0]).toBeInstanceOf(PurgeQueueCommand);
    expect(sqsMock.call(0).args[0].input).toEqual({
      QueueUrl: queueUrl,
    });
  });

  it("returns error if PurgeQueueCommand fails", async () => {
    sqsMock.on(PurgeQueueCommand).rejects(new Error("Purge failed"));

    const reuslt = await purgeQueue(queueUrl);

    expectErr(reuslt);
    expect(reuslt.error.message).toBe("Purge failed");
  });
});
