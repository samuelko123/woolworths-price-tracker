import { okAsync, type ResultAsync } from "neverthrow";

import { type Product } from "@/features/product";
import { type WoolworthsProduct } from "@/integrations/woolworths";

import { type ParseProducts } from "../../features/product/ports";
import { ParsedProductSchema } from "./parseProducts.schema";

const toProduct = (raw: WoolworthsProduct): Product | null => {
  const parsed = ParsedProductSchema.safeParse(raw);
  if (!parsed.success) return null;

  const { barcode, ...rest } = parsed.data;
  if (!barcode) return null;

  return { barcode, ...rest };
};

export const parseProducts: ParseProducts = (rawProducts: WoolworthsProduct[]): ResultAsync<Product[], Error> => {
  const products = rawProducts
    .map(toProduct)
    .filter(p => !!p);

  return okAsync(products);
};
