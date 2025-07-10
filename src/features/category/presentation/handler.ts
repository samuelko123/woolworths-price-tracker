import { logDuration, logError, logInfo } from "@/core/logger";

import { importCategories } from "../application/use-cases/importCategories";
import { purgeCategoryQueue } from "../gateways/sqs/purgeCategoryQueue";
import { sendCategoryMessages } from "../gateways/sqs/sendCategoryMessages";
import { fetchCategories } from "../gateways/woolworths/fetchCategories";

const createLambdaResponse = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ message }),
});

export const handler = async () => {
  const result = await logDuration("importCategories", () =>
    importCategories({
      fetchCategories,
      purgeCategoryQueue,
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
