import { errAsync, okAsync } from "neverthrow";

import { logError } from "@/core/logger";
import { http, HttpResponse, testServer } from "@/tests/mocks/msw";

import { importProducts } from "../application/use-cases/importProducts";
import { handler } from "./handler";

vi.mock("../application/use-cases/importProducts");

describe("handler", () => {
  const ORIGINAL_ENV = process.env;
  beforeEach(() => {
    process.env.WOOLWORTHS_BASE_URL = "https://www.woolworths.com.au";
  });
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  beforeEach(() => {
    testServer.use(
      http.get("https://www.woolworths.com.au", () => {
        return HttpResponse.text("OK");
      }),
    );
  });

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
