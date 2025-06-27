import { getEnv } from "@/core/config";
import { JsonStringSchema } from "@/core/json";
import { logInfo } from "@/core/logger";
import { ResultAsync } from "@/core/result";
import { receiveMessage, type SqsMessage } from "@/core/sqs";
import { CategorySchema } from "@/domain";

import { type DequeueCategory, type DequeueResult } from "../ports";

const CategoryMessageSchema = JsonStringSchema.pipe(CategorySchema);

const parseCategoryMessage = (message: SqsMessage): ResultAsync<DequeueResult> => {
  const parsed = CategoryMessageSchema.safeParse(message.body);
  if (!parsed.success) return ResultAsync.err(parsed.error);

  return ResultAsync.ok({
    category: parsed.data,
    acknowledge: message.acknowledge,
  });
};

export const dequeueCategory: DequeueCategory = async () => {
  return getEnv()
    .flatMapAsync((env) => receiveMessage(env.CATEGORY_QUEUE_URL))
    .flatMap(parseCategoryMessage)
    .tap((message) => logInfo("Received category from queue.", { category: message.category.urlName }))
    .toPromise();
};
