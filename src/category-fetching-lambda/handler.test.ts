import { logger } from "../shared/logger";
import * as category from "./category";
import { handler } from "./handler";

vi.mock("./category");
vi.mock("../shared/logger");
vi.mock("../shared/queue");

describe("handler", () => {
  it("returns 200 if success", async () => {
    const response = await handler();

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
      }),
    });
  });

  it("returns 500 if error occurred", async () => {
    vi.spyOn(category, "fetchCategories").mockImplementation(() => {
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

  it("logs if error occurred", async () => {
    const error = new Error("This is a test error");
    vi.spyOn(category, "fetchCategories").mockImplementation(() => {
      throw error;
    });

    await handler();

    expect(logger.error).toHaveBeenCalledWith(error);
  });
});
