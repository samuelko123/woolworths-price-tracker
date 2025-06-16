import { AxiosError } from "axios";
import { ZodError } from "zod";

import { http, HttpResponse, testServer } from "@/test/server";

import { fetchCategories } from "./category";
import { mockCategoriesResponse } from "./category.test.data";

vi.mock("@/logger");

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
        {
          id: mockCategoriesResponse.Categories[2].NodeId,
          level: mockCategoriesResponse.Categories[2].NodeLevel,
          urlName: mockCategoriesResponse.Categories[2].UrlFriendlyName,
          displayName: mockCategoriesResponse.Categories[2].Description,
        },
      ],
    });
  });
});

