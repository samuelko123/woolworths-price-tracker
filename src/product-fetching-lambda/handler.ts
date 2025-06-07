import { logger } from "../shared/logger";
import { LambdaResponse } from "../shared/schema";
import { main } from "./main";

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
    // TODO: Use functional programming to handle errors
    if (error instanceof Error && error.message === "No messages received from the category queue.") {
      logger.info("No messages received from the category queue.");

      return {
        statusCode: 204,
        body: JSON.stringify({
          message: "No content",
        }),
      };
    }

    logger.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong",
      }),
    };
  }
};
