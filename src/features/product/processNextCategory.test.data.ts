import { type SqsMessage } from "@/core/sqs";
import { type Category, type Product } from "@/domain";

export const mockQueueUrl = "https://sqs.example.com/queue";

export const mockMessage: SqsMessage = {
  queueUrl: mockQueueUrl,
  receiptHandle: "abc123",
  body: "mock-body",
};

export const mockCategory: Category = {
  id: "123",
  displayName: "Fruit",
  urlName: "fruit",
};

export const mockProduct: Product =
{
  barcode: "1234567890123",
  sku: "123456",
  name: "Product 1",
  packageSize: "500g",
  imageUrl: "https://example.com/image1.jpg",
  price: 10.99,
};
