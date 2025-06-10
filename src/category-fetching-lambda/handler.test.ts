import { logger } from "../shared/logger";
import { handler } from "./handler";
import * as main from "./main";

vi.mock("./main");
vi.mock("../shared/logger");

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
