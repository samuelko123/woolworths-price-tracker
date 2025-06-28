import { getCategoryQueueUrl } from "@/core/config";
import { logDuration, logError } from "@/core/logger";
import { deleteMessage, receiveMessage } from "@/core/sqs";

import { fetchProducts, parseCategory, saveProducts } from "./adapters";
import { importProducts } from "./importProducts";
import { type LambdaHandler } from "./ports";

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

  if (result.success) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
      }),
    };
  } else {
    logError(result.error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: result.error.message,
      }),
    };
  }
};
