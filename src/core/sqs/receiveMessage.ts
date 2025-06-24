import { type Message, ReceiveMessageCommand, type ReceiveMessageCommandOutput } from "@aws-sdk/client-sqs";

import { err, ok, type Result, tryCatch } from "@/core/result";

import { client } from "./client";
import { MESSAGE_MISSING_BODY, MESSAGE_MISSING_RECEIPT_HANDLE, NO_MESSAGES, RESPONSE_MISSING_MESSAGES } from "./errors";

type SqsMessage = {
  Body: string;
  ReceiptHandle: string;
};

type ReceiveMessage = (queueUrl: string) => Promise<Result<SqsMessage>>;

const extractMessage = (res: ReceiveMessageCommandOutput): Result<Message> => {
  if (!res.Messages) return err(new Error(RESPONSE_MISSING_MESSAGES));
  if (res.Messages.length === 0) return err(new Error(NO_MESSAGES));

  return ok(res.Messages[0]);
};

const buildSqsMessage = (message: Message): Result<SqsMessage> => {
  if (!message.Body) return err(new Error(MESSAGE_MISSING_BODY));
  if (!message.ReceiptHandle) return err(new Error(MESSAGE_MISSING_RECEIPT_HANDLE));

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

  return (await tryCatch(() => client.send(command)))
    .flatMap(extractMessage)
    .flatMap(buildSqsMessage);
};
