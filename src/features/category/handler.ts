import { logDuration, logError } from "@/core/logger";

import { enqueueCategories, fetchCategories, purgeCategoryQueue } from "./adapters";
import { importCategories } from "./importCategories";
import { type LambdaHandler } from "./ports";

export const handler: LambdaHandler = async () => {
  try {
    await logDuration("fetchAndQueueCategories", () =>
      importCategories({
        fetchCategories,
        purgeCategoryQueue,
        enqueueCategories,
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
