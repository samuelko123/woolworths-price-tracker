import { logDuration, logError } from "@/core/logger";

import { dequeueCategory, fetchProducts, saveProduct } from "./adapters";
import { type LambdaHandler } from "./ports";
import { saveProductsForNextCategory } from "./service";

export const handler: LambdaHandler = async () => {
  try {
    await logDuration("saveProductsForNextCategory", () =>
      saveProductsForNextCategory({
        dequeueCategory,
        fetchProducts,
        saveProduct,
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
