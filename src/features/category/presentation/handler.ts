import { getCategoryQueueUrl } from "@/core/config";
import { logDuration, logError, logInfo } from "@/core/logger";
import { purgeQueue } from "@/core/sqs";

import { fetchCategories } from "../adapters/fetchCategories";
import { parseCategories } from "../adapters/parseCategories";
import { sendCategoryMessages } from "../adapters/sendCategoryMessages";
import { importCategories } from "../application/importCategories";
import { type LambdaHandler } from "../application/ports";
import { filterCategories } from "../domain/filterCategories";

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
