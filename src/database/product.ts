import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { Product } from "@/domain";
import { logger } from "@/logger";

const dbClient = new DynamoDBClient({});
const client = DynamoDBDocumentClient.from(dbClient);

export const saveProduct = async (product: Product): Promise<void> => {
  const params = {
    TableName: "products",
    Item: product,
  };

  const command = new PutCommand(params);
  await client.send(command);

  logger.debug({
    message: "Saved a product",
    sku: product.sku,
    name: product.name,
  });
};
