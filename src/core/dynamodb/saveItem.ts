import { type DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ResultAsync } from "neverthrow";

import { toError } from "@/core/error";

export const saveItem = (client: DynamoDBClient, tableName: string, item: Record<string, unknown>) => {
  return ResultAsync.fromPromise(
    client.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
      }),
    ),
    toError,
  );
};
