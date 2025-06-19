import {
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { logger } from "@/core/logger";

import { EnqueueCategories } from "../ports";

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
});

export const enqueueCategories: EnqueueCategories = async (categories) => {
  const queueUrl = process.env.CATEGORY_QUEUE_URL;
  logger.info({
    message: "Start pushing categories to queue...",
    categoriesCount: categories.length,
  });

  for (const category of categories) {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(category),
    };

    const command = new SendMessageCommand(params);
    await sqs.send(command);
  }

  logger.info("Finished pushing categories to queue.");
};

