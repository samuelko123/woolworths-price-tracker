import { type Message, ReceiveMessageCommand, type ReceiveMessageCommandOutput } from "@aws-sdk/client-sqs";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { type ReceiveMessage } from "@/features/product/ports";

import { toError } from "../error";
import { client } from "./client";
import { MESSAGE_MISSING_BODY, MESSAGE_MISSING_RECEIPT_HANDLE, NO_MESSAGES } from "./errors";
import { type SqsMessage } from "./types";

const extractMessage = (res: ReceiveMessageCommandOutput): ResultAsync<Message, Error> => {
  if (!res.Messages) return errAsync(new Error(NO_MESSAGES));
  if (res.Messages.length === 0) return errAsync(new Error(NO_MESSAGES));

  return okAsync(res.Messages[0]);
};

const buildSqsMessage = (queueUrl: string) => {
  return (message: Message): ResultAsync<SqsMessage, Error> => {
    const { Body: body, ReceiptHandle: receiptHandle } = message;

    if (!body) return errAsync(new Error(MESSAGE_MISSING_BODY));
    if (!receiptHandle) return errAsync(new Error(MESSAGE_MISSING_RECEIPT_HANDLE));

    return okAsync({
      queueUrl,
      body,
      receiptHandle,
    });
  };
};

export const receiveMessage: ReceiveMessage = (queueUrl) => {
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 5,
    VisibilityTimeout: 30,
  });

  return ResultAsync.fromPromise(client.send(command), toError)
    .andThen(extractMessage)
    .andThen(buildSqsMessage(queueUrl));
};
