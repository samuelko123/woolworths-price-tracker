import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers";

import { sendMessage } from "./sendMessage";

describe("sendMessage", () => {
  const queueUrl = "https://mock-queue-url";
  const message = { key: "value" };

  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
  });

  it("sends SendMessageCommand", async () => {
    sqsMock.on(SendMessageCommand).resolves({});

    const result = await sendMessage(queueUrl, message);

    expectOk(result);

    const calls = sqsMock.calls();
    expect(calls).toHaveLength(1);
    expect(calls[0].args[0]).toBeInstanceOf(SendMessageCommand);
    expect(calls[0].args[0]).toEqual(
      expect.objectContaining({
        input: {
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(message),
        },
      }),
    );
  });

  it("returns error if SendMessageCommand fails", async () => {
    const error = new Error("Send failed");
    sqsMock.on(SendMessageCommand).rejects(error);

    const result = await sendMessage(queueUrl, message);

    expectErr(result);
    expect(result.error).toEqual(error);
  });
});
