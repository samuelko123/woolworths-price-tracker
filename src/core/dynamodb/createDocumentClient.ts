import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const createDocumentClient = (): DynamoDBDocumentClient => {
  const dbClient = new DynamoDBClient({});
  return DynamoDBDocumentClient.from(dbClient);
};
