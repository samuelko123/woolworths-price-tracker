import { type ResultAsync } from "@/core/result";

import { type AcknowledgeMessage, type FetchProducts, type GetCategoryQueueUrl, type ParseCategory, type ReceiveMessage, type SaveProducts } from "./ports";

export const processNextCategory = ({
  getCategoryQueueUrl,
  receiveMessage,
  parseCategory,
  fetchProducts,
  saveProducts,
  acknowledgeMessage,
}: {
  getCategoryQueueUrl: GetCategoryQueueUrl,
  receiveMessage: ReceiveMessage
  parseCategory: ParseCategory,
  fetchProducts: FetchProducts,
  saveProducts: SaveProducts,
  acknowledgeMessage: AcknowledgeMessage,
}): ResultAsync<void> => {
  return getCategoryQueueUrl()
    .flatMap((queueUrl) => receiveMessage(queueUrl))
    .flatMap((message) => {
      return parseCategory(message)
        .flatMap((category) => fetchProducts(category))
        .flatMap((products) => saveProducts(products))
        .map(() => message);
    })
    .flatMap((message) => acknowledgeMessage(message));
};
