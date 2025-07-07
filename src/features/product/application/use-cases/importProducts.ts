import { type ResultAsync } from "neverthrow";

import { type SqsMessage } from "@/core/sqs";

import { type DeleteMessage, type FetchProducts, type GetCategoryQueueUrl, type ParseCategory, type ParseProducts, type ReceiveMessage, type SaveProducts } from "./importProducts.ports";

const handleCategoryMessage = ({
  parseCategory,
  fetchProducts,
  parseProducts,
  saveProducts,
}: {
  parseCategory: ParseCategory;
  fetchProducts: FetchProducts;
  parseProducts: ParseProducts;
  saveProducts: SaveProducts;
}) => (message: SqsMessage): ResultAsync<SqsMessage, Error> => {
  return parseCategory(message)
    .andThen(fetchProducts)
    .andThen(parseProducts)
    .andThen(saveProducts)
    .map(() => message);
};

export const importProducts = ({
  getCategoryQueueUrl,
  receiveMessage,
  parseCategory,
  fetchProducts,
  parseProducts,
  saveProducts,
  deleteMessage,
}: {
  getCategoryQueueUrl: GetCategoryQueueUrl,
  receiveMessage: ReceiveMessage
  parseCategory: ParseCategory,
  fetchProducts: FetchProducts,
  parseProducts: ParseProducts;
  saveProducts: SaveProducts,
  deleteMessage: DeleteMessage,
}): ResultAsync<void, Error> => {
  const handleMessage = handleCategoryMessage({ parseCategory, fetchProducts, saveProducts, parseProducts });

  return getCategoryQueueUrl()
    .andThen((queueUrl) => receiveMessage(queueUrl))
    .andThen((message) => handleMessage(message))
    .andThen((message) => deleteMessage(message));
};
