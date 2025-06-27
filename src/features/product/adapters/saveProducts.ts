import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { ResultAsync } from "@/core/result";
import { type Product } from "@/domain";

import { type SaveProducts } from "../ports";

const dbClient = new DynamoDBClient({});
const client = DynamoDBDocumentClient.from(dbClient);

const saveProductsInternal = async (products: Product[]) => {
  for (const product of products) {
    await client.send(
      new PutCommand({
        TableName: "products",
        Item: product,
      }),
    );
  }
};

export const saveProducts: SaveProducts = (products) => {
  return ResultAsync.fromPromise(saveProductsInternal(products));
};
