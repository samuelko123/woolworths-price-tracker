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
  it("throws axios error when network issue occurs", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.error()
      )
    );

    await expect(fetchCategoryProducts(mockCategory3)).rejects.toThrow(
      AxiosError
    );
  });

  it("throws axios error when http status is not successful", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json({ error: "Not Found" }, { status: 404 })
      )
    );

    await expect(fetchCategoryProducts(mockCategory3)).rejects.toThrow(
      AxiosError
    );
  });

  it("throws zod error when response data does not match DTO schema", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json({ hello: "world" }, { status: 200 })
      )
    );

    await expect(fetchCategoryProducts(mockCategory3)).rejects.toThrow(
      ZodError
    );
  });

  it("returns products", async () => {
    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json(mockCategoryProductsResponse, { status: 200 })
      )
    );

    const dto = await fetchCategoryProducts(mockCategory3);
    expect(dto).toEqual([
      {
        sku: mockCategoryProductsResponse.Bundles[0].Products[0].Stockcode,
        name: mockCategoryProductsResponse.Bundles[0].Products[0].DisplayName,
        packageSize:
          mockCategoryProductsResponse.Bundles[0].Products[0].PackageSize,
        imageUrl:
          mockCategoryProductsResponse.Bundles[0].Products[0].MediumImageFile,
        price: mockCategoryProductsResponse.Bundles[0].Products[0].Price,
      },
      {
        sku: mockCategoryProductsResponse.Bundles[0].Products[1].Stockcode,
        name: mockCategoryProductsResponse.Bundles[0].Products[1].DisplayName,
        packageSize:
          mockCategoryProductsResponse.Bundles[0].Products[1].PackageSize,
        imageUrl:
          mockCategoryProductsResponse.Bundles[0].Products[1].MediumImageFile,
        price: mockCategoryProductsResponse.Bundles[0].Products[1].Price,
      },
    ]);
  });
});
