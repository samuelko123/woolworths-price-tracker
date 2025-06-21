import { ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { receiveMessage } from "./receiveMessage";

describe("receiveMessage", () => {
  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
  });

  it("returns the valid message", async () => {
    const mockMessage = {
      MessageId: "1",
      Body: "test",
      ReceiptHandle: "abc123",
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [mockMessage] });

    const result = await receiveMessage("https://test-queue");

    expect(result).toEqual(mockMessage);
  });

  it("returns null if Messages is undefined", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({});

    const result = await receiveMessage("https://test-queue");

    expect(result).toBeNull();
  });

  it("returns null if Messages array is empty", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [] });

    const result = await receiveMessage("https://test-queue");

    expect(result).toBeNull();
  });

  it("returns null if ReceiptHandle is missing", async () => {
    const invalidMessage = {
      MessageId: "2",
      Body: "incomplete", // no ReceiptHandle
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [invalidMessage] });

    const result = await receiveMessage("https://test-queue");

    expect(result).toBeNull();
  });

  it("returns null if Body is missing", async () => {
    const invalidMessage = {
      MessageId: "3",
      ReceiptHandle: "abc123", // no Body
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [invalidMessage] });

    const result = await receiveMessage("https://test-queue");

    expect(result).toBeNull();
  });

  it("throws if client.send rejects", async () => {
    sqsMock.on(ReceiveMessageCommand).rejects(new Error("Boom"));

    await expect(() => receiveMessage("https://test-queue")).rejects.toThrow("Boom");
  });
});
