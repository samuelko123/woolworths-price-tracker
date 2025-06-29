import { type ResultAsync } from "neverthrow";

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
}) => (message: SqsMessage): ResultAsync<SqsMessage, Error> => {
  return parseCategory(message)
    .andThen(fetchProducts)
    .andThen(saveProducts)
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
}): ResultAsync<void, Error> => {
  const handleMessage = handleCategoryMessage({ parseCategory, fetchProducts, saveProducts });

  return getCategoryQueueUrl()
    .andThen((queueUrl) => receiveMessage(queueUrl))
    .andThen((message) => handleMessage(message))
    .andThen((message) => deleteMessage(message));
};
