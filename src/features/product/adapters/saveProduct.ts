import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { SaveProduct } from "../ports";

const dbClient = new DynamoDBClient({});
const client = DynamoDBDocumentClient.from(dbClient);

export const saveProduct: SaveProduct = async (product) => {
  const params = {
    TableName: "products",
    Item: product,
  };

  const command = new PutCommand(params);
  await client.send(command);
};
