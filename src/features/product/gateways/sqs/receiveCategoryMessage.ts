import { getCategoryQueueUrl } from "@/core/config";
import { receiveMessage } from "@/gateways/sqs";

import { type ReceiveCategoryMessage } from "../../application/use-cases/importProducts.ports";

export const receiveCategoryMessage: ReceiveCategoryMessage = () => {
  return getCategoryQueueUrl()
    .andThen(receiveMessage);
};
