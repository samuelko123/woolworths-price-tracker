import { type DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { okAsync, type ResultAsync } from "neverthrow";

import { type Product, type SaveProducts } from "@/features/product";

import { saveItem } from "./saveItem";

export const saveProductsWith = (client: DynamoDBDocumentClient): SaveProducts => {
  return (products: Product[]) =>
    products.reduce<ResultAsync<void, Error>>((acc, product) => {
      return acc.andThen(() => saveItem(client, "products", product));
    }, okAsync());
};
