import { DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { okAsync, ResultAsync } from "neverthrow";

import { toError } from "@/core/error";
import { type DeleteMessage } from "@/features/product";

import { client } from "./client";
import { type SqsMessage } from "./types";

export const deleteMessage: DeleteMessage = (message: SqsMessage) => {
  const { queueUrl, receiptHandle } = message;

  const command = new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  });

  return ResultAsync
    .fromPromise(client.send(command), toError)
    .andThen(() => okAsync());
};
