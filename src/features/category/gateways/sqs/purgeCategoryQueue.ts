import { getCategoryQueueUrl } from "@/core/config";
import { purgeQueue } from "@/gateways/sqs";

import { type PurgeCategoryQueue } from "../../application/use-cases/importCategories.ports";

export const purgeCategoryQueue: PurgeCategoryQueue = () => {
  return getCategoryQueueUrl().andThen(purgeQueue);
};
