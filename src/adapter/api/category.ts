import axios from "axios";

import { logger } from "@/logger";
import { FetchCategories } from "@/port";

import { CategoriesDTOSchema } from "./category.schema";

export const fetchCategories: FetchCategories = async () => {
  logger.info("Start fetching categories from Woolworths API...");

  const client = axios.create({
    baseURL: "https://www.woolworths.com.au",
    timeout: 5000,
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, compress, deflate, br",
      "accept-language": "en-US,en;q=0.5",
      "cache-control": "no-cache",
      connection: "keep-alive",
      host: "www.woolworths.com.au",
      referer: "https://www.woolworths.com.au/",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0",
    },
  });

  const res = await client.get("/apis/ui/PiesCategoriesWithSpecials");
  const dto = CategoriesDTOSchema.parse(res.data);

  logger.info("Finished fetching categories from Woolworths API.");
  return dto.categories;
};
