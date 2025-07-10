import { okAsync, type ResultAsync } from "neverthrow";

import { type Product } from "@/features/product";

import { WoolworthsProductSchema } from "./parseProducts.schema";

const toProduct = (raw: unknown): Product | null => {
  const parsed = WoolworthsProductSchema.safeParse(raw);
  if (!parsed.success) return null;

  const { barcode, ...rest } = parsed.data;
  if (!barcode) return null;

  return { barcode, ...rest };
};

export const parseProducts = (rawProducts: unknown[]): ResultAsync<Product[], Error> => {
  const products = rawProducts
    .map(toProduct)
    .filter(p => !!p);

  return okAsync(products);
};
