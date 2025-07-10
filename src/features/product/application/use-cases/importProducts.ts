import { type ResultAsync } from "neverthrow";

import { parseCategory } from "@/features/category";
import { type SqsMessage } from "@/gateways/sqs";

import { parseProducts } from "../services/parseProducts";
import { type DeleteMessage, type FetchProducts, type ReceiveCategoryMessage, type SaveProducts } from "./importProducts.ports";

const handleCategoryMessage = (fetchProducts: FetchProducts, saveProducts: SaveProducts) => (message: SqsMessage): ResultAsync<SqsMessage, Error> => {
  return parseCategory(message)
    .andThen(fetchProducts)
    .andThen(parseProducts)
    .andThen(saveProducts)
    .map(() => message);
};

export const importProducts = ({
  receiveCategoryMessage,
  fetchProducts,
  saveProducts,
  deleteMessage,
}: {
  receiveCategoryMessage: ReceiveCategoryMessage
  fetchProducts: FetchProducts,
  saveProducts: SaveProducts,
  deleteMessage: DeleteMessage,
}): ResultAsync<void, Error> => {
  const handleMessage = handleCategoryMessage(fetchProducts, saveProducts);

  return receiveCategoryMessage()
    .andThen(handleMessage)
    .andThen(deleteMessage);
};
