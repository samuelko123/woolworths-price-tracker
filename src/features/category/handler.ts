
import { LambdaHandler } from "@/core/ports";
import { logger } from "@/logger";

import { fetchAndQueueCategories } from "./service";

export const handler: LambdaHandler = async () => {
  try {
    await fetchAndQueueCategories();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
      }),
    };
  } catch (error) {
    logger.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong",
      }),
    };
  }
};
