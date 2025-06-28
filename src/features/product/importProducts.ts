import { type ResultAsync } from "@/core/result";
import { type SqsMessage } from "@/core/sqs";

import { type DeleteMessage, type FetchProducts, type GetCategoryQueueUrl, type ParseCategory, type ReceiveMessage, type SaveProducts } from "./ports";

const handleCategoryMessage = ({
  parseCategory,
  fetchProducts,
  saveProducts,
}: {
  parseCategory: ParseCategory;
  fetchProducts: FetchProducts;
  saveProducts: SaveProducts;
}) => (message: SqsMessage): ResultAsync<SqsMessage> => {
  return parseCategory(message)
    .flatMap(fetchProducts)
    .flatMap(saveProducts)
    .map(() => message);
};

export const importProducts = ({
  getCategoryQueueUrl,
  receiveMessage,
  parseCategory,
  fetchProducts,
  saveProducts,
  deleteMessage,
}: {
  getCategoryQueueUrl: GetCategoryQueueUrl,
  receiveMessage: ReceiveMessage
  parseCategory: ParseCategory,
  fetchProducts: FetchProducts,
  saveProducts: SaveProducts,
  deleteMessage: DeleteMessage,
}): ResultAsync<void> => {
  const handleMessage = handleCategoryMessage({ parseCategory, fetchProducts, saveProducts });

  return getCategoryQueueUrl()
    .flatMap((queueUrl) => receiveMessage(queueUrl))
    .flatMap((message) => handleMessage(message))
    .flatMap((message) => deleteMessage(message));
};
