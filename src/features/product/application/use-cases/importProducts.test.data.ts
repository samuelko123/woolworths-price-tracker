import { type SqsMessage } from "@/core/sqs";
import { type Category } from "@/features/category";

import { type Product } from "../../domain/product";

export const mockCategory: Category = {
  id: "123",
  displayName: "Fruit",
  urlName: "fruit",
};

export const mockQueueUrl = "https://sqs.example.com/queue";

export const mockMessage: SqsMessage = {
  queueUrl: mockQueueUrl,
  receiptHandle: "abc123",
  body: JSON.stringify(mockCategory),
};

export const mockRawProduct = {
  Barcode: "1234567890123",
  Stockcode: 123456,
  DisplayName: "Product 1",
  PackageSize: "500g",
  MediumImageFile: "https://example.com/image1.jpg",
  Price: 10.99,
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
