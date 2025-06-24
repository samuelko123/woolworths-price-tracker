import { getEnv } from "@/core/config";
import { logInfo } from "@/core/logger";
import { ResultAsync } from "@/core/result";
import { receiveMessage, type SqsMessage } from "@/core/sqs";

import { type DequeueCategory, type DequeueResult } from "../ports";
import { CategoryMessageSchema } from "./dequeueCategory.schema";

const parseCategoryMessage = (message: SqsMessage): ResultAsync<DequeueResult> => {
  const parsed = CategoryMessageSchema.safeParse(message.body);
  if (!parsed.success) return ResultAsync.err(parsed.error);

  return ResultAsync.ok({
    category: parsed.data,
    acknowledge: message.acknowledge,
  });
};

export const dequeueCategory: DequeueCategory = async () => {
  return ResultAsync.fromResult(getEnv())
    .flatMapAsync((env) => receiveMessage(env.CATEGORY_QUEUE_URL))
    .flatMap(parseCategoryMessage)
    .tap((message) => logInfo("Received category from queue.", { category: message.category.urlName }))
    .unwrap();
};
