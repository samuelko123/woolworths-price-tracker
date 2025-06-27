import axios from "axios";

import { fetchAllPages } from "@/core/pagination";
import { ResultAsync } from "@/core/result";
import { createApiClient } from "@/integrations/woolworths";
import { expectErr, expectOk } from "@/tests/helpers/expectResult";

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
    vi.mocked(createApiClient).mockReturnValue(ResultAsync.ok(mockClient));
    vi.mocked(fetchAllPages).mockReturnValue(ResultAsync.ok(mockProducts));

    const result = await fetchProducts(mockCategory).toPromise();

    expectOk(result);
    expect(result.value).toEqual(mockProducts);
  });

  it("fails if createApiClient fails", async () => {
    const error = new Error("Auth failed");
    vi.mocked(createApiClient).mockReturnValue(ResultAsync.err(error));

    const result = await fetchProducts(mockCategory).toPromise();

    expectErr(result);
    expect(result.error).toBe(error);
    expect(fetchAllPages).not.toHaveBeenCalled();
  });

  it("fails if fetchAllPages fails", async () => {
    const error = new Error("Pagination error");

    vi.mocked(createApiClient).mockReturnValue(ResultAsync.ok(mockClient));
    vi.mocked(fetchAllPages).mockReturnValue(ResultAsync.err(error));

    const result = await fetchProducts(mockCategory).toPromise();

    expectErr(result);
    expect(result.error).toBe(error);
  });
});
