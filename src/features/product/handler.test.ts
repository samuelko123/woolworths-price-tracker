import { errAsync, okAsync } from "neverthrow";

import { logError } from "@/core/logger";

import { handler } from "./handler";
import { importProducts } from "./importProducts";

vi.mock("./importProducts");

describe("handler", () => {
  it("returns 200 when success", async () => {
    vi.mocked(importProducts).mockReturnValue(okAsync(undefined));

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
    expect(logError).toHaveBeenCalledWith(error);
  });

  it("logs the error when it occurred", async () => {
    const error = new Error("This is a test error");
    vi.mocked(importProducts).mockReturnValue(errAsync(error));

    const response = await handler();

    expect(response).toEqual({
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    });
    expect(logError).toHaveBeenCalledWith(error);
  });
});
