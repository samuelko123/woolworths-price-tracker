import { getCategoryQueueUrl } from "@/core/config";
import { createDynamoDBDocumentClient, saveProductsWith } from "@/core/dynamodb";
import { logDuration, logError, logInfo } from "@/core/logger";
import { deleteMessage, receiveMessage } from "@/core/sqs";
import { createApiClient, fetchProductsWith } from "@/integrations/woolworths";

import { importProducts } from "../application/use-cases/importProducts";

const createLambdaResponse = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ message }),
});

export const handler = async () => {
  const apiClientResult = await createApiClient();
  if (apiClientResult.isErr()) {
    logError(apiClientResult.error);
    return createLambdaResponse(500, "Failed to API client");
  }
  const fetchProducts = fetchProductsWith(apiClientResult.value);

  const docClient = createDynamoDBDocumentClient();
  const saveProducts = saveProductsWith(docClient);

  const result = await logDuration("importProducts", () =>
    importProducts({
      getCategoryQueueUrl,
      receiveMessage,
      fetchProducts,
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
