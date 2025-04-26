import { logger } from "../shared/logger";

export const fetchCategories = async () => {
  logger.info({
    hello: "world",
  });

  throw new Error("This is a test error");
};
