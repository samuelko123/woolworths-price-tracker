import { DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers/expectResult";

import { deleteMessage } from "./deleteMessage";
import { mockMessage } from "./deleteMessage.test.data";

describe("deleteMessage", () => {
  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
  });

  it("calls DeleteMessageCommand", async () => {

    sqsMock.on(DeleteMessageCommand).resolves({});

    const result = await deleteMessage(mockMessage).toPromise();

    expectOk(result);

    const calls = sqsMock.calls();
    expect(calls).toHaveLength(1);
    expect(calls[0].args[0]).toBeInstanceOf(DeleteMessageCommand);
    expect(calls[0].args[0]).toEqual(
      expect.objectContaining({
        input: {
          QueueUrl: mockMessage.queueUrl,
          ReceiptHandle: mockMessage.receiptHandle,
        },
      }),
    );
  });

  it("returns error if DeleteMessageCommand fails", async () => {
    sqsMock.on(DeleteMessageCommand).rejects(new Error("Delete failed"));

    const result = await deleteMessage(mockMessage).toPromise();

    expectErr(result);
    expect(result.error.message).toBe("Delete failed");
  });
});
