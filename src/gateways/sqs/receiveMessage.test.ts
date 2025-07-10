import { ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers";

import {
  MESSAGE_MISSING_BODY,
  MESSAGE_MISSING_RECEIPT_HANDLE,
  NO_MESSAGES,
} from "./errors";
import { receiveMessage } from "./receiveMessage";
import { mockRawMessage } from "./receiveMessage.test.data";

describe("receiveMessage", () => {
  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
  });

  it("returns a valid message", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [mockRawMessage] });

    const result = await receiveMessage("https://test-queue");

    expectOk(result);
    expect(result.value).toEqual({
      queueUrl: "https://test-queue",
      body: "test",
      receiptHandle: "abc123",
    });
  });

  it("returns error if Messages property is undefined", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({});

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe(NO_MESSAGES);
  });

  it("returns error if Messages array is empty", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [] });

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe(NO_MESSAGES);
  });

  it("returns error if ReceiptHandle is missing", async () => {
    const invalidMessage = {
      ...mockRawMessage,
      ReceiptHandle: undefined,
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [invalidMessage] });

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe(MESSAGE_MISSING_RECEIPT_HANDLE);
  });

  it("returns error if Body is missing", async () => {
    const invalidMessage = {
      ...mockRawMessage,
      Body: undefined,
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
