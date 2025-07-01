import { AxiosError } from "axios";

import { expectErr, expectOk } from "@/tests/helpers";
import { http, HttpResponse, testServer } from "@/tests/mocks/msw";

import { fetchCategories } from "./fetchCategories";

describe("fetchCategories", () => {
  const API_BASE_URL = "https://www.woolworths.com.au";
  beforeEach(() => {
    testServer.use(
      http.get(API_BASE_URL, () => {
        return HttpResponse.text("OK");
      }),
    );
  });

  const ORIGINAL_ENV = process.env;
  beforeEach(() => {
    process.env.WOOLWORTHS_BASE_URL = "https://www.woolworths.com.au";
  });
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("returns raw response data", async () => {
    const mockResponse = { hello: "world" };

    testServer.use(
      http.get(`${API_BASE_URL}/apis/ui/PiesCategoriesWithSpecials`, () => {
        return HttpResponse.json(mockResponse);
      }),
    );

    const result = await fetchCategories();

    expectOk(result);
    expect(result.value).toEqual(expect.objectContaining(mockResponse));
  });

  it("returns error when response is invalid", async () => {
    testServer.use(
      http.get(`${API_BASE_URL}/apis/ui/PiesCategoriesWithSpecials`, () => {
        return HttpResponse.text("Something went wrong", { status: 500 });
      }),
    );

    const result = await fetchCategories();

    expectErr(result);
    expect(result.error).toBeInstanceOf(AxiosError);
  });

  it("returns error on network failure", async () => {
    testServer.use(
      http.get(`${API_BASE_URL}/apis/ui/PiesCategoriesWithSpecials`, () => {
        return HttpResponse.error();
      }),
    );

    const result = await fetchCategories();

    expectErr(result);
    expect(result.error.message).toBe("Network error");
  });
});
