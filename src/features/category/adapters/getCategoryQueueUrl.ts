import { errAsync, okAsync } from "neverthrow";

import { type GetCategoryQueueUrl } from "@/features/product/ports";

export const getCategoryQueueUrl: GetCategoryQueueUrl = () => {
  const url = process.env.CATEGORY_QUEUE_URL;

  return url
    ? okAsync(url)
    : errAsync(new Error("Missing CATEGORY_QUEUE_URL"));
};
