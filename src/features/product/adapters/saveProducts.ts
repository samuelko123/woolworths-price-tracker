import { type DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { okAsync, type ResultAsync } from "neverthrow";

import { saveItem } from "@/core/dynamodb";

import { type SaveProducts } from "../application/use-cases/importProducts.ports";
import { type Product } from "../domain/product";

export const saveProductsWith = (client: DynamoDBDocumentClient): SaveProducts => {
  return (products: Product[]) =>
    products.reduce<ResultAsync<void, Error>>((acc, product) => {
      return acc.andThen(() => saveItem(client, "products", product));
    }, okAsync());
};
