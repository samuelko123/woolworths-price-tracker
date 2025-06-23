import { type Message, ReceiveMessageCommand } from "@aws-sdk/client-sqs";

import { err, ok, type Result, tryCatch } from "@/core/result";

import { client } from "./client";

type SqsMessage = {
  Body: string;
  ReceiptHandle: string;
};

type ReceiveMessage = (queueUrl: string) => Promise<Result<SqsMessage>>;

const validateSqsMessage = (message: Message | undefined): Result<SqsMessage> => {
  if (!message) return err(new Error("No messages received from the queue."));
  if (!message.Body) return err(new Error("Body is missing from the message."));
  if (!message.ReceiptHandle) return err(new Error("ReceiptHandle is missing from the message."));

  return ok({
    Body: message.Body,
    ReceiptHandle: message.ReceiptHandle,
  });
};

export const receiveMessage: ReceiveMessage = async (queueUrl) => {
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 5,
    VisibilityTimeout: 30,
  });

  const result = await tryCatch(() => client.send(command));
  return result.flatMap((res) => validateSqsMessage(res.Messages?.[0]));
};
