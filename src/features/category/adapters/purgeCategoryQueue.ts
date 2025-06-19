import {
  PurgeQueueCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { logger } from "@/core/logger";

import { PurgeCategoryQueue } from "../ports";

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
});

export const purgeCategoryQueue: PurgeCategoryQueue = async () => {
  const queueUrl = process.env.CATEGORY_QUEUE_URL;
  logger.info({
    message: "Start purging category queue...",
    queueUrl,
  });

  const params = {
    QueueUrl: queueUrl,
  };

  const command = new PurgeQueueCommand(params);
  const result = await sqs.send(command);

  logger.info({
    message: "Finished purging category queue.",
    status: result.$metadata.httpStatusCode,
  });
};
