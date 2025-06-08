import { AxiosError } from "axios";
import { http, HttpResponse, testServer } from "../../test/server";
import { fetchCategories, fetchCategoryProducts } from "./apiClient";
import { ZodError } from "zod";
import { mockCategoriesResponse, mockCategoryProductsResponse } from "./apiClient.test.data";
import { mockCategory3 } from "./queue.test.data";

vi.mock("../shared/logger");

describe("fetchCategories", () => {
  it("throws axios error when network issue occurs", async () => {
    testServer.use(
      http.get(
        "https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials",
        () => HttpResponse.error()
      )
    );

    await expect(fetchCategories()).rejects.toThrow(AxiosError);
  });

  it("throws axios error when http status is not successful", async () => {
    testServer.use(
      http.get(
        "https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials",
        () => HttpResponse.json({ error: "Not Found" }, { status: 404 })
      )
    );

    await expect(fetchCategories()).rejects.toThrow(AxiosError);
  });

  it("throws zod error when response data does not match DTO schema", async () => {
    testServer.use(
      http.get(
        "https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials",
        () => HttpResponse.json({ hello: "world" }, { status: 200 })
      )
    );

    await expect(fetchCategories()).rejects.toThrow(ZodError);
  });

  it("returns DTO", async () => {
    testServer.use(
      http.get(
        "https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials",
        () => HttpResponse.json(mockCategoriesResponse, { status: 200 })
      )
    );

    const dto = await fetchCategories();
    expect(dto).toEqual({
      categories: [
        {
          id: mockCategoriesResponse.Categories[0].NodeId,
          level: mockCategoriesResponse.Categories[0].NodeLevel,
          urlName: mockCategoriesResponse.Categories[0].UrlFriendlyName,
          displayName: mockCategoriesResponse.Categories[0].Description,
        },
        {
          id: mockCategoriesResponse.Categories[1].NodeId,
          level: mockCategoriesResponse.Categories[1].NodeLevel,
          urlName: mockCategoriesResponse.Categories[1].UrlFriendlyName,
          displayName: mockCategoriesResponse.Categories[1].Description,
        },
      ],
    });
  });
});

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
        HttpResponse.text("<html></html>", { status: 200 })
      )
    );
  });

  it("throws axios error when network issue occurs", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.error()
      )
    );

    await expect(fetchCategoryProducts(mockCategory3)).rejects.toThrow(AxiosError);
  });

  it("throws axios error when http status is not successful", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json({ error: "Not Found" }, { status: 404 })
      )
    );

    await expect(fetchCategoryProducts(mockCategory3)).rejects.toThrow(AxiosError);
  });

  it("throws zod error when response data does not match DTO schema", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json({ hello: "world" }, { status: 200 })
      )
    );

    await expect(fetchCategoryProducts(mockCategory3)).rejects.toThrow(ZodError);
  });

  it("returns products", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json(mockCategoryProductsResponse, { status: 200 })
      )
    );

    const promise = fetchCategoryProducts(mockCategory3);
    await vi.advanceTimersByTimeAsync(1000); // simulate delay
    const products = await promise;

    expect(products).toEqual([
      {
        barcode: mockCategoryProductsResponse.Bundles[0].Products[0].Barcode,
        sku: mockCategoryProductsResponse.Bundles[0].Products[0].Stockcode,
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
        sku: mockCategoryProductsResponse.Bundles[1].Products[0].Stockcode,
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
        })
      );

      const promise = fetchCategoryProducts(mockCategory3);
      await vi.runAllTimersAsync(); // flush all timers
      await promise;

      expect(callCount).toBe(expectedCallCount);
    }
  );
});
