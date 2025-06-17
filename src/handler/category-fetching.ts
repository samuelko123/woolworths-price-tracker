import { logger } from "@/logger";
import { main } from "@/src/category-fetching-lambda/main";
import { LambdaResponse } from "@/src/handler/handler.types";

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
