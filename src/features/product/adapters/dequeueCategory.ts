import { getEnv } from "@/core/config";
import { logInfo } from "@/core/logger";
import { type ResultAsync } from "@/core/result";
import { receiveMessage, type SqsMessage } from "@/core/sqs";
import { parseWithSchema } from "@/core/validation";

import { type DequeueCategory, type DequeueResult } from "../ports";
import { CategoryMessageSchema } from "./dequeueCategory.schema";

const parseCategoryMessage = (message: SqsMessage): ResultAsync<DequeueResult> => {
  return parseWithSchema(CategoryMessageSchema, message.body)
    .map((category) => ({
      category,
      acknowledge: message.acknowledge,
    }));
};

export const dequeueCategory: DequeueCategory = async () => {
  return getEnv()
    .flatMapAsync((env) => receiveMessage(env.CATEGORY_QUEUE_URL))
    .flatMap(parseCategoryMessage)
    .tap((message) => logInfo("Received category from queue.", { category: message.category.urlName }))
    .toPromise();
};
