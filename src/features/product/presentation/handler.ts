import { logDuration, logError, logInfo } from "@/core/logger";
import { createDynamoDBDocumentClient, saveProductsWith } from "@/gateways/dynamodb";
import { deleteMessage } from "@/gateways/sqs";
import { createApiClient, fetchProductsWith } from "@/gateways/woolworths";

import { importProducts } from "../application/use-cases/importProducts";
import { receiveCategoryMessage } from "../gateways/sqs/receiveCategoryMessage";

const createLambdaResponse = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ message }),
});

export const handler = async () => {
  const apiClientResult = await createApiClient();
  if (apiClientResult.isErr()) {
    logError(apiClientResult.error);
    return createLambdaResponse(500, "Failed to create API client");
  }
  const fetchProducts = fetchProductsWith(apiClientResult.value);

  const docClient = createDynamoDBDocumentClient();
  const saveProducts = saveProductsWith(docClient);

  const result = await logDuration("importProducts", () =>
    importProducts({
      receiveCategoryMessage,
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
