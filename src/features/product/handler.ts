import { getCategoryQueueUrl } from "@/core/config";
import { logDuration, logError } from "@/core/logger";

import { type LambdaHandler } from "./ports";
import { processNextCategory } from "./processNextCategory";

export const handler: LambdaHandler = async () => {
  try {
    await logDuration("processNextCategory", () =>
      processNextCategory({
        getCategoryQueueUrl,
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
