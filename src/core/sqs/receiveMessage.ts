import { DeleteMessageCommand, type Message, ReceiveMessageCommand, type ReceiveMessageCommandOutput } from "@aws-sdk/client-sqs";

import { ResultAsync, tryCatch } from "@/core/result";

import { client } from "./client";
import { MESSAGE_MISSING_BODY, MESSAGE_MISSING_RECEIPT_HANDLE, NO_MESSAGES } from "./errors";
import { type SqsMessage } from "./types";

const deleteMessage = async (queueUrl: string, receiptHandle: string) => {
  const command = new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  });

  await client.send(command);
};

const extractMessage = (res: ReceiveMessageCommandOutput): ResultAsync<Message> => {
  if (!res.Messages) return ResultAsync.err(new Error(NO_MESSAGES));
  if (res.Messages.length === 0) return ResultAsync.err(new Error(NO_MESSAGES));

  return ResultAsync.ok(res.Messages[0]);
};

const buildSqsMessage = (queueUrl: string) => {
  return (message: Message): ResultAsync<SqsMessage> => {
    const { Body, ReceiptHandle } = message;

    if (!Body) return ResultAsync.err(new Error(MESSAGE_MISSING_BODY));
    if (!ReceiptHandle) return ResultAsync.err(new Error(MESSAGE_MISSING_RECEIPT_HANDLE));

    return ResultAsync.ok({
      body: Body,
      acknowledge: () => tryCatch(() => deleteMessage(queueUrl, ReceiptHandle)),
    });
  };
};

export const receiveMessage = (queueUrl: string): ResultAsync<SqsMessage> => {
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 5,
    VisibilityTimeout: 30,
  });

  return ResultAsync.fromPromise(client.send(command))
    .flatMap(extractMessage)
    .flatMap(buildSqsMessage(queueUrl));
};
