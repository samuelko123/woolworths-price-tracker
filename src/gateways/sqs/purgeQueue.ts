import {
  PurgeQueueCommand,
} from "@aws-sdk/client-sqs";
import { okAsync, ResultAsync } from "neverthrow";

import { toError } from "@/core/error";
import { type PurgeQueue } from "@/features/category";

import { client } from "./client";

export const purgeQueue: PurgeQueue = (queueUrl) => {
  const command = new PurgeQueueCommand({
    QueueUrl: queueUrl,
  });

  return ResultAsync
    .fromPromise(client.send(command), toError)
    .andThen(() => okAsync());
};
