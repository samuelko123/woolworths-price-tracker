import { DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers/expectResult";

import { acknowledgeMessage } from "./acknowledgeMessage";

describe("acknowledgeMessage", () => {
  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
  });

  it("calls DeleteMessageCommand", async () => {
    const mockMessage = {
      queueUrl: "https://test-queue",
      body: "test",
      receiptHandle: "abc123",
    };
    sqsMock.on(DeleteMessageCommand).resolves({});

    const result = await acknowledgeMessage(mockMessage).toPromise();

    expectOk(result);

    const calls = sqsMock.calls();
    expect(calls).toHaveLength(1);
    expect(calls[0].args[0]).toBeInstanceOf(DeleteMessageCommand);
    expect(calls[0].args[0]).toEqual(
      expect.objectContaining({
        input: {
          QueueUrl: "https://test-queue",
          ReceiptHandle: "abc123",
        },
      }),
    );
  });

  it("returns error if DeleteMessageCommand fails", async () => {
    const mockMessage = {
      queueUrl: "https://test-queue",
      body: "test",
      receiptHandle: "abc123",
    };
    sqsMock.on(DeleteMessageCommand).rejects(new Error("Delete failed"));

    const result = await acknowledgeMessage(mockMessage).toPromise();

    expectErr(result);
    expect(result.error.message).toBe("Delete failed");
  });
});
