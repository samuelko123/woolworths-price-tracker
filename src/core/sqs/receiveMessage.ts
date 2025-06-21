import { type Message, ReceiveMessageCommand } from "@aws-sdk/client-sqs";

import { client } from "./client";

type SqsMessage = {
  Body: string;
  ReceiptHandle: string;
};

const isValidSqsMessage = (
  message: Message | null | undefined,
): message is Required<Pick<SqsMessage, "Body" | "ReceiptHandle">> => {
  return !!message && typeof message.Body === "string" && typeof message.ReceiptHandle === "string";
};

type ReceiveMessage = (queueUrl: string) => Promise<SqsMessage | null>;

export const receiveMessage: ReceiveMessage = async (queueUrl) => {
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 5,
    VisibilityTimeout: 30,
  });

  const result = await client.send(command);
  if (!result.Messages) {
    return null;
  }

  const message = result.Messages[0];
  if (!isValidSqsMessage(message)) {
    return null;
  }

  return message;
};
