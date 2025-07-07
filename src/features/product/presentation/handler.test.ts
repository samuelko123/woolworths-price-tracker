import { errAsync, okAsync } from "neverthrow";

import { logError } from "@/core/logger";

import { importProducts } from "../application/use-cases/importProducts";
import { handler } from "./handler";

vi.mock("../application/use-cases/importProducts");

describe("handler", () => {
  it("returns 200 when success", async () => {
    vi.mocked(importProducts).mockReturnValue(okAsync());

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
    vi.mocked(importProducts).mockReturnValue(errAsync(error));

    const response = await handler();

    expect(response).toEqual({
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    });
  });

  it("logs the error when it occurred", async () => {
    const error = new Error("This is a test error");
    vi.mocked(importProducts).mockReturnValue(errAsync(error));

    await handler();

    expect(logError).toHaveBeenCalledWith(error);
  });
});
