import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { deleteFromCategoryQueue, pullFromCategoryQueue, purgeCategoryQueue, pushToCategoryQueue } from "./category";
import { mockCategory1, mockCategory2 } from "./category.test.data";

vi.mock("@/logger");

describe("purgeCategoryQueue", () => {
  const OLD_ENV = process.env;
  const sqsMock = mockClient(SQSClient);

  beforeEach(() => {
    process.env = { ...OLD_ENV, CATEGORY_QUEUE_URL: "https://mock-queue-url" };
    sqsMock.reset();
    sqsMock.callsFake(() => {
      return Promise.resolve({ $metadata: { httpStatusCode: 200 } });
    });
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("purges the SQS queue", async () => {
    await purgeCategoryQueue();
    expect(sqsMock.calls()).toHaveLength(1);
    expect(sqsMock.call(0).args[0].input).toEqual({
      QueueUrl: process.env.CATEGORY_QUEUE_URL,
    });
  });
});

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

describe("pullFromCategoryQueue", () => {
  const OLD_ENV = process.env;
  const sqsMock = mockClient(SQSClient);

  beforeEach(() => {
    process.env = { ...OLD_ENV, CATEGORY_QUEUE_URL: "https://mock-queue-url" };
    sqsMock.reset();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("pulls and parses a message", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({
      Messages: [
        {
          Body: JSON.stringify({
            id: "123",
            displayName: "Fruit",
            urlName: "fruit",
          }),
          ReceiptHandle: "abc-receipt",
        },
      ],
    });

    const result = await pullFromCategoryQueue();

    expect(result).toEqual({
      category: {
        id: "123",
        displayName: "Fruit",
        urlName: "fruit",
      },
      handle: "abc-receipt",
    });
  });

  it("returns null if no messages are returned", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({
      Messages: [],
    });

    const result = await pullFromCategoryQueue();

    expect(result).toBeNull();
  });

  it("throws if message is missing Body", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({
      Messages: [
        {
          Body: undefined,
          ReceiptHandle: "abc-receipt",
        },
      ],
    });

    await expect(pullFromCategoryQueue()).rejects.toThrow(
      "Received message does not contain Body or ReceiptHandle.",
    );
  });

  it("throws if message is missing ReceiptHandle", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({
      Messages: [
        {
          Body: "Hello, world!",
          ReceiptHandle: undefined,
        },
      ],
    });

    await expect(pullFromCategoryQueue()).rejects.toThrow(
      "Received message does not contain Body or ReceiptHandle.",
    );
  });

  it("throws if message body is invalid JSON", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({
      Messages: [
        {
          Body: "not a json",
          ReceiptHandle: "x",
        },
      ],
    });

    await expect(pullFromCategoryQueue()).rejects.toThrow();
  });

  it("throws if message body fails schema validation", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({
      Messages: [
        {
          Body: JSON.stringify({ it: "is not a valid category" }),
          ReceiptHandle: "x",
        },
      ],
    });

    await expect(pullFromCategoryQueue()).rejects.toThrow();
  });
});

describe("deleteFromCategoryQueue", () => {
  const OLD_ENV = process.env;
  const sqsMock = mockClient(SQSClient);

  beforeEach(() => {
    process.env = { ...OLD_ENV, CATEGORY_QUEUE_URL: "https://mock-queue-url" };
    sqsMock.reset();
    sqsMock.on(DeleteMessageCommand).resolves({});
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("calls SQS DeleteMessageCommand", async () => {
    const handle = "mock-receipt-handle";

    await deleteFromCategoryQueue(handle);

    const calls = sqsMock.calls();
    expect(calls).toHaveLength(1);

    expect(calls[0].args[0]).toBeInstanceOf(DeleteMessageCommand);
    expect(calls[0].args[0]).toEqual(
      expect.objectContaining({
        input: {
          QueueUrl: process.env.CATEGORY_QUEUE_URL,
          ReceiptHandle: handle,
        },
      }),
    );
  });
});
