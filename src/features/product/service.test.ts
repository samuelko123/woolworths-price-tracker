import { ok } from "@/core/result";

import { saveProductsForNextCategory } from "./service";
import { mockCategory, mockProduct1, mockProduct2 } from "./service.test.data";

describe("saveProductsForNextCategory", () => {
  it("runs successfully", async () => {
    const acknowledge = vi.fn();
    const dequeueCategory = vi.fn().mockResolvedValue(ok({
      category: mockCategory,
      acknowledge,
    }));
    const fetchProducts = vi.fn().mockResolvedValue(ok([mockProduct1, mockProduct2]));
    const saveProduct = vi.fn().mockResolvedValue(null);

    await saveProductsForNextCategory({
      dequeueCategory,
      fetchProducts,
      saveProduct,
    });

    expect(dequeueCategory).toHaveBeenCalled();
    expect(fetchProducts).toHaveBeenCalledWith(mockCategory);
    expect(saveProduct).toHaveBeenCalledTimes(2);
    expect(saveProduct).toHaveBeenNthCalledWith(1, mockProduct1);
    expect(saveProduct).toHaveBeenNthCalledWith(2, mockProduct2);
    expect(acknowledge).toHaveBeenCalled();
  });
});
