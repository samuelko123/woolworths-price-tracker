import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers/expectResult";

import {
  MESSAGE_MISSING_BODY,
  MESSAGE_MISSING_RECEIPT_HANDLE,
  NO_MESSAGES,
  RESPONSE_MISSING_MESSAGES,
} from "./errors";
import { receiveMessage } from "./receiveMessage";

describe("receiveMessage", () => {
  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
  });

  it("returns a valid message with acknowledge function", async () => {
    const mockMessage = {
      Body: "test",
      ReceiptHandle: "abc123",
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [mockMessage] });

    const result = await receiveMessage("https://test-queue");

    expectOk(result);
    expect(result.value.body).toBe("test");
    expect(result.value.acknowledge).toBeTypeOf("function");
  });

  it("calls DeleteMessageCommand when acknowledge function is called", async () => {
    const mockMessage = {
      Body: "test",
      ReceiptHandle: "abc123",
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [mockMessage] });
    sqsMock.on(DeleteMessageCommand).resolves({});

    const result = await receiveMessage("https://test-queue");
    expectOk(result);

    await result.value.acknowledge();

    // Verify DeleteMessageCommand called correctly
    const calls = sqsMock.calls();
    expect(calls).toHaveLength(2);
    expect(calls[0].args[0]).toBeInstanceOf(ReceiveMessageCommand);
    expect(calls[1].args[0]).toBeInstanceOf(DeleteMessageCommand);
    expect(calls[1].args[0]).toEqual(
      expect.objectContaining({
        input: {
          QueueUrl: "https://test-queue",
          ReceiptHandle: "abc123",
        },
      }),
    );
  });

  it("returns error if Messages property is undefined", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({});

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe(RESPONSE_MISSING_MESSAGES);
  });

  it("returns error if Messages array is empty", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [] });

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe(NO_MESSAGES);
  });

  it("returns error if ReceiptHandle is missing", async () => {
    const invalidMessage = {
      Body: "incomplete", // no ReceiptHandle
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [invalidMessage] });

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe(MESSAGE_MISSING_RECEIPT_HANDLE);
  });

  it("returns error if Body is missing", async () => {
    const invalidMessage = {
      ReceiptHandle: "abc123", // no Body
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [invalidMessage] });

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe(MESSAGE_MISSING_BODY);
  });

  it("returns error if command fails", async () => {
    sqsMock.on(ReceiveMessageCommand).rejects(new Error("Boom"));

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe("Boom");
  });
});
