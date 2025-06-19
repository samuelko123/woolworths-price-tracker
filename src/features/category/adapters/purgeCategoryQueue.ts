import {
  PurgeQueueCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { logInfo } from "@/core/logger";

import { PurgeCategoryQueue } from "../ports";

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
});

export const purgeCategoryQueue: PurgeCategoryQueue = async () => {
  const queueUrl = process.env.CATEGORY_QUEUE_URL;
  logInfo("Start purging category queue...");

  const params = {
    QueueUrl: queueUrl,
  };

  const command = new PurgeQueueCommand(params);
  await sqs.send(command);

  logInfo("Finished purging category queue.");
};
