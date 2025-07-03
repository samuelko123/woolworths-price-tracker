import axios from "axios";
import { ZodError } from "zod";

import { type Category } from "@/domain";
import { expectErr, expectOk } from "@/tests/helpers";
import { http, HttpResponse, testServer } from "@/tests/mocks/msw";

import { fetchCategoryPage } from "./fetchCategoryPage";
import { mockCategoryProductsResponse } from "./fetchCategoryPage.test.data";

const mockCategory: Category = {
  id: "fruit-123",
  urlName: "fruit",
  displayName: "Fresh Fruit",
};

describe("fetchCategoryPage", () => {
  const API_BASE_URL = "https://www.woolworths.com.au";

  it("returns parsed result", async () => {
    testServer.use(
      http.post(`${API_BASE_URL}/apis/ui/browse/category`, () => {
        return HttpResponse.json(mockCategoryProductsResponse);
      }),
    );

    const client = axios.create({ baseURL: API_BASE_URL });
    const result = await fetchCategoryPage(client, mockCategory, 1);

    expectOk(result);
    expect(result.value.items).toHaveLength(mockCategoryProductsResponse.Bundles.length);
    expect(result.value.items[0]).toEqual(mockCategoryProductsResponse.Bundles[0].Products[0]);
  });

  it("returns error when response does not match schema", async () => {
    const invalidResponse = { not: "valid" };

    testServer.use(
      http.post(`${API_BASE_URL}/apis/ui/browse/category`, () => {
        return HttpResponse.json(invalidResponse);
      }),
    );

    const client = axios.create({ baseURL: API_BASE_URL });
    const result = await fetchCategoryPage(client, mockCategory, 1);

    expectErr(result);
    expect(result.error).toBeInstanceOf(ZodError);
  });

  it("returns error when network fails", async () => {
    testServer.use(
      http.post(`${API_BASE_URL}/apis/ui/browse/category`, () => {
        return HttpResponse.error();
      }),
    );

    const client = axios.create({ baseURL: API_BASE_URL });
    const result = await fetchCategoryPage(client, mockCategory, 1);

    expectErr(result);
    expect(result.error.message).toBe("Network error");
  });
});
