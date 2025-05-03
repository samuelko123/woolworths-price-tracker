import { mockClient } from "aws-sdk-client-mock";
import { SQSClient } from "@aws-sdk/client-sqs";
import { pushToCategoryQueue } from "./queue";
import { mockCategory1, mockCategory2 } from "./queue.test.data";

describe("pushToCategoryQueue", () => {
  const OLD_ENV = process.env;
  const sqsMock = mockClient(SQSClient);

  beforeEach(() => {
    process.env = { ...OLD_ENV, CATEGORY_QUEUE_URL: "https://mock-queue-url" };
    sqsMock.reset();
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("does not send essage to SQS when input is empty array", async () => {
    await pushToCategoryQueue([]);

    expect(sqsMock.calls()).toHaveLength(0);
  });

  it("sends one message to SQS when input contains one category", async () => {
    await pushToCategoryQueue([mockCategory1]);

    expect(sqsMock.calls()).toHaveLength(1);
    expect(sqsMock.call(0).args[0].input).toEqual({
      QueueUrl: process.env.CATEGORY_QUEUE_URL,
      MessageBody: JSON.stringify(mockCategory1),
    });
  });

  it("sends multiple messages to SQS when input contains multiple categories", async () => {
    await pushToCategoryQueue([mockCategory1, mockCategory2]);

    expect(sqsMock.calls()).toHaveLength(2);
    expect(sqsMock.call(0).args[0].input).toEqual({
      QueueUrl: process.env.CATEGORY_QUEUE_URL,
      MessageBody: JSON.stringify(mockCategory1),
    });
    expect(sqsMock.call(1).args[0].input).toEqual({
      QueueUrl: process.env.CATEGORY_QUEUE_URL,
      MessageBody: JSON.stringify(mockCategory2),
    });
  });
});
