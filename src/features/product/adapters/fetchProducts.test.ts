import axios from "axios";
import { errAsync, okAsync } from "neverthrow";

import { fetchAllPages } from "@/core/pagination";
import { createApiClient } from "@/integrations/woolworths";
import { expectErr, expectOk } from "@/tests/helpers";

import { fetchProducts } from "./fetchProducts";

const mockClient = axios.create();
const mockCategory = { id: "123", urlName: "fruit", displayName: "Fruit" };
const mockProducts = [{ id: 1 }, { id: 2 }];

vi.mock("@/core/pagination");
vi.mock("@/core/timing");
vi.mock("@/integrations/woolworths");

describe("fetchProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns products when all dependencies succeed", async () => {
    vi.mocked(createApiClient).mockReturnValue(okAsync(mockClient));
    vi.mocked(fetchAllPages).mockReturnValue(okAsync(mockProducts));

    const result = await fetchProducts(mockCategory);

    expectOk(result);
    expect(result.value).toEqual(mockProducts);
  });

  it("fails if createApiClient fails", async () => {
    const error = new Error("Auth failed");
    vi.mocked(createApiClient).mockReturnValue(errAsync(error));

    const result = await fetchProducts(mockCategory);

    expectErr(result);
    expect(result.error).toBe(error);
    expect(fetchAllPages).not.toHaveBeenCalled();
  });

  it("fails if fetchAllPages fails", async () => {
    const error = new Error("Pagination error");

    vi.mocked(createApiClient).mockReturnValue(okAsync(mockClient));
    vi.mocked(fetchAllPages).mockReturnValue(errAsync(error));

    const result = await fetchProducts(mockCategory);

    expectErr(result);
    expect(result.error).toBe(error);
  });
});
