import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { okAsync, ResultAsync } from "neverthrow";

import { toError } from "@/core/error";

import { client } from "./client";

export const sendMessage = <T extends Record<string, unknown>>(queueUrl: string, item: T): ResultAsync<void, Error> => {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(item),
  });

  return ResultAsync
    .fromPromise(client.send(command), toError)
    .andThen(() => okAsync());
};
