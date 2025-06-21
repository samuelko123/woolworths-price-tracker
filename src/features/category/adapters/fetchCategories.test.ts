import { AxiosError } from "axios";
import { ZodError } from "zod";

import { http, HttpResponse, testServer } from "@/tests/helper/msw";

import { fetchCategories } from "./fetchCategories";
import { mockCategoriesResponse } from "./fetchCategories.test.data";

describe("fetchCategories", () => {
  it("throws axios error when network issue occurs", async () => {
    testServer.use(
      http.get(
        "https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials",
        () => HttpResponse.error(),
      ),
    );

    await expect(fetchCategories()).rejects.toThrow(AxiosError);
  });

  it("throws axios error when http status is not successful", async () => {
    testServer.use(
      http.get(
        "https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials",
        () => HttpResponse.json({ error: "Not Found" }, { status: 404 }),
      ),
    );

    await expect(fetchCategories()).rejects.toThrow(AxiosError);
  });

  it("throws zod error when response data does not match DTO schema", async () => {
    testServer.use(
      http.get(
        "https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials",
        () => HttpResponse.json({ hello: "world" }, { status: 200 }),
      ),
    );

    await expect(fetchCategories()).rejects.toThrow(ZodError);
  });

  it("returns DTO", async () => {
    testServer.use(
      http.get(
        "https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials",
        () => HttpResponse.json(mockCategoriesResponse, { status: 200 }),
      ),
    );

    const categories = await fetchCategories();
    expect(categories).toEqual([
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
      {
        id: mockCategoriesResponse.Categories[2].NodeId,
        level: mockCategoriesResponse.Categories[2].NodeLevel,
        urlName: mockCategoriesResponse.Categories[2].UrlFriendlyName,
        displayName: mockCategoriesResponse.Categories[2].Description,
      },
    ]);
  });
});
