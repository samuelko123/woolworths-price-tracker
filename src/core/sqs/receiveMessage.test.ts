import { ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers/expectResult";

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

    const result = await receiveMessage("https://test-queue");

    expectOk(result);
    expect(result.value).toEqual(mockMessage);
  });

  it("returns error if Messages property is undefined", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({});

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe("No messages received from the queue.");
  });

  it("returns error if Messages array is empty", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [] });

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe("No messages received from the queue.");
  });

  it("returns error if ReceiptHandle is missing", async () => {
    const invalidMessage = {
      Body: "incomplete", // no ReceiptHandle
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [invalidMessage] });

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe("ReceiptHandle is missing from the message.");
  });

  it("returns error if Body is missing", async () => {
    const invalidMessage = {
      ReceiptHandle: "abc123", // no Body
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [invalidMessage] });

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe("Body is missing from the message.");
  });

  it("returns error if command fails", async () => {
    sqsMock.on(ReceiveMessageCommand).rejects(new Error("Boom"));

    const result = await receiveMessage("https://test-queue");

    expectErr(result);
    expect(result.error.message).toBe("Boom");
  });
});
