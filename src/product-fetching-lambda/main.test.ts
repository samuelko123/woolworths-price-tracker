import { mockClient } from "aws-sdk-client-mock";
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { main } from "./main";

vi.mock("../shared/logger");

describe("main", () => {
  const OLD_ENV = process.env;
  const sqsMock = mockClient(SQSClient);

  beforeEach(() => {
    process.env = { ...OLD_ENV, CATEGORY_QUEUE_URL: "https://mock-queue-url" };
    sqsMock.reset();
    sqsMock.on(ReceiveMessageCommand).resolves({
      Messages: [
        {
          Body: JSON.stringify({
            id: "123",
            level: 1,
            displayName: "Fruit",
            urlName: "fruit",
          }),
          ReceiptHandle: "abc-receipt",
        },
      ],
    });
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("runs successfully", async () => {
    await main();

    const calls = sqsMock.calls();
    expect(calls).toHaveLength(2);

    expect(calls[0].args[0]).toBeInstanceOf(ReceiveMessageCommand);
    expect(calls[0].args[0]).toEqual(
      expect.objectContaining({
        input: {
          MaxNumberOfMessages: 1,
          QueueUrl: process.env.CATEGORY_QUEUE_URL,
          VisibilityTimeout: 30,
          WaitTimeSeconds: 5,
        },
      })
    );

    expect(calls[1].args[0]).toBeInstanceOf(DeleteMessageCommand);
    expect(calls[1].args[0]).toEqual(
      expect.objectContaining({
        input: {
          QueueUrl: process.env.CATEGORY_QUEUE_URL,
          ReceiptHandle: "abc-receipt",
        }
      })
    );
  });
});
