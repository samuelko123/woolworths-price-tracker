import { logger } from "@/logger";
import { handler } from "@/src/category-fetching-lambda/handler";
import * as main from "@/src/category-fetching-lambda/main";

vi.mock("./main");
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

  it("returns 500 when an error occurred", async () => {
    vi.spyOn(main, "main").mockImplementation(() => {
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
    vi.spyOn(main, "main").mockImplementation(() => {
      throw new Error("This is a test error");
    });

    await handler();

    expect(logger.error).toHaveBeenCalledWith(error);
  });
});
