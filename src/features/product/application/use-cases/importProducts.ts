import { type ResultAsync } from "neverthrow";

import { type GetCategoryQueueUrl, parseCategory } from "@/features/category";
import { type SqsMessage } from "@/gateways/sqs";

import { parseProducts } from "../services/parseProducts";
import { type DeleteMessage, type FetchProducts, type ReceiveMessage, type SaveProducts } from "./importProducts.ports";

const handleCategoryMessage = (fetchProducts: FetchProducts, saveProducts: SaveProducts) => (message: SqsMessage): ResultAsync<SqsMessage, Error> => {
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
  const handleMessage = handleCategoryMessage(fetchProducts, saveProducts);

  return getCategoryQueueUrl()
    .andThen((queueUrl) => receiveMessage(queueUrl))
    .andThen((message) => handleMessage(message))
    .andThen((message) => deleteMessage(message));
};
