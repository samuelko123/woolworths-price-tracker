import { Category } from "@/domain";

type ReceiptHandle = string;

type DequeueResult = {
  category: Category;
  handle: ReceiptHandle;
};

export type DequeueCategory = () => Promise<DequeueResult | null>;

export type DeleteCategoryFromQueue = (handle: ReceiptHandle) => Promise<void>;
