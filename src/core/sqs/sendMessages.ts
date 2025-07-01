import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { okAsync, ResultAsync } from "neverthrow";

import { toError } from "@/core/error";
import { type SendMessages } from "@/features/category/ports";

import { client } from "./client";

export const sendMessages: SendMessages = (queueUrl, items) => {
  return items.reduce<ResultAsync<void, Error>>((acc, item) => {
    return acc
      .andThen(() => {
        const command = new SendMessageCommand({
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(item),
        });

        return ResultAsync
          .fromPromise(client.send(command), toError)
          .andThen(() => okAsync());
      });
  }, okAsync());
};
