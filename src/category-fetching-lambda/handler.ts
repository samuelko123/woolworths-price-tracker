import { logger } from "../shared/logger";
import { sendToCategoryQueue } from "../shared/queue";
import { fetchCategories } from "./apiClient";

export const handler = async (): Promise<LambdaResponse> => {
  try {
    const categoriesDTO = await fetchCategories();
    const { categories } = categoriesDTO;
    await sendToCategoryQueue(categories);

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
