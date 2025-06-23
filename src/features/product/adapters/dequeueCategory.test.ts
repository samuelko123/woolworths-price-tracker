import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers/expectResult";

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

    expectOk(result);
    expect(result.value).toEqual({
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

    expectErr(result);
    expect(result.error.message).toBe("No messages received from the category queue.");
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

    expectOk(result);
    expect(result.value.acknowledge).toBeInstanceOf(Function);

    await result.value.acknowledge();

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

  it("returns error if message body is invalid JSON", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({
      Messages: [
        {
          Body: "not a json",
          ReceiptHandle: "x",
        },
      ],
    });

    const result = await dequeueCategory();

    expectErr(result);
    expect(result.error.message).toMatch(/Invalid JSON string/);
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

    const result = await dequeueCategory();

    expectErr(result);
    expect(result.error.message).toMatch(/unrecognized_keys/);
  });
});
