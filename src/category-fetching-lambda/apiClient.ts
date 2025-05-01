import axios from "axios";
import { CategoriesDTO, CategoriesDTOSchema } from "../shared/schema";

export const fetchCategories = async (): Promise<CategoriesDTO> => {
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

  return CategoriesDTOSchema.parse(res.data);
};
