import { DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { deleteMessage } from "./deleteMessage";

describe("deleteMessage", () => {
  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
  });

  it("sends a DeleteMessageCommand", async () => {
    sqsMock.on(DeleteMessageCommand).resolves({});

    const queueUrl = "https://sqs.us-east-1.amazonaws.com/123456789012/test-queue";
    const receiptHandle = "test-receipt-handle";

    await deleteMessage(queueUrl, receiptHandle);

    const calls = sqsMock.calls();
    expect(calls).toHaveLength(1);
    expect(calls[0].args[0]).toBeInstanceOf(DeleteMessageCommand);
    expect(calls[0].args[0].input).toEqual({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    });
  });

  it("throws if SQS client rejects", async () => {
    sqsMock.on(DeleteMessageCommand).rejects(new Error("SQS error"));

    await expect(
      deleteMessage("https://sqs.us-east-1.amazonaws.com/test", "abc"),
    ).rejects.toThrow("SQS error");
  });
});
