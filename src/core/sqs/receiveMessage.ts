import { DeleteMessageCommand, type Message, ReceiveMessageCommand, type ReceiveMessageCommandOutput } from "@aws-sdk/client-sqs";

import { err, ok, type Result, tryCatch } from "@/core/result";

import { client } from "./client";
import { MESSAGE_MISSING_BODY, MESSAGE_MISSING_RECEIPT_HANDLE, NO_MESSAGES, RESPONSE_MISSING_MESSAGES } from "./errors";

type SqsMessage = {
  body: string;
  acknowledge: () => Promise<void>;
};

const deleteMessage = async (queueUrl: string, receiptHandle: string) => {
  const command = new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  });

  await client.send(command);
};

const extractMessage = (res: ReceiveMessageCommandOutput): Result<Message> => {
  if (!res.Messages) return err(new Error(RESPONSE_MISSING_MESSAGES));
  if (res.Messages.length === 0) return err(new Error(NO_MESSAGES));

  return ok(res.Messages[0]);
};

const buildSqsMessage = (queueUrl: string) => {
  return (message: Message): Result<SqsMessage> => {
    const { Body, ReceiptHandle } = message;

    if (!Body) return err(new Error(MESSAGE_MISSING_BODY));
    if (!ReceiptHandle) return err(new Error(MESSAGE_MISSING_RECEIPT_HANDLE));

    return ok({
      body: Body,
      acknowledge: async () => deleteMessage(queueUrl, ReceiptHandle),
    });
  };
};

export const receiveMessage = async (queueUrl: string): Promise<Result<SqsMessage>> => {
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 5,
    VisibilityTimeout: 30,
  });

  const result = await tryCatch(() => client.send(command));
  return result
    .flatMap(extractMessage)
    .flatMap(buildSqsMessage(queueUrl));
};
