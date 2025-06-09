import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Product } from "../schema";

const dbClient = new DynamoDBClient();
const client = DynamoDBDocumentClient.from(dbClient);

export const saveProduct = async (product: Product): Promise<void> => {
  const params = {
    TableName: "products",
    Item: product,
  };

  const command = new PutCommand(params);
  await client.send(command);
}
