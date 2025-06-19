import { SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { enqueueCategories } from "./enqueueCategories";
import { mockCategory1, mockCategory2 } from "./enqueueCategories.test.data";

vi.mock("@/core/logger");

describe("enqueueCategories", () => {
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
  });

  it("does not send essage to SQS when input is empty array", async () => {
    await enqueueCategories([]);

    expect(sqsMock.calls()).toHaveLength(0);
  });

  it("sends one message to SQS when input contains one category", async () => {
    await enqueueCategories([mockCategory1]);

    expect(sqsMock.calls()).toHaveLength(1);
    expect(sqsMock.call(0).args[0].input).toEqual({
      QueueUrl: process.env.CATEGORY_QUEUE_URL,
      MessageBody: JSON.stringify(mockCategory1),
    });
  });

  it("sends multiple messages to SQS when input contains multiple categories", async () => {
    await enqueueCategories([mockCategory1, mockCategory2]);

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
