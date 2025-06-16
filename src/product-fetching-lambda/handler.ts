import { main } from "@/src/product-fetching-lambda/main";
import { logger } from "@/src/shared/logger";
import { LambdaResponse } from "@/src/shared/types";

export const handler = async (): Promise<LambdaResponse> => {
  try {
    await main();

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
