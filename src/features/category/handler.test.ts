import { logError } from "@/core/logger";

import { handler } from "./handler";
import { fetchAndQueueCategories } from "./service";

vi.mock("./service");
vi.mock("@/core/logger", () => {
  return {
    logError: vi.fn(),
    logDuration: vi.fn().mockImplementation(async (_, fn) => await fn()),
  };
});

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

  it("returns 500 when an error occurred", async () => {
    vi.mocked(fetchAndQueueCategories).mockImplementation(() => {
      throw new Error("This is a test error");
    });

    const response = await handler();

    expect(response).toEqual({
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong",
      }),
    });
  });

  it("logs the error when it occurred", async () => {
    const error = new Error("This is a test error");
    vi.mocked(fetchAndQueueCategories).mockImplementation(() => {
      throw new Error("This is a test error");
    });

    await handler();

    expect(logError).toHaveBeenCalledWith(error);
  });
});
