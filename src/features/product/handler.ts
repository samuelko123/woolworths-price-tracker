import { getCategoryQueueUrl } from "@/core/config";
import { logDuration, logError, logInfo } from "@/core/logger";
import { deleteMessage, receiveMessage } from "@/core/sqs";

import { fetchProducts, parseCategory, saveProducts } from "./adapters";
import { importProducts } from "./importProducts";
import { type LambdaHandler } from "./ports";

const createResponse = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ message }),
});

export const handler: LambdaHandler = async () => {
  const result = await logDuration("importProducts", () =>
    importProducts({
      getCategoryQueueUrl,
      receiveMessage,
      parseCategory,
      fetchProducts,
      saveProducts,
      deleteMessage,
    }).toPromise(),
  );

  if (!result.success) {
    logError(result.error);
    return createResponse(500, result.error.message);
  }

  logInfo("importProducts completed successfully");
  return createResponse(200, "Success");
};
