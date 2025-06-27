import { getCategoryQueueUrl } from "@/core/config";
import { logDuration, logError } from "@/core/logger";
import { acknowledgeMessage, receiveMessage } from "@/core/sqs";

import { fetchProducts, parseCategory, saveProducts } from "./adapters";
import { type LambdaHandler } from "./ports";
import { processNextCategory } from "./processNextCategory";

export const handler: LambdaHandler = async () => {
  const result = await logDuration("processNextCategory", () =>
    processNextCategory({
      getCategoryQueueUrl,
      receiveMessage,
      parseCategory,
      fetchProducts,
      saveProducts,
      acknowledgeMessage,
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
