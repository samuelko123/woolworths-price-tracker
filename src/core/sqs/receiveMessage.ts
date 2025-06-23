import { type Message, ReceiveMessageCommand } from "@aws-sdk/client-sqs";

import { Option } from "@/core/option"; // adjust import path as needed

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

type ReceiveMessage = (queueUrl: string) => Promise<Option<SqsMessage>>;

export const receiveMessage: ReceiveMessage = async (queueUrl) => {
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 5,
    VisibilityTimeout: 30,
  });

  const result = await client.send(command);
  const message = result.Messages?.[0];

  if (!isValidSqsMessage(message)) {
    return Option.empty();
  }

  return Option.of({
    Body: message.Body,
    ReceiptHandle: message.ReceiptHandle,
  });
};
