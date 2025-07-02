import { type DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { okAsync, ResultAsync } from "neverthrow";

import { toError } from "@/core/error";

export const saveItem = <T extends Record<string, unknown>>(
  client: DynamoDBDocumentClient,
  tableName: string,
  item: T,
) => {
  return ResultAsync
    .fromPromise(
      client.send(
        new PutCommand({
          TableName: tableName,
          Item: item,
        }),
      ),
      toError,
    )
    .andThen(() => okAsync());
};
