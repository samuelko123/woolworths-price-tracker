import { main } from "./main";
import { logger } from "../shared/logger";
import type { LambdaResponse } from "../shared/schema";

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
