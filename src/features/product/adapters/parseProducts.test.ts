import { ZodError } from "zod";

import { expectErr, expectOk } from "@/tests/helpers";

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

  it("returns error when input is invalid", async () => {
    const invalidRawProduct = { invalid: "data" };

    // @ts-expect-error test passing invalid string argument
    const result = await parseProducts([invalidRawProduct]);

    expectErr(result);
    expect(result.error).toBeInstanceOf(ZodError);
  });

  it("returns empty array when given no input", async () => {
    const result = await parseProducts([]);

    expectOk(result);
    expect(result.value).toEqual([]);
  });
});
