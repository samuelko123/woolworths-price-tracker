import { getCategoryQueueUrl } from "@/core/config";
import { logDuration, logError } from "@/core/logger";
import { receiveMessage } from "@/core/sqs";

import { fetchProducts, parseCategory, saveProducts } from "./adapters";
import { type LambdaHandler } from "./ports";
import { processNextCategory } from "./processNextCategory";

export const handler: LambdaHandler = async () => {
  try {
    await logDuration("processNextCategory", () =>
      processNextCategory({
        getCategoryQueueUrl,
        receiveMessage,
        parseCategory,
        fetchProducts,
        saveProducts,
      }),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
      }),
    };
  } catch (error) {
    logError(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong",
      }),
    };
  }
};
