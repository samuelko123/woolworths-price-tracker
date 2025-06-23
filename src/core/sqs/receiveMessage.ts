import { type Message, ReceiveMessageCommand } from "@aws-sdk/client-sqs";

import { Option } from "@/core/option";
import { ok, type Result, tryCatch } from "@/core/result";

import { client } from "./client";

type SqsMessage = {
  Body: string;
  ReceiptHandle: string;
};

const isValidSqsMessage = (
  message: Message | null | undefined,
): message is SqsMessage => {
  return !!message && typeof message.Body === "string" && typeof message.ReceiptHandle === "string";
};

type ReceiveMessage = (queueUrl: string) => Promise<Result<Option<SqsMessage>>>;

export const receiveMessage: ReceiveMessage = async (queueUrl) => {
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 5,
    VisibilityTimeout: 30,
  });

  const result = await tryCatch(() => client.send(command));
  if (!result.success) return result;

  const message = result.value.Messages?.[0];
  if (!isValidSqsMessage(message)) {
    return ok(Option.empty());
  }

  return ok(Option.of({
    Body: message.Body,
    ReceiptHandle: message.ReceiptHandle,
  }));
};
