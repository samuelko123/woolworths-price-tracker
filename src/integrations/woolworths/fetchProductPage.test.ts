import axios from "axios";

import { expectErr, expectOk } from "@/tests/helpers";
import { http, HttpResponse, testServer } from "@/tests/mocks/msw";

import { fetchProductPageWith } from "./fetchProductPage";

describe("fetchCategoryPage", () => {
  const API_BASE_URL = "https://www.woolworths.com.au";

  const category = {
    id: "123",
    urlName: "mock-category",
    displayName: "Mock Category",
  };
  const pageNumber = 1;

  it("returns raw response", async () => {
    const response = { hello: "world" };

    testServer.use(
      http.post(`${API_BASE_URL}/apis/ui/browse/category`, () => {
        return HttpResponse.json(response);
      }),
    );

    const client = axios.create({ baseURL: API_BASE_URL });
    const result = await fetchProductPageWith(client)(category, pageNumber);

    expectOk(result);
    expect(result.value).toEqual(response);
  });

  it("returns error when network fails", async () => {
    testServer.use(
      http.post(`${API_BASE_URL}/apis/ui/browse/category`, () => {
        return HttpResponse.error();
      }),
    );

    const client = axios.create({ baseURL: API_BASE_URL });
    const result = await fetchProductPageWith(client)(category, pageNumber);

    expectErr(result);
    expect(result.error.message).toBe("Network error");
  });
});
