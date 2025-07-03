import { errAsync, okAsync } from "neverthrow";

import { logError } from "@/core/logger";

import { importCategories } from "../application/importCategories";
import { handler } from "./handler";

vi.mock("../application/importCategories");

describe("handler", () => {
  it("returns 200 when success", async () => {
    vi.mocked(importCategories).mockReturnValue(okAsync());

    const response = await handler();

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
      }),
    });
  });

  it("returns 500 when an error occurred", async () => {
    const error = new Error("This is a test error");
    vi.mocked(importCategories).mockReturnValue(errAsync(error));

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
    vi.mocked(importCategories).mockReturnValue(errAsync(error));

    await handler();

    expect(logError).toHaveBeenCalledWith(error);
  });
});
