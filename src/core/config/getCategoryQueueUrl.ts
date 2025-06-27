import { ResultAsync } from "@/core/result";
import { type GetCategoryQueueUrl } from "@/features/product/ports";

export const getCategoryQueueUrl: GetCategoryQueueUrl = () => {
  const url = process.env.CATEGORY_QUEUE_URL;

  return url
    ? ResultAsync.ok(url)
    : ResultAsync.err(new Error("Missing CATEGORY_QUEUE_URL"));
};
