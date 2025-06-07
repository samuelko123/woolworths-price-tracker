import axios from "axios";
import { CategoriesDTO, CategoriesDTOSchema, Category, Product } from "../shared/schema";
import { logger } from "../shared/logger";

export const fetchCategories = async (): Promise<CategoriesDTO> => {
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
  const dto = CategoriesDTOSchema.parse(res.data)

  logger.info("Finished fetching categories from Woolworths API.");
  return dto;
};

export const fetchCategoryProducts = async (
  category: Category
): Promise<Product[]> => {
  return Promise.resolve([
    {
      sku: 701705,
      name: "Kellogg's Coco Pops Chocolatey Breakfast Cereal 375g",
      brandName: "Kellogg's",
      packageSize: "375g",
      imageUrl:
        "https://cdn0.woolworths.media/content/wowproductimages/medium/701705.jpg",
      price: 5.5,
    },
  ]);
}
