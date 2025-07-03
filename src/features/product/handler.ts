import { createDynamoDBDocumentClient } from "@/core/dynamodb";
import { logDuration, logError, logInfo } from "@/core/logger";
import { deleteMessage, receiveMessage } from "@/core/sqs";
import { getCategoryQueueUrl } from "@/features/category";
import { parseProducts } from "@/integrations/woolworths";

import { fetchProducts, parseCategory, saveProductsWith } from "./adapters";
import { importProducts } from "./importProducts";
import { type LambdaHandler } from "./ports";

const createLambdaResponse = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ message }),
});

export const handler: LambdaHandler = async () => {
  const docClient = createDynamoDBDocumentClient();
  const saveProducts = saveProductsWith(docClient);

  const result = await logDuration("importProducts", () =>
    importProducts({
      getCategoryQueueUrl,
      receiveMessage,
      parseCategory,
      fetchProducts,
      parseProducts,
      saveProducts,
      deleteMessage,
    }),
  );

  if (result.isErr()) {
    logError(result.error);
    return createLambdaResponse(500, result.error.message);
  }

  logInfo("importProducts completed successfully");
  return createLambdaResponse(200, "Success");
};
