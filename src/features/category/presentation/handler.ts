import { getCategoryQueueUrl } from "@/core/config";
import { logDuration, logError, logInfo } from "@/core/logger";
import { purgeQueue, sendCategoryMessages } from "@/core/sqs";
import { fetchCategories } from "@/integrations/woolworths";

import { importCategories } from "../application/use-cases/importCategories";

const createLambdaResponse = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ message }),
});

export const handler = async () => {
  const result = await logDuration("importCategories", () =>
    importCategories({
      fetchCategories,
      getCategoryQueueUrl,
      purgeQueue,
      sendCategoryMessages,
    }),
  );

  if (result.isErr()) {
    logError(result.error);
    return createLambdaResponse(500, result.error.message);
  }

  logInfo("importCategories completed successfully");
  return createLambdaResponse(200, "Success");
};
