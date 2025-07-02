import { getCategoryQueueUrl } from "@/core/config";
import { logDuration, logError, logInfo } from "@/core/logger";
import { purgeQueue } from "@/core/sqs";

import { fetchCategories, filterCategories, parseCategories, sendMessages } from "./adapters";
import { importCategories } from "./importCategories";
import { type LambdaHandler } from "./ports";

const createLambdaResponse = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ message }),
});

export const handler: LambdaHandler = async () => {
  const result = await logDuration("importCategories", () =>
    importCategories({
      fetchCategories,
      parseCategories,
      filterCategories,
      getCategoryQueueUrl,
      purgeQueue,
      sendMessages,
    }),
  );

  if (result.isErr()) {
    logError(result.error);
    return createLambdaResponse(500, result.error.message);
  }

  logInfo("importCategories completed successfully");
  return createLambdaResponse(200, "Success");
};
