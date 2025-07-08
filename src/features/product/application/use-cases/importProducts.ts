import { type ResultAsync } from "neverthrow";

import { type SqsMessage } from "@/core/sqs";
import { parseCategory } from "@/features/category";

import { parseProducts } from "../services/parseProducts";
import { type DeleteMessage, type FetchProducts, type GetCategoryQueueUrl, type ReceiveMessage, type SaveProducts } from "./importProducts.ports";

const handleCategoryMessage = ({
  fetchProducts,
  saveProducts,
}: {
  fetchProducts: FetchProducts;
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
  fetchProducts,
  saveProducts,
  deleteMessage,
}: {
  getCategoryQueueUrl: GetCategoryQueueUrl,
  receiveMessage: ReceiveMessage
  fetchProducts: FetchProducts,
  saveProducts: SaveProducts,
  deleteMessage: DeleteMessage,
}): ResultAsync<void, Error> => {
  const handleMessage = handleCategoryMessage({ fetchProducts, saveProducts });

  return getCategoryQueueUrl()
    .andThen((queueUrl) => receiveMessage(queueUrl))
    .andThen((message) => handleMessage(message))
    .andThen((message) => deleteMessage(message));
};
