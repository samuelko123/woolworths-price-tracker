import { okAsync, type ResultAsync } from "neverthrow";

import { createDocumentClient, saveItem } from "@/core/dynamodb";
import { type Product } from "@/domain";

import { type SaveProducts } from "../ports";

export const saveProducts: SaveProducts = (products: Product[]) => {
  const client = createDocumentClient();

  return products.reduce<ResultAsync<void, Error>>((acc, product) => {
    return acc
      .andThen(() => saveItem(client, "products", product))
      .andThen(() => okAsync());
  }, okAsync());
};
