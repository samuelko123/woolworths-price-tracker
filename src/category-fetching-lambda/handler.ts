import { logger } from "../shared/logger";
import { fetchCategories } from "./category";

type LambdaEvent = {
  source: string;
};

export const handler = async (event: LambdaEvent) => {
  logger.info({
    message: "Event received.",
    event,
  });

  await fetchCategories();
};
