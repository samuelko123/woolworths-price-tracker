import { saveProductsForNextCategory } from "@/application";
import { logger } from "@/logger";

import { LambdaResponse } from "./types";

export const handler = async (): Promise<LambdaResponse> => {
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
