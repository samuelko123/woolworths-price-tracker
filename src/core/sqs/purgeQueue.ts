import {
  PurgeQueueCommand,
} from "@aws-sdk/client-sqs";
import { okAsync, ResultAsync } from "neverthrow";

import { toError } from "@/core/error";

import { client } from "./client";

export const purgeQueue = (queueUrl: string): ResultAsync<void, Error> => {
  const command = new PurgeQueueCommand({
    QueueUrl: queueUrl,
  });

  return ResultAsync
    .fromPromise(client.send(command), toError)
    .andThen(() => okAsync());
};
