import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { ResultAsync } from "@/core/result";

import { type SaveProduct } from "../ports";

const dbClient = new DynamoDBClient({});
const client = DynamoDBDocumentClient.from(dbClient);

export const saveProduct: SaveProduct = (product) => {
  const params = {
    TableName: "products",
    Item: product,
  };

  const command = new PutCommand(params);
  return ResultAsync.fromPromise(client.send(command));
};
