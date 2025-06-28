import { logError } from "@/core/logger";
import { ResultAsync } from "@/core/result";

import { handler } from "./handler";
import { importProducts } from "./importProducts";

vi.mock("./importProducts");

describe("handler", () => {
  it("returns 200 when success", async () => {
    vi.mocked(importProducts).mockReturnValue(ResultAsync.ok(undefined));

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
    vi.mocked(importProducts).mockReturnValue(ResultAsync.err(error));

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
    vi.mocked(importProducts).mockReturnValue(ResultAsync.err(error));

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
