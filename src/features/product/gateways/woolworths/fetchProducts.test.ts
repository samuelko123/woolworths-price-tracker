import axios from "axios";
import { okAsync } from "neverthrow";
import { ZodError } from "zod";

import { createApiClient } from "@/gateways/woolworths";
import { expectErr, expectOk } from "@/tests/helpers";
import { http, HttpResponse, testServer } from "@/tests/mocks/msw";

import { fetchProducts } from "./fetchProducts";
import { mockCategory } from "./fetchProducts.test.data";

vi.mock("@/core/timing");
vi.mock("@/gateways/woolworths");

describe("fetchProducts", () => {
  const API_BASE_URL = "https://www.woolworths.com.au";
  const client = axios.create({ baseURL: API_BASE_URL });
  vi.mocked(createApiClient).mockReturnValue(okAsync(client));

  beforeEach(() => {
    testServer.use(
      http.get(API_BASE_URL, () => {
        return HttpResponse.text("OK");
      }),
    );
  });

  it("returns all products across pages", async () => {
    const totalItems = 3;

    const pagedResponses = [
      {
        TotalRecordCount: totalItems,
        Bundles: [{ Products: [{ id: 1 }] }],
      },
      {
        TotalRecordCount: totalItems,
        Bundles: [{ Products: [{ id: 2 }] }],
      },
      {
        TotalRecordCount: totalItems,
        Bundles: [{ Products: [{ id: 3 }] }],
      },
    ];

    let callCount = 0;

    testServer.use(
      http.post(`${API_BASE_URL}/apis/ui/browse/category`, async () => {
        callCount++;
        return HttpResponse.json(pagedResponses[callCount - 1]);
      }),
    );

    const result = await fetchProducts(mockCategory);

    expectOk(result);
    expect(result.value).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(callCount).toBe(3);
  });

  it("returns error when network fails", async () => {
    testServer.use(
      http.post(`${API_BASE_URL}/apis/ui/browse/category`, () => {
        return HttpResponse.error();
      }),
    );

    const result = await fetchProducts(mockCategory);

    expectErr(result);
    expect(result.error.message).toContain("Network error");
  });

  it("returns error when schema parsing fails", async () => {
    const invalidResponse = { unexpected: true };

    testServer.use(
      http.post(`${API_BASE_URL}/apis/ui/browse/category`, () => {
        return HttpResponse.json(invalidResponse);
      }),
    );

    const result = await fetchProducts(mockCategory);

    expectErr(result);
    expect(result.error).toBeInstanceOf(ZodError);
  });
});
