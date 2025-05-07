import { logger } from "../shared/logger";
import { LambdaResponse } from "../shared/schema";

export const handler = async (): Promise<LambdaResponse> => {
  logger.info({ hello: "world" });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success",
    }),
  };
};
