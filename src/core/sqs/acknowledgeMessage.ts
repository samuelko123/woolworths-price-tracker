import { DeleteMessageCommand } from "@aws-sdk/client-sqs";

import { ResultAsync } from "@/core/result";
import { type AcknowledgeMessage } from "@/features/product/ports";

import { client } from "./client";
import { type SqsMessage } from "./types";

export const acknowledgeMessage: AcknowledgeMessage = (message: SqsMessage) => {
  const { queueUrl, receiptHandle } = message;

  const command = new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  });

  return ResultAsync
    .fromPromise(client.send(command))
    .map(() => { });
};
