import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers";

import { sendMessages } from "./sendMessages";

describe("sendMessages", () => {
  const queueUrl = "https://mock-queue-url";

  const sqsMock = mockClient(SQSClient);
  beforeEach(() => {
    sqsMock.reset();
    sqsMock.on(SendMessageCommand).resolves({});
  });

  it("does not send messages to SQS when input is empty array", async () => {
    const result = await sendMessages(queueUrl, []);

    expectOk(result);
    expect(sqsMock.calls()).toHaveLength(0);
  });

  it("sends one message to SQS when input contains one item", async () => {
    const items = [
      { id: 1 },
    ];

    const result = await sendMessages(queueUrl, items);

    expectOk(result);
    expect(sqsMock.calls()).toHaveLength(1);
    expect(sqsMock.call(0).args[0].input).toEqual({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(items[0]),
    });
  });

  it("sends multiple messages to SQS when input contains multiple items", async () => {
    const items = [
      { id: 1 },
      { id: 2 },
    ];

    const result = await sendMessages(queueUrl, items);

    expectOk(result);
    expect(sqsMock.calls()).toHaveLength(2);
    expect(sqsMock.call(0).args[0].input).toEqual({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(items[0]),
    });
    expect(sqsMock.call(1).args[0].input).toEqual({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(items[1]),
    });
  });

  it("does not send second message when first one fails", async () => {
    sqsMock.on(SendMessageCommand).rejects(new Error("Send failed"));

    const items = [
      { id: 1 },
      { id: 2 },
    ];

    const result = await sendMessages(queueUrl, items);

    expectErr(result);
    expect(result.error.message).toBe("Send failed");

    expect(sqsMock.calls()).toHaveLength(1);
    expect(sqsMock.call(0).args[0].input).toEqual({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(items[0]),
    });
  });
});
