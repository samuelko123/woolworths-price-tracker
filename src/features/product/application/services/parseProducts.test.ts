import { expectOk } from "@/tests/helpers";

import { parseProducts } from "./parseProducts";

describe("parseProducts", () => {
  it("returns parsed products when input is valid", async () => {
    const validRawProduct = {
      Barcode: "1234567890123",
      Stockcode: 123456,
      DisplayName: "Product 1",
      PackageSize: "500g",
      MediumImageFile: "https://example.com/image1.jpg",
      Price: 10.99,
    };

    const result = await parseProducts([validRawProduct]);

    expectOk(result);
    expect(result.value).toEqual([
      {
        barcode: "1234567890123",
        sku: "123456",
        name: "Product 1",
        packageSize: "500g",
        imageUrl: "https://example.com/image1.jpg",
        price: 10.99,
      },
    ]);
  });

  it("filters out invalid products without returning error", async () => {
    const invalidRawProduct = { invalid: "data" };

    const result = await parseProducts([invalidRawProduct]);

    expectOk(result);
    expect(result.value).toEqual([]);
  });

  it("filters out products with missing barcode", async () => {
    const productMissingBarcode = {
      Barcode: null,
      Stockcode: 123,
      DisplayName: "No Barcode Product",
      PackageSize: "1kg",
      MediumImageFile: "https://example.com/image.jpg",
      Price: 5.99,
    };

    const result = await parseProducts([productMissingBarcode]);

    expectOk(result);
    expect(result.value).toEqual([]);
  });

  it("returns empty array when given no input", async () => {
    const result = await parseProducts([]);

    expectOk(result);
    expect(result.value).toEqual([]);
  });
});
