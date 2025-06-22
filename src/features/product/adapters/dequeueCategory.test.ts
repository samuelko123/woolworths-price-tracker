import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { dequeueCategory } from "./dequeueCategory";

describe("dequeueCategory", () => {
  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
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

    const result = await dequeueCategory();

    expect(result).toEqual({
      acknowledge: expect.any(Function),
      category: {
        id: "123",
        displayName: "Fruit",
        urlName: "fruit",
      },
    });
  });

  it("returns null if no messages are returned", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({
      Messages: [],
    });

    const result = await dequeueCategory();

    expect(result).toBeNull();
  });

  it("deletes the message when acknowledge is called", async () => {
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
    sqsMock.on(DeleteMessageCommand).resolves({});

    const result = await dequeueCategory();
    expect(result).not.toBeNull();
    expect(result?.acknowledge).toBeInstanceOf(Function);

    await result!.acknowledge();

    const calls = sqsMock.calls();
    expect(calls).toHaveLength(2);

    expect(calls[0].args[0]).toBeInstanceOf(ReceiveMessageCommand);
    expect(calls[1].args[0]).toBeInstanceOf(DeleteMessageCommand);
    expect(calls[1].args[0]).toEqual(
      expect.objectContaining({
        input: {
          QueueUrl: process.env.CATEGORY_QUEUE_URL,
          ReceiptHandle: "abc-receipt",
        },
      }),
    );

  });

  it("returns null if message is missing Body", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({
      Messages: [
        {
          Body: undefined,
          ReceiptHandle: "abc-receipt",
        },
      ],
    });

    const result = await dequeueCategory();

    expect(result).toBeNull();
  });

  it("returns null if message is missing ReceiptHandle", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({
      Messages: [
        {
          Body: "Hello, world!",
          ReceiptHandle: undefined,
        },
      ],
    });

    const result = await dequeueCategory();

    expect(result).toBeNull();
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

    await expect(dequeueCategory()).rejects.toThrow();
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

    await expect(dequeueCategory()).rejects.toThrow();
  });
});
