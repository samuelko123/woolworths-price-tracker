
import { logger } from "src/core/adapters/logger";

import { handler } from "./handler";
import { saveProductsForNextCategory } from "./service";

vi.mock("./service");
vi.mock("@/logger");

describe("handler", () => {
  it("returns 200 when success", async () => {
    const response = await handler();

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
      }),
    });
  });

  it("returns 500 when error occurred", async () => {
    const error = new Error("This is a test error");
    vi.mocked(saveProductsForNextCategory).mockRejectedValueOnce(error);

    const response = await handler();

    expect(response).toEqual({
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong",
      }),
    });
  });

  it("logs the error when error occurred", async () => {
    const error = new Error("This is a test error");
    vi.mocked(saveProductsForNextCategory).mockRejectedValueOnce(error);

    await handler();

    expect(logger.error).toHaveBeenCalledWith(error);
  });
});
