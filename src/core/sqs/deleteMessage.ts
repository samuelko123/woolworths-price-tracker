import { DeleteMessageCommand } from "@aws-sdk/client-sqs";

import { client } from "./client";

type DeleteMessage = (queueUrl: string, receiptHandle: string) => Promise<void>;

export const deleteMessage: DeleteMessage = async (queueUrl, receiptHandle) => {
  const command = new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  });

  await client.send(command);
};
