import {
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { logInfo } from "@/core/logger";

import { EnqueueCategories } from "../ports";

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
});

export const enqueueCategories: EnqueueCategories = async (categories) => {
  logInfo("Sending categories to queue...", { categoriesCount: categories.length });

  for (const category of categories) {
    const params = {
      QueueUrl: process.env.CATEGORY_QUEUE_URL,
      MessageBody: JSON.stringify(category),
    };

    const command = new SendMessageCommand(params);
    await sqs.send(command);
  }

  logInfo("Sent categories to queue.");
};

