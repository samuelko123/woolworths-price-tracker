import { ok } from "@/core/result";

import * as adapters from "./adapters";
import { dequeueCategory, fetchProducts, saveProduct } from "./adapters";
import { saveProductsForNextCategory } from "./service";
import { mockCategory, mockProduct1, mockProduct2 } from "./service.test.data";

vi.mock("./adapters");

describe("saveProductsForNextCategory", () => {
  it("runs successfully", async () => {
    const acknowledge = vi.fn();

    vi.mocked(dequeueCategory).mockResolvedValue(
      ok({ category: mockCategory, acknowledge }),
    );
    vi.mocked(fetchProducts).mockResolvedValue(
      ok([mockProduct1, mockProduct2]),
    );
    vi.mocked(saveProduct).mockResolvedValue(undefined);

    await saveProductsForNextCategory();

    expect(adapters.dequeueCategory).toHaveBeenCalled();
    expect(adapters.fetchProducts).toHaveBeenCalledWith(mockCategory);
    expect(adapters.saveProduct).toHaveBeenCalledTimes(2);
    expect(adapters.saveProduct).toHaveBeenNthCalledWith(1, mockProduct1);
    expect(adapters.saveProduct).toHaveBeenNthCalledWith(2, mockProduct2);
    expect(acknowledge).toHaveBeenCalled();
  });
});
