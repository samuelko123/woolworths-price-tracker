import { type Category } from "@/features/category";
import { type SqsMessage } from "@/gateways/sqs";

export const mockCategory: Category = {
  id: "1-E5BEE36E",
  urlName: "fruit-veg",
  displayName: "Fruit & Veg",
};

export const mockSqsMessage: SqsMessage = {
  queueUrl: "https://test-queue",
  body: JSON.stringify(mockCategory),
  receiptHandle: "abc123",
};
