import { okAsync } from "neverthrow";

import { expectOk } from "@/tests/helpers";

import { importProducts } from "./importProducts";
import { mockCategory, mockMessage, mockProduct, mockRawProduct } from "./importProducts.test.data";

describe("importProducts", () => {
  it("calls all ports in sequence and acknowledges message", async () => {
    const mockRawProducts = [mockRawProduct];
    const mockProducts = [mockProduct];

    const receiveCategoryMessage = vi.fn().mockReturnValue(okAsync(mockMessage));
    const fetchProducts = vi.fn().mockReturnValue(okAsync(mockRawProducts));
    const saveProducts = vi.fn().mockReturnValue(okAsync(undefined));
    const acknowledgeMessage = vi.fn().mockReturnValue(okAsync(undefined));

    const result = await importProducts({
      receiveCategoryMessage,
      fetchProducts,
      saveProducts,
      deleteMessage: acknowledgeMessage,
    });

    expectOk(result);
    expect(receiveCategoryMessage).toHaveBeenCalledOnce();
    expect(fetchProducts).toHaveBeenCalledWith(mockCategory);
    expect(saveProducts).toHaveBeenCalledWith(mockProducts);
    expect(acknowledgeMessage).toHaveBeenCalledWith(mockMessage);
  });
});
