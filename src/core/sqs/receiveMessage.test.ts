import { ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers/expectResult";

import {
  MESSAGE_MISSING_BODY,
  MESSAGE_MISSING_RECEIPT_HANDLE,
  NO_MESSAGES,
} from "./errors";
import { receiveMessage } from "./receiveMessage";

describe("receiveMessage", () => {
  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
  });

  it("returns a valid message", async () => {
    const mockMessage = {
      Body: "test",
      ReceiptHandle: "abc123",
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [mockMessage] });

    const result = await receiveMessage("https://test-queue").toPromise();

    expectOk(result);
    expect(result.value).toEqual({
      queueUrl: "https://test-queue",
      body: "test",
      receiptHandle: "abc123",
    });
  });

  it("returns error if Messages property is undefined", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({});

    const result = await receiveMessage("https://test-queue").toPromise();

    expectErr(result);
    expect(result.error.message).toBe(NO_MESSAGES);
  });

  it("returns error if Messages array is empty", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [] });

    const result = await receiveMessage("https://test-queue").toPromise();

    expectErr(result);
    expect(result.error.message).toBe(NO_MESSAGES);
  });

  it("returns error if ReceiptHandle is missing", async () => {
    const invalidMessage = {
      Body: "incomplete", // no ReceiptHandle
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [invalidMessage] });

    const result = await receiveMessage("https://test-queue").toPromise();

    expectErr(result);
    expect(result.error.message).toBe(MESSAGE_MISSING_RECEIPT_HANDLE);
  });

  it("returns error if Body is missing", async () => {
    const invalidMessage = {
      ReceiptHandle: "abc123", // no Body
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [invalidMessage] });

    const result = await receiveMessage("https://test-queue").toPromise();

    expectErr(result);
    expect(result.error.message).toBe(MESSAGE_MISSING_BODY);
  });

  it("returns error if command fails", async () => {
    sqsMock.on(ReceiveMessageCommand).rejects(new Error("Boom"));

    const result = await receiveMessage("https://test-queue").toPromise();

    expectErr(result);
    expect(result.error.message).toBe("Boom");
  });
});
