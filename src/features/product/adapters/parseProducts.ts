import { type ResultAsync } from "neverthrow";

import { parseWithSchema } from "@/core/validation";
import { type Product } from "@/domain";
import { type WoolworthsProduct } from "@/integrations/woolworths";

import { type ParseProducts } from "../ports";
import { ProductsSchema } from "./parseProducts.schema";

export const parseProducts: ParseProducts = (products: WoolworthsProduct[]): ResultAsync<Product[], Error> => {
  return parseWithSchema(ProductsSchema, products);
};
