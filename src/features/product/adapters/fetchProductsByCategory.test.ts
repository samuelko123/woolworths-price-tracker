import { AxiosError } from "axios";
import { ZodError } from "zod";

import { http, HttpResponse, testServer } from "@/tests/helper/msw";

import { fetchCategoryProducts } from "./fetchProductsByCategory";
import { mockCategory, mockCategoryProductsResponse } from "./fetchProductsByCategory.test.data";

vi.mock("@/logger");

describe("fetchProductsForCategory", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(global.Math, "random").mockReturnValue(0); // Always choose min delay
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    testServer.use(
      http.get("https://www.woolworths.com.au/", () =>
        HttpResponse.text("<html></html>", { status: 200 }),
      ),
    );
  });

  it("throws axios error when network issue occurs", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.error(),
      ),
    );

    await expect(fetchCategoryProducts(mockCategory)).rejects.toThrow(AxiosError);
  });

  it("throws axios error when http status is not successful", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json({ error: "Not Found" }, { status: 404 }),
      ),
    );

    await expect(fetchCategoryProducts(mockCategory)).rejects.toThrow(AxiosError);
  });

  it("throws zod error when response data does not match DTO schema", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json({ hello: "world" }, { status: 200 }),
      ),
    );

    await expect(fetchCategoryProducts(mockCategory)).rejects.toThrow(ZodError);
  });

  it("returns products", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json(mockCategoryProductsResponse, { status: 200 }),
      ),
    );

    const promise = fetchCategoryProducts(mockCategory);
    await vi.advanceTimersByTimeAsync(1000); // simulate delay
    const products = await promise;

    expect(products).toEqual([
      {
        barcode: mockCategoryProductsResponse.Bundles[0].Products[0].Barcode,
        sku: "123456",
        name: mockCategoryProductsResponse.Bundles[0].Products[0].DisplayName,
        packageSize:
          mockCategoryProductsResponse.Bundles[0].Products[0].PackageSize,
        imageUrl:
          mockCategoryProductsResponse.Bundles[0].Products[0].MediumImageFile,
        price: mockCategoryProductsResponse.Bundles[0].Products[0].Price,
      },
      {
        barcode:
          mockCategoryProductsResponse.Bundles[1].Products[0].Barcode,
        sku: "789012",
        name: mockCategoryProductsResponse.Bundles[1].Products[0].DisplayName,
        packageSize:
          mockCategoryProductsResponse.Bundles[1].Products[0].PackageSize,
        imageUrl:
          mockCategoryProductsResponse.Bundles[1].Products[0].MediumImageFile,
        price: mockCategoryProductsResponse.Bundles[1].Products[0].Price,
      },
    ]);
  });

  it.each([
    { totalRecordCount: 1, expectedCallCount: 1 },
    { totalRecordCount: 2, expectedCallCount: 1 },
    { totalRecordCount: 3, expectedCallCount: 2 },
    { totalRecordCount: 4, expectedCallCount: 2 },
    { totalRecordCount: 5, expectedCallCount: 3 },
  ])(
    "handles pagination - $totalRecordCount records",
    async ({ totalRecordCount, expectedCallCount }) => {
      const mockResponse = {
        ...mockCategoryProductsResponse,
        TotalRecordCount: totalRecordCount,
      };

      let callCount = 0;
      testServer.use(
        http.post("https://www.woolworths.com.au/apis/ui/browse/category", () => {
          callCount++;
          return HttpResponse.json(mockResponse, { status: 200 });
        }),
      );

      const promise = fetchCategoryProducts(mockCategory);
      await vi.runAllTimersAsync(); // flush all timers
      await promise;

      expect(callCount).toBe(expectedCallCount);
    },
  );
});
