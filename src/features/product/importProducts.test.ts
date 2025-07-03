import { okAsync } from "neverthrow";

import { expectOk } from "@/tests/helpers";

import { importProducts } from "./importProducts";
import { mockCategory, mockMessage, mockProduct, mockQueueUrl, mockRawProduct } from "./importProducts.test.data";

describe("importProducts", () => {
  it("calls all ports in sequence and acknowledges message", async () => {
    const mockRawProducts = [mockRawProduct];
    const mockProducts = [mockProduct];

    const getCategoryQueueUrl = vi.fn().mockReturnValue(okAsync(mockQueueUrl));
    const receiveMessage = vi.fn().mockReturnValue(okAsync(mockMessage));
    const parseCategory = vi.fn().mockReturnValue(okAsync(mockCategory));
    const fetchProducts = vi.fn().mockReturnValue(okAsync(mockRawProducts));
    const parseProducts = vi.fn().mockReturnValue(okAsync(mockProducts));
    const saveProducts = vi.fn().mockReturnValue(okAsync(undefined));
    const acknowledgeMessage = vi.fn().mockReturnValue(okAsync(undefined));

    const result = await importProducts({
      getCategoryQueueUrl,
      receiveMessage,
      parseCategory,
      fetchProducts,
      parseProducts,
      saveProducts,
      deleteMessage: acknowledgeMessage,
    });

    expectOk(result);
    expect(getCategoryQueueUrl).toHaveBeenCalledOnce();
    expect(receiveMessage).toHaveBeenCalledWith(mockQueueUrl);
    expect(parseCategory).toHaveBeenCalledWith(mockMessage);
    expect(fetchProducts).toHaveBeenCalledWith(mockCategory);
    expect(saveProducts).toHaveBeenCalledWith(mockProducts);
    expect(acknowledgeMessage).toHaveBeenCalledWith(mockMessage);
  });
});
