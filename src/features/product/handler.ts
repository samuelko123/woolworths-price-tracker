import { LambdaHandler } from "@/core/ports";
import { logger } from "@/logger";

import { saveProductsForNextCategory } from "./service";

export const handler: LambdaHandler = async () => {
  try {
    await saveProductsForNextCategory();

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
