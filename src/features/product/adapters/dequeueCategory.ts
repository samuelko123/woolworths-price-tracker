import { getEnv } from "@/core/config";
import { logInfo } from "@/core/logger";
import { ResultAsync } from "@/core/result";
import { receiveMessage } from "@/core/sqs";

import { type DequeueCategory } from "../ports";
import { CategoryMessageSchema } from "./dequeueCategory.schema";

export const dequeueCategory: DequeueCategory = async () => {
  return ResultAsync.fromResult(getEnv())
    .flatMapAsync((env) => receiveMessage(env.CATEGORY_QUEUE_URL))
    .flatMap((message) => {
      const { body, acknowledge } = message;

      const parsed = CategoryMessageSchema.safeParse(body);
      if (!parsed.success) return ResultAsync.err(parsed.error);

      const category = parsed.data;
      logInfo("Received category from queue.", { category: category.urlName });

      return ResultAsync.ok({
        category,
        acknowledge,
      });
    })
    .unwrap();
};
