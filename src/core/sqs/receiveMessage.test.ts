import { ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { expectEmpty, expectPresent } from "@/tests/helpers/expectOption";

import { receiveMessage } from "./receiveMessage";

describe("receiveMessage", () => {
  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
  });

  it("returns the valid message", async () => {
    const mockMessage = {
      Body: "test",
      ReceiptHandle: "abc123",
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [mockMessage] });

    const result = await receiveMessage("https://test-queue");

    expectPresent(result);
    expect(result.value).toEqual(mockMessage);
  });

  it("returns nothing if Messages property is undefined", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({});

    const result = await receiveMessage("https://test-queue");

    expectEmpty(result);
  });

  it("returns nothing if Messages array is empty", async () => {
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [] });

    const result = await receiveMessage("https://test-queue");

    expectEmpty(result);
  });

  it("returns nothing if ReceiptHandle is missing", async () => {
    const invalidMessage = {
      Body: "incomplete", // no ReceiptHandle
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [invalidMessage] });

    const result = await receiveMessage("https://test-queue");

    expectEmpty(result);
  });

  it("returns nothing if Body is missing", async () => {
    const invalidMessage = {
      ReceiptHandle: "abc123", // no Body
    };
    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [invalidMessage] });

    const result = await receiveMessage("https://test-queue");

    expectEmpty(result);
  });

  it("throws if client.send rejects", async () => {
    sqsMock.on(ReceiveMessageCommand).rejects(new Error("Boom"));

    await expect(() => receiveMessage("https://test-queue")).rejects.toThrow("Boom");
  });
});
