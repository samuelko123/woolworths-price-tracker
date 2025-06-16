import { AxiosError } from "axios";
import { ZodError } from "zod";

import { fetchCategoryProducts } from "@/src/shared/apiClient";
import { mockCategoryProductsResponse } from "@/src/shared/apiClient.test.data";
import { mockCategory3 } from "@/src/shared/queue.test.data";
import { http, HttpResponse, testServer } from "@/test/server";

vi.mock("../shared/logger");

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

    await expect(fetchCategoryProducts(mockCategory3)).rejects.toThrow(AxiosError);
  });

  it("throws axios error when http status is not successful", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json({ error: "Not Found" }, { status: 404 }),
      ),
    );

    await expect(fetchCategoryProducts(mockCategory3)).rejects.toThrow(AxiosError);
  });

  it("throws zod error when response data does not match DTO schema", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json({ hello: "world" }, { status: 200 }),
      ),
    );

    await expect(fetchCategoryProducts(mockCategory3)).rejects.toThrow(ZodError);
  });

  it("returns products", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json(mockCategoryProductsResponse, { status: 200 }),
      ),
    );

    const promise = fetchCategoryProducts(mockCategory3);
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

      const promise = fetchCategoryProducts(mockCategory3);
      await vi.runAllTimersAsync(); // flush all timers
      await promise;

      expect(callCount).toBe(expectedCallCount);
    },
  );
});
