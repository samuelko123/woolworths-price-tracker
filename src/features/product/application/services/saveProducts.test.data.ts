import { type Product } from "../../domain/product";

export const mockProduct1: Product = {
  barcode: "1234567890123",
  sku: "123456",
  name: "Sample Product",
  price: 19.99,
  packageSize: "500g",
  imageUrl: "https://example.com/sample-product.jpg",
};

export const mockProduct2: Product = {
  barcode: "9876543210987",
  sku: "654321",
  name: "Another Product",
  price: 29.99,
  packageSize: "1kg",
  imageUrl: "https://example.com/another-product.jpg",
};
